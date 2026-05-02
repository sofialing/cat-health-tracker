"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createIncident, updateIncident } from "@/lib/actions/incidents";
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
import type { Incident } from "@/types";

interface IncidentEditorProps {
  catId: string;
  incident?: Incident;
  onClose: () => void;
}

export function IncidentEditor({
  catId,
  incident,
  onClose,
}: IncidentEditorProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(async () => {
      if (incident) {
        await updateIncident(catId, incident.id, new FormData(form));
      } else {
        await createIncident(catId, new FormData(form));
      }
      onClose();
      router.refresh();
    });
  }

  const defaultDate = incident
    ? incident.date
    : new Date().toISOString().split("T")[0];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {incident ? "Edit incident" : "Log incident"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="inc-type">Type</Label>
              <Select name="type" defaultValue={incident?.type || "vomiting"}>
                <SelectTrigger id="inc-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vomiting">Vomiting</SelectItem>
                  <SelectItem value="symptom">Symptom</SelectItem>
                  <SelectItem value="illness">Illness</SelectItem>
                  <SelectItem value="cough">Cough</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="severity">Severity</Label>
              <Select name="severity" defaultValue={incident?.severity || "low"}>
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what happened…"
              rows={3}
              defaultValue={incident?.description || ""}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inc-date">Date</Label>
            <Input
              id="inc-date"
              name="date"
              type="date"
              defaultValue={defaultDate}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={pending}
              className="flex-1"
            >
              {incident ? "Update incident" : "Log incident"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
