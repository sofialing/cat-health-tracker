"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IncidentEditor } from "./IncidentEditor";

export function IncidentLogForm({ catId }: { catId: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <PlusCircle className="size-4 mr-2" />
        Log incident
      </Button>
    );
  }

  return <IncidentEditor catId={catId} onClose={() => setOpen(false)} />;
}
