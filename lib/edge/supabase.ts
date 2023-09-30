import { RequestCookies } from "@edge-runtime/cookies";
import {
  type User,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";

import type { Database } from "../types/db";

export function createEdgeHandlerClient(req: Request) {
  const cookies = new RequestCookies(req.headers) as any;
  return createRouteHandlerClient<Database>({ cookies: () => cookies });
}

export async function getUser(req: Request): Promise<User | null> {
  const supabase = createEdgeHandlerClient(req);
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
