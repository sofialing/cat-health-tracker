"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/actions/auth";
import { revalidatePath } from "next/cache";
import type { Cat } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCat(row: any): Cat {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    birthday: row.birthday,
    initialWeight: row.initial_weight,
    weightUnit: row.weight_unit,
    profilePicture: row.profile_picture ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getCats(): Promise<Cat[]> {
  const user = await getSessionUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("cats")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return (data ?? []).map(rowToCat);
}

export async function getCatById(id: string): Promise<Cat | null> {
  const user = await getSessionUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("cats")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  return data ? rowToCat(data) : null;
}

export async function createCat(data: FormData): Promise<{ id: string }> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("cats")
    .insert({
      user_id: user.id,
      name: data.get("name") as string,
      birthday: data.get("birthday") as string,
      initial_weight: parseFloat(data.get("weight") as string),
      weight_unit: data.get("unit") as string,
      profile_picture: (data.get("profilePicture") as string) || null,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/");
  return { id: row.id };
}

export async function updateCat(id: string, data: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const updates: Record<string, unknown> = {
    name: data.get("name") as string,
    birthday: data.get("birthday") as string,
    initial_weight: parseFloat(data.get("weight") as string),
    weight_unit: data.get("unit") as string,
  };
  if (data.get("profilePicture")) {
    updates.profile_picture = data.get("profilePicture") as string;
  }
  const { error } = await supabase
    .from("cats")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/cats/${id}`);
  revalidatePath("/");
}

export async function deleteCat(id: string): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");
  const supabase = await createClient();
  const { error } = await supabase
    .from("cats")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}
