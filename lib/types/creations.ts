import { z } from "zod";
import type { Database } from "./db";
import { creationParametersSchema } from "../schemas/creations";

export type Creation = Database["public"]["Tables"]["creations"]["Row"];
export type Like = Database["public"]["Tables"]["likes"]["Row"];

export type CreationParameters = z.infer<typeof creationParametersSchema>;
