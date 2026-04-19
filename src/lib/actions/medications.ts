"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/actions/auth";
import { revalidatePath } from "next/cache";
import type { MedicationLog } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToLog(row: any): MedicationLog {
  return {
    id: row.id,
    catId: row.cat_id,
    name: row.name,
    dose: row.dose,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getMedications(catId: string): Promise<MedicationLog[]> {
  const user = await getSessionUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("medication_logs")
    .select("*")
    .eq("cat_id", catId)
    .eq("user_id", user.id)
    .order("start_date", { ascending: false });
  return (data ?? []).map(rowToLog);
}

export async function createMedication(
  catId: string,
  data: FormData
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase.from("medication_logs").insert({
    cat_id: catId,
    user_id: user.id,
    name: data.get("name") as string,
    dose: data.get("dose") as string,
    start_date: data.get("startDate") as string,
    end_date: (data.get("endDate") as string) || null,
    notes: (data.get("notes") as string) || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/medical`);
  revalidatePath(`/cats/${catId}`);
  revalidatePath("/");
}

export async function updateMedication(
  catId: string,
  logId: string,
  data: FormData
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase
    .from("medication_logs")
    .update({
      name: data.get("name") as string,
      dose: data.get("dose") as string,
      start_date: data.get("startDate") as string,
      end_date: (data.get("endDate") as string) || null,
      notes: (data.get("notes") as string) || null,
    })
    .eq("id", logId)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/medical`);
  revalidatePath(`/cats/${catId}`);
  revalidatePath("/");
}

export async function deleteMedication(
  catId: string,
  logId: string
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase
    .from("medication_logs")
    .delete()
    .eq("id", logId)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/medical`);
}
