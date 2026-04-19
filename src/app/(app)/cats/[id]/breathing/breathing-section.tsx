import { getBreathingLogs } from "@/lib/actions/breathing";
import { BreathingChart } from "@/components/health/BreathingChart";
import { BreathingLogList } from "@/components/health/BreathingLogList";

export async function BreathingSection({ catId }: { catId: string }) {
  const logs = await getBreathingLogs(catId, 30);
  const logsReversed = logs.slice().reverse();

  return (
    <>
      <BreathingChart logs={logsReversed} />
      <BreathingLogList catId={catId} logs={logsReversed} />
    </>
  );
}
