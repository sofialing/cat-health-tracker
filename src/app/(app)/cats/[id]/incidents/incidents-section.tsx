"use client";

import { useState, useEffect } from "react";
import { getIncidents } from "@/lib/actions/incidents";
import { IncidentCard } from "@/components/health/IncidentCard";
import { IncidentEditor } from "@/components/health/IncidentEditor";
import type { Incident } from "@/types";

export function IncidentSection({ catId }: { catId: string }) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadIncidents() {
      const data = await getIncidents(catId);
      setIncidents(data);
      setIsLoading(false);
    }
    loadIncidents();
  }, [catId]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl border bg-muted/40 animate-pulse"
          >
            <div className="h-5 w-14 rounded flex-shrink-0 bg-muted" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-48 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (editingIncident) {
    return (
      <IncidentEditor
        catId={catId}
        incident={editingIncident}
        onClose={() => {
          setEditingIncident(null);
          // Reload incidents after edit
          getIncidents(catId).then(setIncidents);
        }}
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
          onEdit={(incident) => {
            setEditingIncident(incident);
          }}
          onDelete={() => {
            // Reload incidents after delete
            getIncidents(catId).then(setIncidents);
          }}
        />
      ))}
    </div>
  );
}
