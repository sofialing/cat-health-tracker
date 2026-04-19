"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { createNutritionLog } from "@/lib/actions/nutrition";
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

export function NutritionLogForm({ catId }: { catId: string }) {
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
        Log nutrition
      </Button>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(async () => {
      await createNutritionLog(catId, new FormData(form));
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Log nutrition</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="food-type">Food type</Label>
            <Select name="foodType" defaultValue="wet">
              <SelectTrigger id="food-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dry">Dry</SelectItem>
                <SelectItem value="wet">Wet</SelectItem>
                <SelectItem value="raw">Raw</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="brand">Brand (optional)</Label>
            <Input id="brand" name="brand" placeholder="e.g. Sheba" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="daily-amount">Daily amount (g)</Label>
              <Input
                id="daily-amount"
                name="dailyAmount"
                type="number"
                min="0"
                placeholder="e.g. 80"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                name="frequency"
                placeholder="e.g. 2x daily"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="n-date">Date</Label>
            <Input
              id="n-date"
              name="date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="n-notes">Notes (optional)</Label>
            <Textarea
              id="n-notes"
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
