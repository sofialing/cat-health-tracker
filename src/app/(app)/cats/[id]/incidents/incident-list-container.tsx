"use client";

import { useState } from "react";
import { IncidentCard } from "@/components/health/IncidentCard";
import { IncidentEditor } from "@/components/health/IncidentEditor";
import type { Incident } from "@/types";

interface IncidentListContainerProps {
  catId: string;
  incidents: Incident[];
}

export function IncidentListContainer({
  catId,
  incidents,
}: IncidentListContainerProps) {
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);

  if (editingIncident) {
    return (
      <IncidentEditor
        catId={catId}
        incident={editingIncident}
        onClose={() => setEditingIncident(null)}
      />
    );
  }

  if (incidents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No incidents logged yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {incidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
          catId={catId}
          onEdit={setEditingIncident}
          onDelete={() => {
            // No-op: IncidentListContainer is only used for display
            // Reload happens via parent component
          }}
        />
      ))}
    </div>
  );
}
