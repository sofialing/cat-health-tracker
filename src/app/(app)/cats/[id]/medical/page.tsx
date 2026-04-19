import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCatById } from "@/lib/actions/cats";
import { getMedicalRecords } from "@/lib/actions/medical";
import { getMedications } from "@/lib/actions/medications";
import { CatTabBar } from "@/components/cats/CatTabBar";
import { MedicalRecordForm } from "@/components/health/MedicalRecordForm";
import { MedicalRecordCard } from "@/components/health/MedicalRecordCard";
import { MedicationForm } from "@/components/health/MedicationForm";
import { MedicationCard } from "@/components/health/MedicationCard";
import { Stethoscope, Syringe, Pill, HeartPulse } from "lucide-react";
import {
  MedicationListSkeleton,
  VaccinationSectionSkeleton,
} from "@/components/cats/SkeletonLoaders";

async function MedicationsSection({ catId }: { catId: string }) {
  const medications = await getMedications(catId);
  const now = new Date();

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <Pill className="size-4" /> Medications
        </h2>
        <MedicationForm catId={catId} />
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
            catId={catId}
            medication={med}
            isActive={isActive}
          />
        );
      })}
    </section>
  );
}

async function VaccinationsSection({ catId }: { catId: string }) {
  const records = await getMedicalRecords(catId);
  const vaccinations = records.filter((r) => r.type === "vaccination");
  const now = new Date();

  return (
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
            catId={catId}
            record={record}
            isOverdue={isOverdue}
            isSoon={isSoon}
          />
        );
      })}
    </section>
  );
}

async function VetVisitsSection({ catId }: { catId: string }) {
  const records = await getMedicalRecords(catId);
  const vetVisits = records.filter((r) => r.type === "vet_visit");

  return (
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
        <MedicalRecordCard key={record.id} catId={catId} record={record} />
      ))}
    </section>
  );
}

export default async function MedicalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCatById(id);
  if (!cat) notFound();

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
        {/* Form loads immediately */}
        <MedicalRecordForm catId={id} />

        {/* Sections load in parallel with Suspense */}
        <Suspense fallback={<MedicationListSkeleton />}>
          <MedicationsSection catId={id} />
        </Suspense>

        <Suspense fallback={<VaccinationSectionSkeleton />}>
          <VaccinationsSection catId={id} />
        </Suspense>

        <Suspense fallback={<VaccinationSectionSkeleton />}>
          <VetVisitsSection catId={id} />
        </Suspense>
      </div>
    </>
  );
}
