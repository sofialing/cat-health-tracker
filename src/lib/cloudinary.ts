import { createClient } from "@/lib/supabase/client";

export async function uploadToStorage(file: File): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `profiles/${user.id}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
