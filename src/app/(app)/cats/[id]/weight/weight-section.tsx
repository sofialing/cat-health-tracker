import { getWeightLogs } from "@/lib/actions/weight";
import { WeightChart } from "@/components/health/WeightChart";
import { LogList } from "@/components/health/LogList";
import { formatWeight, formatDate } from "@/lib/utils";

export async function WeightSection({
  catId,
  unit,
}: {
  catId: string;
  unit: "kg" | "lbs";
}) {
  const logs = await getWeightLogs(catId, 30);
  const logsReversed = logs.slice().reverse();

  return (
    <>
      <WeightChart logs={logsReversed} unit={unit} />
      <LogList
        items={logsReversed.map((log) => ({
          id: log.id,
          primary: formatWeight(log.weight, log.unit),
          secondary: log.notes,
          date: formatDate(log.date),
        }))}
        emptyMessage="No weight entries yet."
      />
    </>
  );
}
