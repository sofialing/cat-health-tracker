"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { createMedicalRecord } from "@/lib/actions/medical";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MedicalRecordForm({ catId }: { catId: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("vet_visit");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!open) {
    return (
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <PlusCircle className="size-4 mr-2" />
        Add record
      </Button>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(async () => {
      await createMedicalRecord(catId, new FormData(form));
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Add medical record</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="med-type">Type</Label>
            <Select
              name="type"
              defaultValue="vet_visit"
              onValueChange={setType}
            >
              <SelectTrigger id="med-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vet_visit">Vet visit</SelectItem>
                <SelectItem value="vaccination">Vaccination</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {type === "vet_visit" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="med-title">Title</Label>
                <Input
                  id="med-title"
                  name="title"
                  placeholder="e.g. Annual check-up"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="med-status">Status</Label>
                <Select name="status" defaultValue="upcoming">
                  <SelectTrigger id="med-status">
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
              <Label htmlFor="vet-name">Vet name</Label>
              <Input id="vet-name" name="vetName" placeholder="Dr. Smith" />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="clinic">Clinic</Label>
              <Input id="clinic" name="clinic" placeholder="City Vet" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="med-date">Date</Label>
            <Input
              id="med-date"
              name="date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          {type === "vaccination" && (
            <div className="space-y-1.5">
              <Label htmlFor="next-due">Next due date</Label>
              <Input id="next-due" name="nextDueDate" type="date" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="med-notes">Notes (optional)</Label>
            <Textarea
              id="med-notes"
              name="notes"
              placeholder="e.g. Annual check-up, all good"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
