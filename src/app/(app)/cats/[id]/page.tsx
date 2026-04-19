import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Pencil, Cat } from "lucide-react";
import { getCatById } from "@/lib/actions/cats";
import { CatTabBar } from "@/components/cats/CatTabBar";
import { Button } from "@/components/ui/button";
import { calculateAge, formatDate } from "@/lib/utils";
import { StatsSection } from "./stats-section";
import { VaccinationSection } from "./vaccination-section";
import { MedicationSection } from "./medication-section";
import { IncidentSection } from "./incident-section";
import {
  StatsSkeleton,
  VaccinationSectionSkeleton,
  MedicationListSkeleton,
  IncidentListSkeleton,
} from "@/components/cats/SkeletonLoaders";

export default async function CatOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCatById(id);
  if (!cat) notFound();

  const age = calculateAge(cat.birthday);

  return (
    <>
      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
          <h1 className="text-lg font-semibold">{cat.name}</h1>
          <Button asChild variant="ghost" size="icon">
            <Link href={`/cats/${id}/edit`}>
              <Pencil className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <CatTabBar catId={id} />

      {/* Hero */}
      <div className="relative h-32 bg-muted">
        <div className="absolute bottom-0 left-4 translate-y-1/2">
          <div className="relative size-20 rounded-2xl overflow-hidden bg-muted border-4 border-background shadow-md flex items-center justify-center">
            {cat.profilePicture ? (
              <Image
                src={cat.profilePicture}
                alt={cat.name}
                fill
                sizes="80px"
                className="object-cover"
                priority
              />
            ) : (
              <Cat className="size-10 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-14 pb-20 lg:pb-6 space-y-5">
        <div>
          <h2 className="text-2xl font-bold">{cat.name}</h2>
          <p className="text-muted-foreground">
            {age.label} old · Born {formatDate(cat.birthday)}
          </p>
        </div>

        {/* Stats with Suspense */}
        <Suspense fallback={<StatsSkeleton />}>
          <StatsSection catId={id} />
        </Suspense>

        {/* Vaccination section with Suspense */}
        <Suspense fallback={<VaccinationSectionSkeleton />}>
          <VaccinationSection catId={id} />
        </Suspense>

        {/* Medications section with Suspense */}
        <Suspense fallback={<MedicationListSkeleton />}>
          <MedicationSection catId={id} />
        </Suspense>

        {/* Incidents section with Suspense */}
        <Suspense fallback={<IncidentListSkeleton />}>
          <IncidentSection catId={id} />
        </Suspense>
      </div>
    </>
  );
}
