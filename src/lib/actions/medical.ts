"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/actions/auth";
import { revalidatePath } from "next/cache";
import type { MedicalRecord } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToRecord(row: any): MedicalRecord {
  return {
    id: row.id,
    catId: row.cat_id,
    type: row.type,
    title: row.title ?? undefined,
    status: row.status ?? undefined,
    vetName: row.vet_name ?? undefined,
    clinic: row.clinic ?? undefined,
    notes: row.notes ?? undefined,
    date: row.date,
    nextDueDate: row.next_due_date ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getMedicalRecords(
  catId: string
): Promise<MedicalRecord[]> {
  const user = await getSessionUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("medical_records")
    .select("*")
    .eq("cat_id", catId)
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  return (data ?? []).map(rowToRecord);
}

export async function createMedicalRecord(
  catId: string,
  data: FormData
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase.from("medical_records").insert({
    cat_id: catId,
    user_id: user.id,
    type: data.get("type") as string,
    title: (data.get("title") as string) || null,
    status: (data.get("status") as string) || null,
    vet_name: (data.get("vetName") as string) || null,
    clinic: (data.get("clinic") as string) || null,
    notes: (data.get("notes") as string) || null,
    date: data.get("date") as string,
    next_due_date: (data.get("nextDueDate") as string) || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/medical`);
  revalidatePath(`/cats/${catId}`);
  revalidatePath("/");
}

export async function updateMedicalRecord(
  catId: string,
  recordId: string,
  data: FormData
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase
    .from("medical_records")
    .update({
      title: (data.get("title") as string) || null,
      status: (data.get("status") as string) || null,
      vet_name: (data.get("vetName") as string) || null,
      clinic: (data.get("clinic") as string) || null,
      notes: (data.get("notes") as string) || null,
      date: data.get("date") as string,
      next_due_date: (data.get("nextDueDate") as string) || null,
    })
    .eq("id", recordId)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/medical`);
  revalidatePath(`/cats/${catId}`);
  revalidatePath("/");
}

export async function deleteMedicalRecord(
  catId: string,
  recordId: string
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase
    .from("medical_records")
    .delete()
    .eq("id", recordId)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/medical`);
}
