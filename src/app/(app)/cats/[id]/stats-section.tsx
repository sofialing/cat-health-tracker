import { Pill, Scale, TriangleAlert, Wind } from "lucide-react";
import { getWeightLogs } from "@/lib/actions/weight";
import { getIncidents } from "@/lib/actions/incidents";
import { getMedications } from "@/lib/actions/medications";
import { getBreathingLogs } from "@/lib/actions/breathing";
import { formatDate, formatWeight } from "@/lib/utils";

const BREATHING_NORMAL_MIN = 20;
const BREATHING_NORMAL_MAX = 30;

export async function StatsSection({ catId }: { catId: string }) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [weights, incidents, medications, breathingLogs] = await Promise.all([
    getWeightLogs(catId, 100),
    getIncidents(catId),
    getMedications(catId),
    getBreathingLogs(catId, 100),
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

  return (
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
  );
}
