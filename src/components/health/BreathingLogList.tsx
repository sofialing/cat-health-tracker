"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteBreathingLog } from "@/lib/actions/breathing";
import { Button } from "@/components/ui/button";
import type { BreathingLog } from "@/types";
import { formatDate } from "@/lib/utils";

const NORMAL_MIN = 20;
const NORMAL_MAX = 30;

interface BreathingLogListProps {
  catId: string;
  logs: BreathingLog[];
}

export function BreathingLogList({ catId, logs }: BreathingLogListProps) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No breathing entries yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <BreathingLogItem key={log.id} catId={catId} log={log} />
      ))}
    </div>
  );
}

function BreathingLogItem({
  catId,
  log,
}: {
  catId: string;
  log: BreathingLog;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const isNormal =
    log.breathsPerMinute >= NORMAL_MIN && log.breathsPerMinute <= NORMAL_MAX;

  function handleDelete() {
    startTransition(async () => {
      await deleteBreathingLog(catId, log.id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-xl border bg-card">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{log.breathsPerMinute} bpm</p>
          {!isNormal && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              outside normal range
            </span>
          )}
        </div>
        {log.notes && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {log.notes}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <p className="text-xs text-muted-foreground">{formatDate(log.date)}</p>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
          disabled={pending}
          aria-label="Delete entry"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
