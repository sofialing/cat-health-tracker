import { notFound } from "next/navigation";
import { getCatById } from "@/lib/actions/cats";
import { getMedicalRecords } from "@/lib/actions/medical";
import { getMedications } from "@/lib/actions/medications";
import { CatTabBar } from "@/components/cats/CatTabBar";
import { MedicalRecordForm } from "@/components/health/MedicalRecordForm";
import { MedicalRecordCard } from "@/components/health/MedicalRecordCard";
import { MedicationForm } from "@/components/health/MedicationForm";
import { MedicationCard } from "@/components/health/MedicationCard";
import { Stethoscope, Syringe, Pill, HeartPulse } from "lucide-react";

export default async function MedicalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCatById(id);
  if (!cat) notFound();

  const [records, medications] = await Promise.all([
    getMedicalRecords(id),
    getMedications(id),
  ]);

  const vaccinations = records.filter((r) => r.type === "vaccination");
  const vetVisits = records.filter((r) => r.type === "vet_visit");
  const now = new Date();

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2 px-4 h-14 max-w-lg mx-auto">
          <div className="size-7 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 text-sm">
            <HeartPulse className="size-4" />
          </div>
          <h1 className="text-lg font-semibold">
            {cat.name} · <span className="text-teal-600">Medical</span>
          </h1>
        </div>
      </header>
      <CatTabBar catId={id} />
      <div className="px-4 py-4 pb-20 lg:pb-6 space-y-6">
        <MedicalRecordForm catId={id} />

        {/* Medications */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Pill className="size-4" /> Medications
            </h2>
            <MedicationForm catId={id} />
          </div>
          {medications.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No medications logged.
            </p>
          )}
          {medications.map((med) => {
            const isActive = !med.endDate || new Date(med.endDate) >= now;
            return (
              <MedicationCard
                key={med.id}
                catId={id}
                medication={med}
                isActive={isActive}
              />
            );
          })}
        </section>

        {/* Vaccinations */}
        <section className="space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Syringe className="size-4" /> Vaccinations
          </h2>
          {vaccinations.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No vaccinations logged.
            </p>
          )}
          {vaccinations.map((record) => {
            const due = record.nextDueDate
              ? new Date(record.nextDueDate)
              : null;
            const isOverdue = !!due && due < now;
            const isSoon =
              !!due &&
              !isOverdue &&
              due.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000;
            return (
              <MedicalRecordCard
                key={record.id}
                catId={id}
                record={record}
                isOverdue={isOverdue}
                isSoon={isSoon}
              />
            );
          })}
        </section>

        {/* Vet visits */}
        <section className="space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Stethoscope className="size-4" /> Vet visits
          </h2>
          {vetVisits.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No vet visits logged.
            </p>
          )}
          {vetVisits.map((record) => (
            <MedicalRecordCard key={record.id} catId={id} record={record} />
          ))}
        </section>
      </div>
    </>
  );
}
