import { notFound } from "next/navigation";
import { getCatById } from "@/lib/actions/cats";
import { getWeightLogs } from "@/lib/actions/weight";
import { CatTabBar } from "@/components/cats/CatTabBar";
import { WeightChart } from "@/components/health/WeightChart";
import { LogList } from "@/components/health/LogList";
import { WeightLogForm } from "@/components/health/WeightLogForm";
import { formatWeight, formatDate } from "@/lib/utils";
import { Scale } from "lucide-react";

export default async function WeightPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCatById(id);
  if (!cat) notFound();

  const logs = (await getWeightLogs(id)).slice().reverse();

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2 px-4 h-14 max-w-lg mx-auto">
          <div className="size-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm">
            <Scale className="size-4" />
          </div>
          <h1 className="text-lg font-semibold">
            {cat.name} · <span className="text-blue-600">Weight</span>
          </h1>
        </div>
      </header>
      <CatTabBar catId={id} />
      <div className="px-4 py-4 pb-20 lg:pb-6 space-y-6">
        <WeightChart logs={logs.slice().reverse()} unit={cat.weightUnit} />
        <WeightLogForm catId={id} unit={cat.weightUnit} />
        <LogList
          items={logs.map((log) => ({
            id: log.id,
            primary: formatWeight(log.weight, log.unit),
            secondary: log.notes,
            date: formatDate(log.date),
          }))}
          emptyMessage="No weight entries yet."
        />
      </div>
    </>
  );
}
