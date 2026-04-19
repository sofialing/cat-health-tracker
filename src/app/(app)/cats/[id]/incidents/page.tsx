import { notFound } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { getCatById } from "@/lib/actions/cats";
import { getIncidents } from "@/lib/actions/incidents";
import { CatTabBar } from "@/components/cats/CatTabBar";
import { IncidentLogForm } from "@/components/health/IncidentLogForm";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function IncidentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCatById(id);
  if (!cat) notFound();

  const incidents = await getIncidents(id);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2 px-4 h-14 max-w-lg mx-auto">
          <div className="size-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <TriangleAlert className="size-4" />
          </div>
          <h1 className="text-lg font-semibold">
            {cat.name} · <span className="text-orange-600">Incidents</span>
          </h1>
        </div>
      </header>
      <CatTabBar catId={id} />
      <div className="px-4 py-4 pb-20 lg:pb-6 space-y-6">
        <IncidentLogForm catId={id} />

        <div className="space-y-3">
          {incidents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No incidents logged.
            </p>
          )}
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="p-4 rounded-xl border bg-card space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">{incident.type}</span>
                <Badge
                  variant={
                    incident.severity === "high"
                      ? "destructive"
                      : incident.severity === "medium"
                        ? "default"
                        : "secondary"
                  }
                  className="capitalize"
                >
                  {incident.severity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {incident.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(incident.date)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
