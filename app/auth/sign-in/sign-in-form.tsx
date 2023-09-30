"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { clsx } from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/buttons/generic";
import {
  ErrorText,
  Input,
  Label,
  PasswordInput,
} from "~/components/form-elements";
import { handleError, handleSuccess, raise } from "~/lib/client/utils";
import { GALLERY_PAGE, RESET_PASSWORD_PAGE } from "~/lib/constants/routes";
import { getURL } from "~/lib/helpers/functions";
import { EmailSchema, PasswordSchema } from "~/lib/schemas/inputs";

import type { Database } from "~/lib/types/db";

const FormSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

type FormValues = z.infer<typeof FormSchema>;

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleEmailSignIn = async (formValues: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formValues.email,
        password: formValues.password,
      });
      if (error && error.status === 400)
        raise("Invalid email or password.", { exposable: true });
      if (error) throw error;
      handleSuccess("Signed in successfully.");
      router.push(GALLERY_PAGE);
      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getURL() + "/auth/callback",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      handleError(error, "Error signing up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={form.handleSubmit(handleEmailSignIn)}
        className="space-y-6"
      >
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            className={clsx(
              "mt-2",
              form.formState.errors.email &&
                "ring-red-300 text-red-900 placeholder:text-red-300 focus:ring-red-500"
            )}
            id="email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <ErrorText>{form.formState.errors.email.message}</ErrorText>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            className="mt-2"
            id="password"
            autoComplete="password"
            error={form.formState.errors.password}
            {...form.register("password")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm leading-6">
            <Link
              href={RESET_PASSWORD_PAGE}
              className="font-semibold text-brand-600 hover:text-brand-500"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button disabled={isLoading} className="w-full" type="submit">
          Sign in
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm font-medium leading-6">
            <span className="bg-white px-6 text-gray-900">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="flex w-full items-center justify-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              viewBox="0 0 18 18"
              fill="none"
              role="img"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.64 9.20419C17.64 8.56601 17.5827 7.95237 17.4764 7.36328H9V10.8446H13.8436C13.635 11.9696 13.0009 12.9228 12.0477 13.561V15.8192H14.9564C16.6582 14.2524 17.64 11.9451 17.64 9.20419Z"
                fill="#4285F4"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z"
                fill="#34A853"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40664 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54755 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z"
                fill="#FBBC05"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-sm font-semibold leading-6">Google</span>
          </Button>
        </div>
      </div>
    </>
  );
}
