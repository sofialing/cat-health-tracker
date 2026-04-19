"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/actions/auth";
import { revalidatePath } from "next/cache";
import type { BreathingLog } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToLog(row: any): BreathingLog {
  return {
    id: row.id,
    catId: row.cat_id,
    breathsPerMinute: row.breaths_per_minute,
    date: row.date,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getBreathingLogs(catId: string, limit?: number): Promise<BreathingLog[]> {
  const user = await getSessionUser();
  if (!user) return [];
  const supabase = await createClient();
  let query = supabase
    .from("breathing_logs")
    .select("*")
    .eq("cat_id", catId)
    .eq("user_id", user.id)
    .order("date", { ascending: true });
  
  if (limit) query = query.limit(limit);
  
  const { data } = await query;
  return (data ?? []).map(rowToLog);
}

export async function createBreathingLog(
  catId: string,
  data: FormData
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase.from("breathing_logs").insert({
    cat_id: catId,
    user_id: user.id,
    breaths_per_minute: parseInt(data.get("breaths_per_minute") as string, 10),
    date: data.get("date") as string,
    notes: (data.get("notes") as string) || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/breathing`);
  revalidatePath(`/cats/${catId}`);
  revalidatePath("/");
}

export async function deleteBreathingLog(
  catId: string,
  logId: string
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase
    .from("breathing_logs")
    .delete()
    .eq("id", logId)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/breathing`);
}
