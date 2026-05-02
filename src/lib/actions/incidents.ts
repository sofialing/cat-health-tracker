"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/actions/auth";
import { revalidatePath } from "next/cache";
import type { Incident } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToIncident(row: any): Incident {
  return {
    id: row.id,
    catId: row.cat_id,
    type: row.type,
    description: row.description,
    severity: row.severity,
    date: row.date,
    createdAt: row.created_at,
  };
}

export async function getIncidents(catId: string): Promise<Incident[]> {
  const user = await getSessionUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("incidents")
    .select("*")
    .eq("cat_id", catId)
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  return (data ?? []).map(rowToIncident);
}

export async function createIncident(
  catId: string,
  data: FormData
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase.from("incidents").insert({
    cat_id: catId,
    user_id: user.id,
    type: data.get("type") as string,
    description: data.get("description") as string,
    severity: data.get("severity") as string,
    date: data.get("date") as string,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/incidents`);
  revalidatePath(`/cats/${catId}`);
  revalidatePath("/");
}

export async function updateIncident(
  catId: string,
  incidentId: string,
  data: FormData
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase
    .from("incidents")
    .update({
      type: data.get("type") as string,
      description: data.get("description") as string,
      severity: data.get("severity") as string,
      date: data.get("date") as string,
    })
    .eq("id", incidentId)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/incidents`);
  revalidatePath(`/cats/${catId}`);
  revalidatePath("/");
}

export async function deleteIncident(
  catId: string,
  incidentId: string
): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase
    .from("incidents")
    .delete()
    .eq("id", incidentId)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${catId}/incidents`);
  revalidatePath(`/cats/${catId}`);
  revalidatePath("/");
}
