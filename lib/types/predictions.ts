import { z } from "zod";

import { predictionParametersSchema } from "../schemas/predictions";

import type { Prediction as ReplicatePrediction } from "replicate";

export type PredictionParameters = z.infer<typeof predictionParametersSchema>;

export type PredictionLoadingState =
  | "idle"
  | "initializing"
  | "creating-prompt"
  | "starting-server"
  | "cold-booting"
  | "creating-qrcode"
  | "succeeded"
  | "failed"
  | "canceled";

export type Prediction = ReplicatePrediction & {
  input: {
    prompt: string;
    negative_prompt: string;
    seed: number;
    strength: number;
    batch_size: number;
    controlnet_conditioning_scale: number;
    guidance_scale: number;
    num_inference_steps: number;
    qr_code_content: string;
  };
  output?: string[] | null;
};
