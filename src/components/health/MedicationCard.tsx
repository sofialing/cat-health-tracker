"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { updateMedication, deleteMedication } from "@/lib/actions/medications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import type { MedicationLog } from "@/types";

interface MedicationCardProps {
  catId: string;
  medication: MedicationLog;
  isActive: boolean;
}

export function MedicationCard({
  catId,
  medication,
  isActive,
}: MedicationCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deletePending, startDeleteTransition] = useTransition();
  const [savePending, startSaveTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteMedication(catId, medication.id);
      router.refresh();
    });
  }

  function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    startSaveTransition(async () => {
      await updateMedication(catId, medication.id, new FormData(form));
      setEditOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <div className="p-4 rounded-xl border bg-card space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{medication.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {medication.dose}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isActive ? "Active" : "Completed"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={() => setEditOpen(true)}
              aria-label="Edit medication"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={deletePending}
              aria-label="Delete medication"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDate(medication.startDate)}
          {medication.endDate
            ? ` → ${formatDate(medication.endDate)}`
            : " → ongoing"}
        </p>
        {medication.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {medication.notes}
          </p>
        )}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit medication</DialogTitle>
          </DialogHeader>
          <form
            id="edit-medication-form"
            onSubmit={handleEdit}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="edit-med-name">Medication name</Label>
              <Input
                id="edit-med-name"
                name="name"
                defaultValue={medication.name}
                placeholder="e.g. Prednisolone"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-med-dose">Dose</Label>
              <Input
                id="edit-med-dose"
                name="dose"
                defaultValue={medication.dose}
                placeholder="e.g. 5mg twice daily"
                required
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="edit-med-start">Start date</Label>
                <Input
                  id="edit-med-start"
                  name="startDate"
                  type="date"
                  defaultValue={medication.startDate}
                  required
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="edit-med-end">End date</Label>
                <Input
                  id="edit-med-end"
                  name="endDate"
                  type="date"
                  defaultValue={medication.endDate ?? ""}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-med-notes">Notes</Label>
              <Textarea
                id="edit-med-notes"
                name="notes"
                defaultValue={medication.notes ?? ""}
                placeholder="e.g. Give with food"
                rows={2}
              />
            </div>
          </form>
          <DialogFooter showCloseButton>
            <Button
              type="submit"
              form="edit-medication-form"
              disabled={savePending}
            >
              {savePending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
