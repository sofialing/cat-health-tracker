import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCatById } from "@/lib/actions/cats";
import { CatTabBar } from "@/components/cats/CatTabBar";
import { WeightLogForm } from "@/components/health/WeightLogForm";
import { Scale } from "lucide-react";
import { WeightSection } from "./weight-section";
import { ChartSkeleton } from "@/components/cats/SkeletonLoaders";

export default async function WeightPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCatById(id);
  if (!cat) notFound();

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
        {/* Form loads immediately (fast path) */}
        <WeightLogForm catId={id} unit={cat.weightUnit} />
        
        {/* Chart and list load in Suspense */}
        <Suspense fallback={<ChartSkeleton />}>
          <WeightSection catId={id} unit={cat.weightUnit} />
        </Suspense>
      </div>
    </>
  );
}
