import { createServerComponentClient as _createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";

import type { Database } from "~/lib/types/db";

export const createServerComponentClient = cache(() => {
  const cookieStore = cookies();
  return _createServerComponentClient<Database>({ cookies: () => cookieStore });
});

export async function getUserLikes() {
  try {
    const supabase = createServerComponentClient();
    const user = await getUser();
    if (!user) return [];

    const { data: likes, error: getLikesError } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", user.id);
    if (getLikesError) throw getLikesError;

    const userLikes = likes.map((like) => like.creation_id);
    return userLikes;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function getUser() {
  const supabase = createServerComponentClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getSession() {
  const supabase = createServerComponentClient();
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getUserData() {
  const supabase = createServerComponentClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (!user) return null;
    if (error) throw error;

    const { data: userData } = await supabase
      .from("credits")
      .select("amount, users(id, user_name, avatar_url)")
      .eq("user_id", user.id)
      .single()
      .throwOnError();
    if (!userData) return null;

    return {
      id: user.id,
      email: user.email ?? null,
      credits: userData.amount ?? null,
      username: userData.users?.user_name ?? null,
      avatarUrl: userData.users?.avatar_url ?? null,
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getSubscription() {
  const supabase = createServerComponentClient();
  try {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .maybeSingle()
      .throwOnError();
    return subscription;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export const getActiveProductsWithPrices = async () => {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { foreignTable: "prices" });

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};
