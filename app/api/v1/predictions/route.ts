import { NextResponse } from "next/server";
import Replicate from "replicate";

import { openAI } from "~/lib/api/openai";
import { createEdgeHandlerClient } from "~/lib/edge/supabase";
import { handleError, raise } from "~/lib/api/utils";
import { PROMPT_MESSAGES_V1 } from "~/lib/constants/prompts";
import { env } from "~/lib/env.mjs";
import { predictionParametersSchema } from "~/lib/schemas/predictions";

const MODEL_VERSION =
  "9cdabf8f8a991351960c7ce2105de2909514b40bd27ac202dba57935b07d29d4";

const replicate = new Replicate({ auth: env.REPLICATE_API_KEY });

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) raise(400, "Missing Prediction ID");

    const prediction = await replicate.predictions.get(id);
    if (!prediction || prediction.error) raise(500, prediction.error);

    return NextResponse.json(prediction, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const validation = predictionParametersSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { message: validation.error.issues },
      { status: 400 }
    );
  }

  // Validate user is logged in
  const supabase = createEdgeHandlerClient(req);
  const {
    data: { user },
    error: noUserError,
  } = await supabase.auth.getUser();
  if (noUserError) {
    return handleError(noUserError);
  }
  if (!user) {
    console.warn(
      "Unauthorized User tried to call protected endpoint: '/api/v1/predictions'."
    );
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  // Generate prompt if necessary, create prediction and return
  try {
    let prompt = validation.data.prompt;
    if (!prompt) {
      const chatCompletion = await openAI.chat.completions.create({
        model: "gpt-3.5-turbo",
        max_tokens: 200,
        messages: PROMPT_MESSAGES_V1,
      });
      if (!chatCompletion.choices[0].message.content)
        raise(500, "Failed to generate prompt.");
      prompt = chatCompletion.choices[0].message.content;
    }
    if (!prompt) raise(500, "Missing prompt.");

    const prediction = await replicate.predictions.create({
      version: MODEL_VERSION,
      input: {
        prompt,
        seed: validation.data.seed,
        qr_code_content: validation.data.qrCodeContent,
        negative_prompt: validation.data.negativePrompt,
        guidance_scale: validation.data.guidanceScale,
        strength: validation.data.strength,
        controlnet_conditioning_scale:
          validation.data.controlnetConditioningScale,
        num_inference_steps: 75,
        batch_size: 1,
      },
    });

    if (!prediction || prediction.error) raise(500, prediction.error);

    return NextResponse.json(
      { id: prediction.id, status: prediction.status },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
