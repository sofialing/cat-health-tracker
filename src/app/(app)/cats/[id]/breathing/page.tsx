import { notFound } from "next/navigation";
import { getCatById } from "@/lib/actions/cats";
import { getBreathingLogs } from "@/lib/actions/breathing";
import { CatTabBar } from "@/components/cats/CatTabBar";
import { BreathingChart } from "@/components/health/BreathingChart";
import { BreathingLogForm } from "@/components/health/BreathingLogForm";
import { BreathingLogList } from "@/components/health/BreathingLogList";
import { Wind } from "lucide-react";

export default async function BreathingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCatById(id);
  if (!cat) notFound();

  const logs = (await getBreathingLogs(id)).slice().reverse();

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2 px-4 h-14 max-w-lg mx-auto">
          <div className="size-7 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 text-sm">
            <Wind className="size-4" />
          </div>
          <h1 className="text-lg font-semibold">
            {cat.name} · <span className="text-teal-600">Breathing</span>
          </h1>
        </div>
      </header>
      <CatTabBar catId={id} />
      <div className="px-4 py-4 pb-20 lg:pb-6 space-y-6">
        <BreathingChart logs={logs.slice().reverse()} />
        <BreathingLogForm catId={id} />
        <BreathingLogList catId={id} logs={logs} />
      </div>
    </>
  );
}
