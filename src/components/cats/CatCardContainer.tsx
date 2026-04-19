import { getWeightLogs } from "@/lib/actions/weight";
import { getIncidents } from "@/lib/actions/incidents";
import { getMedicalRecords } from "@/lib/actions/medical";
import { CatCard } from "./CatCard";
import type { Cat } from "@/types";

export async function CatCardContainer({ cat }: { cat: Cat }) {
  // Fetch data in parallel for this specific cat
  const [weights, incidents, medicalRecords] = await Promise.all([
    getWeightLogs(cat.id, 10),
    getIncidents(cat.id),
    getMedicalRecords(cat.id),
  ]);

  const latestWeight = weights.at(-1);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentIncidents = incidents.filter(
    (i) => new Date(i.date) >= thirtyDaysAgo
  ).length;

  const nextVaccination = medicalRecords
    .filter((r) => r.type === "vaccination" && r.nextDueDate)
    .sort(
      (a, b) =>
        new Date(a.nextDueDate!).getTime() -
        new Date(b.nextDueDate!).getTime()
    )
    .at(0);

  return (
    <CatCard
      cat={cat}
      latestWeight={latestWeight}
      recentIncidents={recentIncidents}
      nextVaccination={nextVaccination}
    />
  );
}
