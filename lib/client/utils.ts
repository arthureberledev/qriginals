import { toast } from "react-hot-toast";

export class ExposableError extends Error {
  constructor(params: { message: string }) {
    super(params.message);
  }
}

/**
 * Throws an `ExposableError` with a given message which will be displayed to the user!
 * If you want to throw an error that will be logged to the console, use `throw new Error()` instead.
 * @param message error message that will be displayed to the user
 */
export function raise(
  message: string,
  options?: { exposable: boolean }
): never {
  const exposable = options?.exposable ?? false;
  if (exposable) throw new ExposableError({ message });
  throw new Error(message);
}

export function handleError(error: unknown, message?: string) {
  if (error instanceof ExposableError) {
    toast.error(error.message);
    return;
  }
  console.error(error);
  toast.error(message ?? "Something went wrong. Please try again.", {
    duration: 10000,
  });
}

export function handleSuccess(message: string, options?: { duration: number }) {
  toast.success(message, options);
}
