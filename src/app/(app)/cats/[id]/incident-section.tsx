import Link from "next/link";
import { getIncidents } from "@/lib/actions/incidents";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export async function IncidentSection({ catId }: { catId: string }) {
  const incidents = await getIncidents(catId);
  const recentIncidents = incidents.slice(0, 3);

  if (recentIncidents.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Recent incidents</h3>
        <Link href={`/cats/${catId}/incidents`} className="text-sm text-primary">
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
  );
}
