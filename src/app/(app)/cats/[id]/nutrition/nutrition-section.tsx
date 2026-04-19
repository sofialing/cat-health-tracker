import { getNutritionLogs } from "@/lib/actions/nutrition";
import { LogList } from "@/components/health/LogList";
import { formatDate } from "@/lib/utils";

export async function NutritionSection({ catId }: { catId: string }) {
  const logs = await getNutritionLogs(catId);

  if (logs.length === 0) {
    return null;
  }

  return (
    <LogList
      items={logs.map((log) => ({
        id: log.id,
        primary: `${log.brand ?? "Unknown brand"} · ${log.foodType}`,
        secondary: [
          log.dailyAmount ? `${log.dailyAmount}g/day` : null,
          log.frequency,
          log.notes,
        ]
          .filter(Boolean)
          .join(" · "),
        date: formatDate(log.date),
      }))}
      emptyMessage="No nutrition entries yet."
    />
  );
}
