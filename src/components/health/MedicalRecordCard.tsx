"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Stethoscope, Syringe } from "lucide-react";
import {
  updateMedicalRecord,
  deleteMedicalRecord,
} from "@/lib/actions/medical";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import type { MedicalRecord } from "@/types";

type VisitStatus = "upcoming" | "completed" | "cancelled";

const STATUS_LABELS: Record<VisitStatus, string> = {
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
};

function StatusBadge({ status }: { status: VisitStatus | undefined }) {
  if (!status) return null;
  const className =
    status === "upcoming"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      : status === "completed"
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : "bg-muted text-muted-foreground";
  return (
    <span
      className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${className}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

interface MedicalRecordCardProps {
  catId: string;
  record: MedicalRecord;
  isOverdue?: boolean;
  isSoon?: boolean;
}

export function MedicalRecordCard({
  catId,
  record,
  isOverdue = false,
  isSoon = false,
}: MedicalRecordCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deletePending, startDeleteTransition] = useTransition();
  const [savePending, startSaveTransition] = useTransition();
  const router = useRouter();

  const isVaccination = record.type === "vaccination";
  const due = record.nextDueDate ? new Date(record.nextDueDate) : null;

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteMedicalRecord(catId, record.id);
      router.refresh();
    });
  }

  function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    startSaveTransition(async () => {
      await updateMedicalRecord(catId, record.id, new FormData(form));
      setEditOpen(false);
      router.refresh();
    });
  }

  const displayTitle =
    record.title ?? (isVaccination ? "Vaccination" : "Vet visit");

  return (
    <>
      <div className="p-4 rounded-xl border bg-card space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {isVaccination ? (
              <Syringe className="size-3.5 text-muted-foreground shrink-0" />
            ) : (
              <Stethoscope className="size-3.5 text-muted-foreground shrink-0" />
            )}
            <p className="font-medium text-sm truncate">{displayTitle}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {isVaccination && due && (
              <Badge
                variant={
                  isOverdue ? "destructive" : isSoon ? "default" : "secondary"
                }
              >
                {isOverdue ? "Overdue" : isSoon ? "Due soon" : "Up to date"}
              </Badge>
            )}
            {!isVaccination && (
              <StatusBadge status={record.status as VisitStatus | undefined} />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={() => setEditOpen(true)}
              aria-label="Edit record"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={deletePending}
              aria-label="Delete record"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {isVaccination ? "Given: " : ""}
          {formatDate(record.date)}
        </p>
        {due && (
          <p className="text-xs text-muted-foreground">
            Next due: {formatDate(record.nextDueDate!)}
          </p>
        )}
        {record.vetName && (
          <p className="text-xs text-muted-foreground">
            {record.vetName}
            {record.clinic ? ` · ${record.clinic}` : ""}
          </p>
        )}
        {record.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {record.notes}
          </p>
        )}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit {isVaccination ? "vaccination" : "vet visit"}
            </DialogTitle>
          </DialogHeader>
          <form
            id="edit-medical-form"
            onSubmit={handleEdit}
            className="space-y-4"
          >
            {!isVaccination && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={record.title ?? ""}
                    placeholder="e.g. Annual check-up"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    name="status"
                    defaultValue={record.status ?? "upcoming"}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="flex gap-3">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="edit-vet-name">Vet name</Label>
                <Input
                  id="edit-vet-name"
                  name="vetName"
                  defaultValue={record.vetName ?? ""}
                  placeholder="Dr. Smith"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="edit-clinic">Clinic</Label>
                <Input
                  id="edit-clinic"
                  name="clinic"
                  defaultValue={record.clinic ?? ""}
                  placeholder="City Vet"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                name="date"
                type="date"
                defaultValue={record.date}
                required
              />
            </div>
            {isVaccination && (
              <div className="space-y-1.5">
                <Label htmlFor="edit-next-due">Next due date</Label>
                <Input
                  id="edit-next-due"
                  name="nextDueDate"
                  type="date"
                  defaultValue={record.nextDueDate ?? ""}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                name="notes"
                defaultValue={record.notes ?? ""}
                placeholder="e.g. Annual check-up, all good"
                rows={2}
              />
            </div>
          </form>
          <DialogFooter showCloseButton>
            <Button
              type="submit"
              form="edit-medical-form"
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
