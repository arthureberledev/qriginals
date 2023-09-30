import "server-only"

import OpenAI from 'openai';

import { env } from "../env.mjs";

export const openAI = new OpenAI({
  apiKey: env.OPENAI_API_KEY // This is also the default, can be omitted
});
