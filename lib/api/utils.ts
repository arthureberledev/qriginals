import "server-only";

import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class HttpError extends Error {
  status: number;
  constructor(params: { status: number; message: string }) {
    super(params.message);
    this.status = params.status;
  }
}

/**
 * Throws an `HttpError` with a given status code and message.
 * HttpErrors will be send back to the client.
 * @param status HTTP status code
 * @param message error message that will be displayed to the user
 * @returns never
 * @example
 * raise(400, "Missing amount_total");
 * // throws an HttpError with status code 400 and message "Missing amount_total"
 */
export function raise(status: number, message: string): never {
  throw new HttpError({ status, message });
}

/**
 * @param error Error that needs to be handled. Can be a `HttpError`, `ZodError` or any other error.
 * @returns a NextResponse or Response object that needs to be returned from an API route
 */
export function handleError(error: unknown): NextResponse | Response {
  console.log(error);
  if (error instanceof HttpError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.issues }, { status: 400 });
  }
  return NextResponse.json(
    { error: "An Error occurred. Please try again later." },
    { status: 500 }
  );
}
