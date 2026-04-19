import Link from "next/link";
import { Calendar, Stethoscope, Syringe } from "lucide-react";
import { getMedicalRecords } from "@/lib/actions/medical";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export async function VaccinationSection({ catId }: { catId: string }) {
  const medicalRecords = await getMedicalRecords(catId);
  const now = new Date();

  // Upcoming: vet visits with status "upcoming"
  const upcomingVetVisits = medicalRecords
    .filter((r) => r.type === "vet_visit" && r.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Vaccinations: overdue or due within 60 days
  const relevantVaccinations = medicalRecords
    .filter((r) => r.type === "vaccination" && r.nextDueDate)
    .map((r) => {
      const due = new Date(r.nextDueDate!);
      const isOverdue = due < now;
      const isDueSoon =
        !isOverdue && due.getTime() - now.getTime() < 60 * 24 * 60 * 60 * 1000;
      return { record: r, due, isOverdue, isDueSoon };
    })
    .filter(({ isOverdue, isDueSoon }) => isOverdue || isDueSoon)
    .sort((a, b) => a.due.getTime() - b.due.getTime())
    .slice(0, 3);

  const hasUpcoming =
    upcomingVetVisits.length > 0 || relevantVaccinations.length > 0;

  if (!hasUpcoming) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center gap-2">
          <Calendar className="size-4" /> Upcoming
        </h3>
        <Link href={`/cats/${catId}/medical`} className="text-sm text-primary">
          See all
        </Link>
      </div>
      <div className="space-y-2">
        {upcomingVetVisits.map((record) => (
          <div
            key={record.id}
            className="flex items-center gap-3 p-3 rounded-xl border bg-card text-sm"
          >
            <Stethoscope className="size-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {record.title ?? "Vet visit"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(record.date)}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="flex-shrink-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0"
            >
              Upcoming
            </Badge>
          </div>
        ))}
        {relevantVaccinations.map(({ record, isOverdue }) => (
          <div
            key={record.id}
            className="flex items-center gap-3 p-3 rounded-xl border bg-card text-sm"
          >
            <Syringe className="size-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {record.notes ?? "Vaccination"}
              </p>
              <p className="text-xs text-muted-foreground">
                Due {formatDate(record.nextDueDate!)}
              </p>
            </div>
            <Badge
              variant={isOverdue ? "destructive" : "secondary"}
              className="flex-shrink-0"
            >
              {isOverdue ? "Overdue" : "Due soon"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
