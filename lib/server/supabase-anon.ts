import { createClient } from "@supabase/supabase-js";
import { cache } from "react";

import { env } from "../env.mjs";

import type { Database } from "../types/db";
import type { Creation } from "../types/creations";

export const createAnonClient = cache(() => {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false },
    }
  );
});

export async function getCreations(params?: {
  filterByUserId?: string;
  limit?: number;
  orderBy?: "created_at" | "likes_count";
}): Promise<Creation[] | null> {
  const supabase = createAnonClient();
  try {
    const query = supabase.from("creations").select("*");
    if (params?.filterByUserId) query.eq("user_id", params.filterByUserId);
    if (params?.limit) query.limit(params.limit);
    if (params?.orderBy) query.order(params.orderBy, { ascending: false });
    const { data: creations } = await query.throwOnError();
    return creations;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getCreation(
  creationId: string
): Promise<Creation | null> {
  const supabase = createAnonClient();
  try {
    const { data: creation } = await supabase
      .from("creations")
      .select("*")
      .eq("id", creationId)
      .single()
      .throwOnError();
    return creation;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getPublicUserData(params: { userId: string }) {
  const supabase = createAnonClient();
  try {
    const { data: user } = await supabase
      .from("public_user_data")
      .select("avatar_url, user_name")
      .eq("id", params.userId)
      .single()
      .throwOnError();
    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Automatically converts to webp
export function getUserUploadUrl(params: {
  userId: string;
  creationId: string;
  variant: "original" | "thumbnail";
}): string {
  const supabase = createAnonClient();
  const path = `users/${params.userId}/creations/${params.creationId}/${params.variant}.png`;
  const result = supabase.storage.from("uploads").getPublicUrl(path);
  return result.data.publicUrl;
}
