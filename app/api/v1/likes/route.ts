import { NextResponse } from "next/server";
import { z } from "zod";
import { createEdgeHandlerClient } from "~/lib/edge/supabase";
import { handleError, raise } from "~/lib/api/utils";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "~/lib/api/redis";

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(10, "60 s"),
  analytics: true,
});

export const runtime = "edge";

const schema = z.object({
  creationId: z.string(),
});

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
    if (!user || getUserError) raise(401, "Unauthorized");

    const body = await req.json();
    const validation = schema.safeParse(body);
    if (!validation.success) raise(400, validation.error.message);

    const { error: insertLikeError } = await supabase.from("likes").insert({
      user_id: user.id,
      creation_id: validation.data.creationId,
    });
    if (insertLikeError) raise(500, insertLikeError.message);

    return NextResponse.json({ message: "Created" }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: Request) {
  const supabase = createEdgeHandlerClient(req);
  try {
    const creationId = new URL(req.url).searchParams.get("creation-id");
    if (!creationId) raise(400, "Missing Creation ID");

    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();
    if (getUserError) raise(500, getUserError.message);
    if (!user) raise(401, "Unauthorized");

    const { error: deleteLikeError } = await supabase
      .from("likes")
      .delete()
      .match({
        user_id: user.id,
        creation_id: creationId,
      });
    if (deleteLikeError) raise(500, deleteLikeError.message);

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
