import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";
import { z } from "zod";

import { redis } from "~/lib/api/redis";
import { handleError, raise } from "~/lib/api/utils";
import { createEdgeHandlerClient } from "~/lib/edge/supabase";

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(10, "60 s"),
  analytics: true,
});

const Schema = z.object({
  creationId: z.string(),
});

export const runtime = "edge";

export async function POST(req: Request) {
  if (ratelimit && process.env.NODE_ENV === "production") {
    const ipIdentifier = req.headers.get("x-real-ip");
    const result = await ratelimit.limit(ipIdentifier ?? "");
    if (!result.success) {
      return new Response("Too many requests. Please try again in a minute.", {
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
    if (!validation.success) raise(400, validation.error.message);

    const supabase = createEdgeHandlerClient(req);
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();
    if (getUserError) raise(500, getUserError.message);
    if (!user) raise(401, "Unauthorized");

    const { error: insertUseError } = await supabase.from("uses").insert({
      user_id: user.id,
      creation_id: validation.data.creationId,
    });
    if (insertUseError) raise(500, insertUseError.message);

    return NextResponse.json({ message: "Created" }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
