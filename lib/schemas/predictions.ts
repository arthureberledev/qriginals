import { z } from "zod";

export const predictionParametersSchema = z.object({
  qrCodeContent: z.string(),
  prompt: z.string().optional(),
  negativePrompt: z.string(),
  seed: z.number(),
  strength: z.number(),
  guidanceScale: z.number(),
  controlnetConditioningScale: z.number(),
  batchSize: z.number().optional(),
  numInferenceSteps: z.number().optional(),
});
