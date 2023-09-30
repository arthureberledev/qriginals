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

const schema = z.object({
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
    const supabase = createEdgeHandlerClient(req);
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();
    if (getUserError) throw getUserError;
    if (!user) raise(401, "Unauthorized.");

    const body = await req.json();
    const validation = schema.safeParse(body);
    if (!validation.success) raise(400, validation.error.message);

    await supabase
      .from("reports")
      .insert({
        reporter_id: user.id,
        creation_id: validation.data.creationId,
      })
      .throwOnError();

    return NextResponse.json({ message: "Reported" }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
