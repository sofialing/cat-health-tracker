import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Scale, Syringe, AlertTriangle, Cat as CatIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { calculateAge, formatWeight, formatDate } from "@/lib/utils";
import type { Cat, WeightLog, MedicalRecord } from "@/types";

interface CatCardProps {
  cat: Cat;
  latestWeight?: WeightLog;
  recentIncidents: number;
  nextVaccination?: MedicalRecord;
}

export function CatCard({
  cat,
  latestWeight,
  recentIncidents,
  nextVaccination,
}: CatCardProps) {
  const age = calculateAge(cat.birthday);
  const vaccinationDue = nextVaccination?.nextDueDate
    ? new Date(nextVaccination.nextDueDate)
    : null;
  const isVaccinationSoon =
    vaccinationDue &&
    vaccinationDue.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;
  const isVaccinationOverdue = vaccinationDue && vaccinationDue < new Date();

  return (
    <Link href={`/cats/${cat.id}`}>
      <div className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="h-16 bg-muted" />
        <div className="px-4 pb-4">
          <div className="flex items-end justify-between -mt-8 mb-3">
            <div className="relative size-16 rounded-2xl overflow-hidden bg-muted border-4 border-card shadow-sm flex items-center justify-center">
              {cat.profilePicture ? (
                <Image
                  src={cat.profilePicture}
                  alt={cat.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <CatIcon className="size-8 text-muted-foreground" />
              )}
            </div>
            <ChevronRight className="size-4 text-muted-foreground mb-1" />
          </div>
          <h2 className="font-bold text-lg leading-tight">{cat.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{age.label} old</p>
          <div className="grid grid-cols-3 gap-2">
            <StatPill
              icon={<Scale className="size-3.5" />}
              value={
                latestWeight
                  ? formatWeight(latestWeight.weight, latestWeight.unit)
                  : "—"
              }
              label="Weight"
              color="blue"
            />
            <StatPill
              icon={<AlertTriangle className="size-3.5" />}
              value={String(recentIncidents)}
              label="Incidents"
              color={recentIncidents > 0 ? "orange" : "neutral"}
            />
            <StatPill
              icon={<Syringe className="size-3.5" />}
              value={
                vaccinationDue ? (
                  <Badge
                    variant={
                      isVaccinationOverdue
                        ? "destructive"
                        : isVaccinationSoon
                          ? "default"
                          : "secondary"
                    }
                    className="text-[10px] px-1.5 py-0 h-auto"
                  >
                    {isVaccinationOverdue
                      ? "Overdue"
                      : isVaccinationSoon
                        ? "Soon"
                        : "OK"}
                  </Badge>
                ) : (
                  "—"
                )
              }
              label={
                vaccinationDue
                  ? formatDate(nextVaccination!.nextDueDate!)
                  : "Vaccine"
              }
              color={
                isVaccinationOverdue
                  ? "red"
                  : isVaccinationSoon
                    ? "orange"
                    : "green"
              }
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function StatPill({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  color: "blue" | "green" | "orange" | "red" | "neutral";
}) {
  const bg: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    neutral: "bg-muted text-muted-foreground",
  };
  return (
    <div className={`rounded-xl p-2.5 flex flex-col gap-1 ${bg[color]}`}>
      <div className="flex items-center gap-1 opacity-70">{icon}</div>
      <div className="font-semibold text-sm leading-tight">{value}</div>
      <div className="text-[10px] opacity-60 truncate">{label}</div>
    </div>
  );
}
