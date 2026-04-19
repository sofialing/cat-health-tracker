import { Skeleton } from "@/components/ui/skeleton";

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border bg-muted/40 p-4 flex items-center gap-3"
        >
          <Skeleton className="size-9 rounded-xl" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-2 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function VaccinationSectionSkeleton() {
  return (
    <div>
      <Skeleton className="h-6 w-32 mb-3" />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl border bg-muted/40"
          >
            <Skeleton className="size-4 flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-16 flex-shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MedicationListSkeleton() {
  return (
    <div>
      <Skeleton className="h-6 w-40 mb-3" />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl border bg-muted/40"
          >
            <Skeleton className="size-8 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-14 flex-shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function IncidentListSkeleton() {
  return (
    <div>
      <Skeleton className="h-6 w-32 mb-3" />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl border bg-muted/40"
          >
            <Skeleton className="h-5 w-14 rounded flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
