"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/actions/auth";
import { revalidatePath } from "next/cache";
import type { WeightLog } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToLog(row: any): WeightLog {
  return {
    id: row.id,
    catId: row.cat_id,
    weight: row.weight,
    unit: row.unit,
    date: row.date,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getWeightLogs(catId: string, limit?: number): Promise<WeightLog[]> {
  const user = await getSessionUser();
  if (!user) return [];
  const supabase = await createClient();
  let query = supabase
    .from("weight_logs")
    .select("*")
    .eq("cat_id", catId)
    .eq("user_id", user.id)
    .order("date", { ascending: true });
  
  if (limit) query = query.limit(limit);
  
  const { data } = await query;
  return (data ?? []).map(rowToLog);
}

export async function createWeightLog(
  catId: string,
  data: FormData
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase.from("weight_logs").insert({
    cat_id: catId,
    user_id: user.id,
    weight: parseFloat(data.get("weight") as string),
    unit: data.get("unit") as string,
    date: data.get("date") as string,
    notes: (data.get("notes") as string) || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/weight`);
  revalidatePath(`/cats/${catId}`);
  revalidatePath("/");
}

export async function deleteWeightLog(
  catId: string,
  logId: string
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase
    .from("weight_logs")
    .delete()
    .eq("id", logId)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/weight`);
}
