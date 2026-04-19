"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { createBreathingLog } from "@/lib/actions/breathing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BreathingLogFormProps {
  catId: string;
}

export function BreathingLogForm({ catId }: BreathingLogFormProps) {
  const [open, setOpen] = useState(false);
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
        Log breathing rate
      </Button>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(async () => {
      await createBreathingLog(catId, new FormData(form));
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Log breathing rate</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="bpm">Breaths per minute</Label>
            <Input
              id="bpm"
              name="breaths_per_minute"
              type="number"
              min="1"
              max="200"
              step="1"
              placeholder="e.g. 24"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-date">Date</Label>
            <Input
              id="b-date"
              name="date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-notes">Notes (optional)</Label>
            <Textarea
              id="b-notes"
              name="notes"
              placeholder="e.g. at rest, sleeping, after play…"
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
