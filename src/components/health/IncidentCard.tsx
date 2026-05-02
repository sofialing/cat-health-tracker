"use client";

import { useState, useTransition } from "react";
import { Trash2, Pencil } from "lucide-react";
import { deleteIncident } from "@/lib/actions/incidents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/utils";
import type { Incident } from "@/types";

interface IncidentCardProps {
  incident: Incident;
  catId: string;
  onEdit: (incident: Incident) => void;
  onDelete: () => void;
}

export function IncidentCard({
  incident,
  catId,
  onEdit,
  onDelete,
}: IncidentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteIncident(catId, incident.id);
      setIsDeleting(false);
      onDelete();
    });
  };

  return (
    <>
      <div className="flex items-start gap-3 p-3 rounded-xl border bg-card text-sm group hover:bg-muted/50 transition-colors">
        <Badge
          variant={
            incident.severity === "high"
              ? "destructive"
              : incident.severity === "medium"
                ? "default"
                : "secondary"
          }
          className="mt-0.5 capitalize flex-shrink-0"
        >
          {incident.severity}
        </Badge>
        <div className="flex-1 min-w-0">
          <p className="capitalize font-medium">{incident.type}</p>
          <p className="text-muted-foreground text-xs line-clamp-2">
            {incident.description}
          </p>
          <p className="text-muted-foreground text-xs mt-0.5">
            {formatDate(incident.date)}
          </p>
        </div>
        <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onEdit(incident)}
            disabled={pending}
          >
            <Pencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => setIsDeleting(true)}
            disabled={pending}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete incident</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this incident? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-1">
            <p className="font-medium capitalize">{incident.type}</p>
            <p className="text-muted-foreground line-clamp-2">
              {incident.description}
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={pending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
