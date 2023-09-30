import { twMerge } from "tailwind-merge";

import type { ClassNameValue } from "tailwind-merge";

export function formatToDateTime(secs: number) {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
}

export function getURL() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
}

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(inputs);
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function isArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value);
}

export async function isJsonBody(req: Request): Promise<boolean> {
  try {
    await req.json();
  } catch (e) {
    return false;
  }
  return true;
}

type GenericObject<T extends string> = { [P in T]: string };
export function isObjectWithProperty<T extends string>(
  obj: any,
  prop: T
): obj is GenericObject<T> {
  return (
    typeof obj === "object" &&
    obj !== null &&
    prop in obj &&
    typeof obj[prop] === "string"
  );
}
