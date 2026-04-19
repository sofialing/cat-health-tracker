import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Pencil,
  Scale,
  Calendar,
  Stethoscope,
  Pill,
  Wind,
  TriangleAlert,
  Syringe,
  Cat,
} from "lucide-react";
import { getCatById } from "@/lib/actions/cats";
import { getWeightLogs } from "@/lib/actions/weight";
import { getIncidents } from "@/lib/actions/incidents";
import { getMedicalRecords } from "@/lib/actions/medical";
import { getMedications } from "@/lib/actions/medications";
import { getBreathingLogs } from "@/lib/actions/breathing";
import { CatTabBar } from "@/components/cats/CatTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateAge, formatDate, formatWeight } from "@/lib/utils";

const BREATHING_NORMAL_MIN = 20;
const BREATHING_NORMAL_MAX = 30;

export default async function CatOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCatById(id);
  if (!cat) notFound();

  const age = calculateAge(cat.birthday);
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [weights, incidents, medicalRecords, medications, breathingLogs] =
    await Promise.all([
      getWeightLogs(id),
      getIncidents(id),
      getMedicalRecords(id),
      getMedications(id),
      getBreathingLogs(id),
    ]);

  const latestWeight = weights.at(-1);
  const latestBreathing = breathingLogs.at(-1);
  const isBreathingNormal = latestBreathing
    ? latestBreathing.breathsPerMinute >= BREATHING_NORMAL_MIN &&
      latestBreathing.breathsPerMinute <= BREATHING_NORMAL_MAX
    : null;

  const activeMedications = medications.filter(
    (m) => !m.endDate || new Date(m.endDate) >= now
  );

  const recentIncidentCount = incidents.filter(
    (i) => new Date(i.date) >= thirtyDaysAgo
  ).length;

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

  const recentIncidents = incidents.slice(0, 3);

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

        {/* Summary stats — 2×2 grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Latest weight */}
          <div className="rounded-2xl border bg-blue-50 dark:bg-blue-950/30 p-4 flex items-center gap-3">
            <div className="size-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600">
              <Scale className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-blue-500 font-medium">Latest weight</p>
              <p className="font-bold text-blue-700 dark:text-blue-400 truncate">
                {latestWeight
                  ? formatWeight(latestWeight.weight, latestWeight.unit)
                  : "—"}
              </p>
              {latestWeight && (
                <p className="text-[10px] text-blue-400">
                  {formatDate(latestWeight.date)}
                </p>
              )}
            </div>
          </div>

          {/* Last breathing rate */}
          <div className="rounded-2xl border bg-teal-50 dark:bg-teal-950/30 p-4 flex items-center gap-3">
            <div className="size-9 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600">
              <Wind className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-teal-500 font-medium">
                Last breathing
              </p>
              {latestBreathing ? (
                <>
                  <p className="font-bold text-teal-700 dark:text-teal-400">
                    {latestBreathing.breathsPerMinute} bpm
                  </p>
                  <p
                    className={`text-[10px] font-medium ${isBreathingNormal ? "text-green-500" : "text-amber-500"}`}
                  >
                    {isBreathingNormal ? "Normal" : "Abnormal"}
                  </p>
                </>
              ) : (
                <p className="font-bold text-teal-700 dark:text-teal-400">—</p>
              )}
            </div>
          </div>

          {/* Active medications */}
          <div className="rounded-2xl border bg-violet-50 dark:bg-violet-950/30 p-4 flex items-center gap-3">
            <div className="size-9 rounded-xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600">
              <Pill className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-violet-500 font-medium">Active meds</p>
              <p className="font-bold text-violet-700 dark:text-violet-400">
                {activeMedications.length}
              </p>
              <p className="text-[10px] text-violet-400">
                {activeMedications.length === 1 ? "medication" : "medications"}
              </p>
            </div>
          </div>

          {/* Recent incidents */}
          <div
            className={`rounded-2xl border p-4 flex items-center gap-3 ${
              recentIncidentCount > 0
                ? "bg-orange-50 dark:bg-orange-950/30"
                : "bg-muted/40"
            }`}
          >
            <div
              className={`size-9 rounded-xl flex items-center justify-center ${
                recentIncidentCount > 0
                  ? "bg-orange-100 dark:bg-orange-900/50 text-orange-600"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <TriangleAlert className="size-4" />
            </div>
            <div className="min-w-0">
              <p
                className={`text-xs font-medium ${recentIncidentCount > 0 ? "text-orange-500" : "text-muted-foreground"}`}
              >
                Incidents
              </p>
              <p
                className={`font-bold ${recentIncidentCount > 0 ? "text-orange-700 dark:text-orange-400" : "text-muted-foreground"}`}
              >
                {recentIncidentCount}
              </p>
              <p
                className={`text-[10px] ${recentIncidentCount > 0 ? "text-orange-400" : "text-muted-foreground/60"}`}
              >
                last 30 days
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming section */}
        {hasUpcoming && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="size-4" /> Upcoming
              </h3>
              <Link
                href={`/cats/${id}/medical`}
                className="text-sm text-primary"
              >
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
        )}

        {/* Active medications */}
        {activeMedications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Pill className="size-4" /> Active medications
              </h3>
              <Link
                href={`/cats/${id}/medical`}
                className="text-sm text-primary"
              >
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
        )}

        {/* Recent incidents */}
        {recentIncidents.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Recent incidents</h3>
              <Link
                href={`/cats/${id}/incidents`}
                className="text-sm text-primary"
              >
                See all
              </Link>
            </div>
            <div className="space-y-2">
              {recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-start gap-3 p-3 rounded-xl border bg-card text-sm"
                >
                  <Badge
                    variant={
                      incident.severity === "high"
                        ? "destructive"
                        : incident.severity === "medium"
                          ? "default"
                          : "secondary"
                    }
                    className="mt-0.5 capitalize flex-shrink-0"
                  >
                    {incident.severity}
                  </Badge>
                  <div>
                    <p className="capitalize font-medium">{incident.type}</p>
                    <p className="text-muted-foreground text-xs">
                      {incident.description}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {formatDate(incident.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
