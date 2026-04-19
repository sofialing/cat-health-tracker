import Link from "next/link";
import { PlusCircle, Cat } from "lucide-react";
import { getCats } from "@/lib/actions/cats";
import { getWeightLogs } from "@/lib/actions/weight";
import { getIncidents } from "@/lib/actions/incidents";
import { getMedicalRecords } from "@/lib/actions/medical";
import { CatCard } from "@/components/cats/CatCard";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const cats = await getCats();

  const catData = await Promise.all(
    cats.map(async (cat) => {
      const [weights, incidents, medicalRecords] = await Promise.all([
        getWeightLogs(cat.id),
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
      return { cat, latestWeight, recentIncidents, nextVaccination };
    })
  );

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <p className="text-sm text-muted-foreground font-medium mb-1">
          Welcome back 👋
        </p>
        <h1 className="text-2xl font-bold">Your cats</h1>
      </div>

      <div className="flex-1 px-4 py-4 pb-20 lg:pb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {catData.map(
            ({ cat, latestWeight, recentIncidents, nextVaccination }) => (
              <CatCard
                key={cat.id}
                cat={cat}
                latestWeight={latestWeight}
                recentIncidents={recentIncidents}
                nextVaccination={nextVaccination}
              />
            )
          )}
        </div>

        {cats.length === 0 && (
          <div className="text-center py-16">
            <Cat className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-semibold text-lg mb-1">No cats yet</p>
            <p className="text-muted-foreground text-sm mb-6">
              Add your first cat to get started
            </p>
          </div>
        )}

        <Button asChild className="w-full" variant="outline">
          <Link href="/cats/new">
            <PlusCircle className="size-4 mr-2" />
            Add a cat
          </Link>
        </Button>
      </div>
    </div>
  );
}
