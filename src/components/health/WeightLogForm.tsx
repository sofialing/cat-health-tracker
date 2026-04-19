"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { createWeightLog } from "@/lib/actions/weight";
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
import { useState } from "react";

interface WeightLogFormProps {
  catId: string;
  unit: "kg" | "lbs";
}

export function WeightLogForm({ catId, unit }: WeightLogFormProps) {
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
        Log weight
      </Button>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(async () => {
      await createWeightLog(catId, new FormData(form));
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Log weight</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 4.2"
                required
              />
            </div>
            <div className="w-24 space-y-1.5">
              <Label htmlFor="w-unit">Unit</Label>
              <Select name="unit" defaultValue={unit}>
                <SelectTrigger id="w-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="w-date">Date</Label>
            <Input
              id="w-date"
              name="date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="w-notes">Notes (optional)</Label>
            <Textarea
              id="w-notes"
              name="notes"
              placeholder="Any observations…"
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
