import Link from "next/link";
import { Pill } from "lucide-react";
import { getMedications } from "@/lib/actions/medications";

export async function MedicationSection({ catId }: { catId: string }) {
  const medications = await getMedications(catId);
  const now = new Date();

  const activeMedications = medications.filter(
    (m) => !m.endDate || new Date(m.endDate) >= now
  );

  if (activeMedications.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center gap-2">
          <Pill className="size-4" /> Active medications
        </h3>
        <Link href={`/cats/${catId}/medical`} className="text-sm text-primary">
          See all
        </Link>
      </div>
      <div className="space-y-2">
        {activeMedications.slice(0, 3).map((med) => (
          <div
            key={med.id}
            className="flex items-center gap-3 p-3 rounded-xl border bg-card text-sm"
          >
            <div className="size-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 flex-shrink-0">
              <Pill className="size-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{med.name}</p>
              <p className="text-xs text-muted-foreground">{med.dose}</p>
            </div>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium flex-shrink-0">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
