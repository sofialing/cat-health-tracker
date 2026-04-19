"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/actions/auth";
import { revalidatePath } from "next/cache";
import type { NutritionLog } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToLog(row: any): NutritionLog {
  return {
    id: row.id,
    catId: row.cat_id,
    foodType: row.food_type,
    brand: row.brand ?? undefined,
    dailyAmount: row.daily_amount ?? undefined,
    frequency: row.frequency ?? undefined,
    notes: row.notes ?? undefined,
    date: row.date,
    createdAt: row.created_at,
  };
}

export async function getNutritionLogs(catId: string): Promise<NutritionLog[]> {
  const user = await getSessionUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("nutrition_logs")
    .select("*")
    .eq("cat_id", catId)
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  return (data ?? []).map(rowToLog);
}

export async function createNutritionLog(
  catId: string,
  data: FormData
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase.from("nutrition_logs").insert({
    cat_id: catId,
    user_id: user.id,
    food_type: data.get("foodType") as string,
    brand: (data.get("brand") as string) || null,
    daily_amount: data.get("dailyAmount")
      ? parseFloat(data.get("dailyAmount") as string)
      : null,
    frequency: (data.get("frequency") as string) || null,
    notes: (data.get("notes") as string) || null,
    date: data.get("date") as string,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/nutrition`);
}

export async function deleteNutritionLog(
  catId: string,
  logId: string
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase
    .from("nutrition_logs")
    .delete()
    .eq("id", logId)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/nutrition`);
}
