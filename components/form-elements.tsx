import { forwardRef, useState } from "react";
import { clsx } from "clsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import { cn } from "~/lib/helpers/functions";

import type { ComponentProps, ComponentPropsWithoutRef } from "react";
import type { FieldError } from "react-hook-form";

export function Label({ children, ...props }: ComponentProps<"label">) {
  return (
    <label
      className="block text-sm font-medium leading-6 text-gray-900"
      {...props}
    >
      {children}
    </label>
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6",
        className
      )}
    />
  );
});

export const PasswordInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input"> & {
    error: FieldError | undefined;
  }
>(function PasswordInput({ className, error, ...props }, ref) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleIsPasswordVisible = () => setIsPasswordVisible((prev) => !prev);

  return (
    <>
      <div className={cn("flex rounded-md shadow-sm", className)}>
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <input
            ref={ref}
            type={isPasswordVisible ? "text" : "password"}
            className={cn(
              "block w-full rounded-none rounded-l-md shadow-none border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6",
              error &&
                "ring-red-300 text-red-900 placeholder:text-red-300 focus:ring-red-500"
            )}
            {...props}
          />
        </div>
        <button
          type="button"
          onClick={handleIsPasswordVisible}
          className={clsx(
            "relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset bg-white ring-gray-300 hover:bg-gray-50",
            error && "ring-red-300 text-red-900 focus:ring-red-500"
          )}
        >
          {isPasswordVisible ? (
            <EyeSlashIcon
              className="-ml-0.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          ) : (
            <EyeIcon
              className="-ml-0.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
      {error && <ErrorText>{error.message}</ErrorText>}
    </>
  );
});

export function Hint({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <div className={className}>
      <span className="text-sm leading-6 text-gray-500" {...props}>
        {children}
      </span>
    </div>
  );
}

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  ComponentPropsWithoutRef<"textarea">
>(function Textarea({ className, ...props }, ref) {
  return (
    <div className={className}>
      <textarea
        ref={ref}
        {...props}
        className="block w-full disabled:bg-gray-50 disabled:resize-none resize-y rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
      />
    </div>
  );
});

export function HelperText({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn("mt-3 text-sm leading-6 text-gray-600", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function ErrorText({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p className={cn("mt-2 text-sm text-red-600", className)} {...props}>
      {children}
    </p>
  );
}
