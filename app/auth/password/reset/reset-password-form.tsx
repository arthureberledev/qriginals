"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/buttons/generic";
import { ErrorText, Input, Label } from "~/components/form-elements";
import { handleError } from "~/lib/client/utils";
import {
  CONFIRM_RESET_PASSWORD_PAGE,
  UPDATE_PASSWORD_PAGE,
} from "~/lib/constants/routes";
import { getURL } from "~/lib/helpers/functions";
import { EmailSchema } from "~/lib/schemas/inputs";

import type { Database } from "~/lib/types/db";

const FormSchema = z.object({ email: EmailSchema });
type FormValues = z.infer<typeof FormSchema>;

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleResetPassword = async (formValues: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        formValues.email,
        { redirectTo: getURL() + UPDATE_PASSWORD_PAGE }
      );
      if (error) throw error;
      router.push(CONFIRM_RESET_PASSWORD_PAGE);
      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={form.handleSubmit(handleResetPassword)}
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

        <Button disabled={isLoading} className="w-full" type="submit">
          Reset
        </Button>
      </form>
    </>
  );
}
