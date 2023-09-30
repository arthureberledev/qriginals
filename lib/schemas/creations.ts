import { z } from "zod";

export const creationParametersSchema = z
  .object({
    prompt: z.string(),
    negative_prompt: z.string(),
    guidance_scale: z.number(),
    strength: z.number(),
    controlnet_conditioning_scale: z.number(),
    seed: z.number(),
  })
  .transform((data) => ({
    prompt: data.prompt,
    negativePrompt: data.negative_prompt,
    guidanceScale: data.guidance_scale,
    strength: data.strength,
    controlnetConditioningScale: data.controlnet_conditioning_scale,
    seed: data.seed,
  }));
