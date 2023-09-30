import type { Prediction } from "../types/predictions";

export const DUMMY_PREDICTION = {
  prompt:
    "Create a 5D dark and futuristic city street with vibrant blue, purple, and turquoise colors.",
  negativePrompt: "ugly, disfigured, low quality, blurry, nsfw",
  guidanceScale: 1.5,
  strength: 0.5,
  seed: 111,
  controlnetConditioningScale: 1.1,
};

export const DUMMY_PREDICTION_RESPONSE_4 = {
  id: "mycizkbbqzizd5aesqnabszp7a",
  version: "9cdabf8f8a991351960c7ce2105de2909514b40bd27ac202dba57935b07d29d4",
  input: {
    batch_size: 4,
    controlnet_conditioning_scale: 1.2,
    guidance_scale: 7.5,
    negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
    num_inference_steps: 50,
    prompt:
      "Create a mixed-media collage featuring a contrast between urban decay and nature's resilience, showcasing a crumbling cityscape being reclaimed by lush vegetation and wild animals.",
    qr_code_content: "https://www.qriginals.com",
    seed: 22304,
    strength: 0.9,
  },
  logs: "Generating QR Code from content\n  0%|          | 0/45 [00:00<?, ?it/s]\n  2%|▏         | 1/45 [00:01<01:22,  1.88s/it]\n  4%|▍         | 2/45 [00:03<01:20,  1.88s/it]\n  7%|▋         | 3/45 [00:05<01:18,  1.88s/it]\n  9%|▉         | 4/45 [00:07<01:17,  1.88s/it]\n 11%|█         | 5/45 [00:09<01:15,  1.88s/it]\n 13%|█▎        | 6/45 [00:11<01:13,  1.88s/it]\n 16%|█▌        | 7/45 [00:13<01:11,  1.89s/it]\n 18%|█▊        | 8/45 [00:15<01:09,  1.89s/it]\n 20%|██        | 9/45 [00:16<01:08,  1.89s/it]\n 22%|██▏       | 10/45 [00:18<01:06,  1.90s/it]\n 24%|██▍       | 11/45 [00:20<01:04,  1.90s/it]\n 27%|██▋       | 12/45 [00:22<01:02,  1.90s/it]\n 29%|██▉       | 13/45 [00:24<01:00,  1.90s/it]\n 31%|███       | 14/45 [00:26<00:59,  1.90s/it]\n 33%|███▎      | 15/45 [00:28<00:57,  1.91s/it]\n 36%|███▌      | 16/45 [00:30<00:55,  1.91s/it]\n 38%|███▊      | 17/45 [00:32<00:53,  1.91s/it]\n 40%|████      | 18/45 [00:34<00:51,  1.92s/it]\n 42%|████▏     | 19/45 [00:36<00:49,  1.92s/it]\n 44%|████▍     | 20/45 [00:38<00:47,  1.92s/it]\n 47%|████▋     | 21/45 [00:39<00:46,  1.92s/it]\n 49%|████▉     | 22/45 [00:41<00:44,  1.92s/it]\n 51%|█████     | 23/45 [00:43<00:42,  1.93s/it]\n 53%|█████▎    | 24/45 [00:45<00:40,  1.93s/it]\n 56%|█████▌    | 25/45 [00:47<00:38,  1.94s/it]\n 58%|█████▊    | 26/45 [00:49<00:36,  1.94s/it]\n 60%|██████    | 27/45 [00:51<00:34,  1.94s/it]\n 62%|██████▏   | 28/45 [00:53<00:33,  1.95s/it]\n 64%|██████▍   | 29/45 [00:55<00:31,  1.95s/it]\n 67%|██████▋   | 30/45 [00:57<00:29,  1.96s/it]\n 69%|██████▉   | 31/45 [00:59<00:27,  1.96s/it]\n 71%|███████   | 32/45 [01:01<00:25,  1.97s/it]\n 73%|███████▎  | 33/45 [01:03<00:23,  1.97s/it]\n 76%|███████▌  | 34/45 [01:05<00:21,  1.98s/it]\n 78%|███████▊  | 35/45 [01:07<00:19,  1.98s/it]\n 80%|████████  | 36/45 [01:09<00:17,  1.99s/it]\n 82%|████████▏ | 37/45 [01:11<00:15,  2.00s/it]\n 84%|████████▍ | 38/45 [01:13<00:13,  2.00s/it]\n 87%|████████▋ | 39/45 [01:15<00:12,  2.00s/it]\n 89%|████████▉ | 40/45 [01:17<00:10,  2.01s/it]\n 91%|█████████ | 41/45 [01:19<00:08,  2.01s/it]\n 93%|█████████▎| 42/45 [01:21<00:06,  2.01s/it]\n 96%|█████████▌| 43/45 [01:23<00:04,  2.00s/it]\n 98%|█████████▊| 44/45 [01:25<00:02,  2.00s/it]\n100%|██████████| 45/45 [01:27<00:00,  2.00s/it]\n100%|██████████| 45/45 [01:27<00:00,  1.94s/it]\n",
  output: [
    "https://pbxt.replicate.delivery/bymNKVWIfxU0JKumzteyWSDV7Qe8YdIe2NLSdxC9rkPmn6VFB/output-0.png",
    "https://pbxt.replicate.delivery/qLokI1PJtO59Cp39Y2HWAHBIrW361y1bBEKk78NvHbf8UvqIA/output-1.png",
    "https://pbxt.replicate.delivery/pAIB5fFc4UVceUp4feFwhhIGFmj9sTfSRHU2fSbmTO9jeUvqIA/output-2.png",
    "https://pbxt.replicate.delivery/TUremKWddiTzRSg45AUHYGrP9BQSitL3owIGzuLNbpk9UvqIA/output-3.png",
  ],
  error: null,
  status: "succeeded",
  created_at: "2023-07-31T22:39:24.97856Z",
  started_at: "2023-07-31T22:39:25.067608Z",
  completed_at: "2023-07-31T22:40:59.901575Z",
  metrics: {
    predict_time: 94.833967,
  },
  urls: {
    cancel:
      "https://api.replicate.com/v1/predictions/mycizkbbqzizd5aesqnabszp7a/cancel",
    get: "https://api.replicate.com/v1/predictions/mycizkbbqzizd5aesqnabszp7a",
  },
} as unknown as Prediction;
