import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";
import sharp from "sharp";
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
  imageUrl: z.string().url(),
  id: z.string(),
  name: z.string().min(3).max(50),
  prompt: z.string().min(10).max(1000),
  negativePrompt: z.string().min(1).max(1000),
  guidanceScale: z.number().min(0.1).max(30),
  strength: z.number().min(0.01).max(1),
  controlnetConditioningScale: z.number().min(1).max(2),
  seed: z.number().min(1).max(9999999999),
});

const PNG_FORMAT = "image/png";

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

  const body = await req.json();
  const validation = Schema.safeParse(body);
  if (!validation.success) {
    return new Response(validation.error.message, { status: 400 });
  }

  const supabase = createEdgeHandlerClient(req);
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();
  if (!user || getUserError) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const creationId = validation.data.id;

  // Check if creation already exists
  const { data } = await supabase
    .from("creations")
    .select("id")
    .eq("id", creationId);

  if (data && data.length > 0) {
    return NextResponse.json({ message: "Already exists" }, { status: 409 });
  }

  try {
    console.time("Execution Time");
    // Upload parameters and info to db
    const { error: insertCreationError } = await supabase
      .from("creations")
      .insert({
        id: creationId,
        user_id: user.id,
        name: validation.data.name,
        parameters: {
          prompt: validation.data.prompt,
          negative_prompt: validation.data.negativePrompt,
          guidance_scale: validation.data.guidanceScale,
          strength: validation.data.strength,
          controlnet_conditioning_scale:
            validation.data.controlnetConditioningScale,
          seed: validation.data.seed,
        },
      });
    if (insertCreationError) raise(500, insertCreationError.message);

    // Transform image and upload to storage
    const imageResponse = await fetch(validation.data.imageUrl);
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = await sharp(imageArrayBuffer)
      .png({
        compressionLevel: 6,
        quality: 50,
      })
      .toBuffer();
    const imageBlob = new Blob([imageBuffer], { type: PNG_FORMAT });
    const imagePath = `users/${user.id}/creations/${creationId}/original.png`;
    const { error: uploadImageError } = await supabase.storage
      .from("uploads")
      .upload(imagePath, imageBlob, {
        contentType: PNG_FORMAT,
      });
    if (uploadImageError) raise(500, uploadImageError.message);

    // Create thumbnail and upload to storage
    const thumbnailBuffer = await sharp(imageBuffer)
      .resize(382, 382, { fit: "inside", position: "center" })
      .png({
        compressionLevel: 6,
        quality: 50,
      })
      .toBuffer();
    const thumbnailBlob = new Blob([thumbnailBuffer], { type: PNG_FORMAT });
    const thumbnailPath = `users/${user.id}/creations/${creationId}/thumbnail.png`;
    const { error: uploadThumbnailError } = await supabase.storage
      .from("uploads")
      .upload(thumbnailPath, thumbnailBlob, { contentType: PNG_FORMAT });
    if (uploadThumbnailError) raise(500, uploadThumbnailError.message);

    return NextResponse.json({ message: "Uploaded" }, { status: 200 });
  } catch (error) {
    // Delete creation if something goes wrong
    await supabase.from("creations").delete().eq("id", creationId);
    await supabase.storage
      .from("uploads")
      .remove([
        `users/${user.id}/creations/${creationId}/original.png`,
        `users/${user.id}/creations/${creationId}/thumbnail.png`,
      ]);

    return handleError(error);
  } finally {
    console.timeEnd("Execution Time");
  }
}
