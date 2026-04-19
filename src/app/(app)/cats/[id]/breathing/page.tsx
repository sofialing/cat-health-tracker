import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCatById } from "@/lib/actions/cats";
import { CatTabBar } from "@/components/cats/CatTabBar";
import { BreathingLogForm } from "@/components/health/BreathingLogForm";
import { Wind } from "lucide-react";
import { BreathingSection } from "./breathing-section";
import { ChartSkeleton } from "@/components/cats/SkeletonLoaders";

export default async function BreathingPage({
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
        {/* Form loads immediately (fast path) */}
        <BreathingLogForm catId={id} />
        
        {/* Chart and list load in Suspense */}
        <Suspense fallback={<ChartSkeleton />}>
          <BreathingSection catId={id} />
        </Suspense>
      </div>
    </>
  );
}
