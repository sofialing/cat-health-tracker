"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { createMedication } from "@/lib/actions/medications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MedicationForm({ catId }: { catId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <PlusCircle className="size-4 mr-2" />
        Add medication
      </Button>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(async () => {
      await createMedication(catId, new FormData(form));
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Add medication</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="med-name">Medication name</Label>
            <Input
              id="med-name"
              name="name"
              placeholder="e.g. Prednisolone"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="med-dose">Dose</Label>
            <Input
              id="med-dose"
              name="dose"
              placeholder="e.g. 5mg twice daily"
              required
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="med-start">Start date</Label>
              <Input
                id="med-start"
                name="startDate"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="med-end">End date (optional)</Label>
              <Input id="med-end" name="endDate" type="date" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="med-notes">Notes (optional)</Label>
            <Textarea
              id="med-notes"
              name="notes"
              placeholder="e.g. Give with food"
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
