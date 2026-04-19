import { notFound } from "next/navigation";
import { getCatById } from "@/lib/actions/cats";
import { getNutritionLogs } from "@/lib/actions/nutrition";
import { CatTabBar } from "@/components/cats/CatTabBar";
import { NutritionLogForm } from "@/components/health/NutritionLogForm";
import { LogList } from "@/components/health/LogList";
import { formatDate } from "@/lib/utils";
import { ChefHat } from "lucide-react";

export default async function NutritionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCatById(id);
  if (!cat) notFound();

  const logs = await getNutritionLogs(id);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2 px-4 h-14 max-w-lg mx-auto">
          <div className="size-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">
            <ChefHat className="size-4" />
          </div>
          <h1 className="text-lg font-semibold">
            {cat.name} · <span className="text-emerald-600">Nutrition</span>
          </h1>
        </div>
      </header>
      <CatTabBar catId={id} />
      <div className="px-4 py-4 pb-20 lg:pb-6 space-y-6">
        <NutritionLogForm catId={id} />
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
      </div>
    </>
  );
}
