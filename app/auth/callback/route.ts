import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { SET_USERNAME_PAGE } from "~/lib/constants/routes";
import type { Database } from "~/lib/types/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    // 04.08. Workaround https://github.com/supabase/auth-helpers/issues/545#issuecomment-1594691115
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error(error);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + SET_USERNAME_PAGE);
}
