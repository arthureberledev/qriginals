import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";
import { z } from "zod";

import { redis } from "~/lib/api/redis";
import { handleError, raise } from "~/lib/api/utils";
import { createEdgeHandlerClient } from "~/lib/edge/supabase";
import { EmailSchema } from "~/lib/schemas/inputs";

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(5, "1440 m"),
  analytics: true,
});

const EMAIL_ALREADY_REGISTERED_CODE = 422;

const Schema = z.object({ email: EmailSchema });

export const runtime = "edge";

export async function PATCH(req: Request) {
  if (ratelimit && process.env.NODE_ENV === "production") {
    const ipIdentifier = req.headers.get("x-real-ip");
    const result = await ratelimit.limit(ipIdentifier ?? "");
    if (!result.success) {
      return new Response("Too many requests. Please try again in 24 hours.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": result.limit,
          "X-RateLimit-Remaining": result.remaining,
        } as any,
      });
    }
  }

  try {
    const body = await req.json();
    const validation = Schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues },
        { status: 400 }
      );
    }

    const supabase = createEdgeHandlerClient(req);
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();
    if (getUserError) throw getUserError;
    if (!user) raise(401, "Unauthorized.");

    const { error: updateEmailError } = await supabase.auth.updateUser({
      email: validation.data.email,
    });

    if (updateEmailError?.status === EMAIL_ALREADY_REGISTERED_CODE)
      raise(409, "Email already taken.");
    if (updateEmailError) throw updateEmailError;

    return NextResponse.json({ message: "Updated" }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
