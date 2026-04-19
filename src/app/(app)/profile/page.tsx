"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, Cat } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageShell } from "@/components/layout/PageShell";

export default function ProfilePage() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <PageShell title="Profile">
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted border">
          <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
            <User className="size-7 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold">Your account</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">Cat parent <Cat className="size-3.5" /></p>
          </div>
        </div>

        <div className="rounded-2xl border overflow-hidden">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full p-4 text-left text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="size-4" />
            <span className="font-medium">Sign out</span>
          </button>
        </div>
      </div>
    </PageShell>
  );
}
