"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { Button } from "~/components/buttons/generic";
import { Label, PasswordInput } from "~/components/form-elements";
import { handleError, handleSuccess } from "~/lib/client/utils";
import { GALLERY_PAGE } from "~/lib/constants/routes";
import { PasswordSchema } from "~/lib/schemas/inputs";

import type { Database } from "~/lib/types/db";

const FormSchema = z
  .object({
    newPassword: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type FormValues = z.infer<typeof FormSchema>;

export function UpdatePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleUpdatePassword = async (formValues: FormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: formValues.newPassword,
      });
      if (error) throw error;
      handleSuccess("Updated successfully.");
      startTransition(() => {
        router.push(GALLERY_PAGE);
        router.refresh();
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <form
        onSubmit={form.handleSubmit(handleUpdatePassword)}
        className="space-y-6"
      >
        <div>
          <Label htmlFor="new-password">New password</Label>
          <PasswordInput
            className="mt-2"
            id="new-password"
            autoComplete="password"
            error={form.formState.errors.newPassword}
            {...form.register("newPassword")}
          />
        </div>

        <div>
          <Label htmlFor="confirm-password">Confirm password</Label>
          <PasswordInput
            className="mt-2"
            id="confirm-password"
            autoComplete="password"
            error={form.formState.errors.confirmPassword}
            {...form.register("confirmPassword")}
          />
        </div>

        <Button disabled={isPending} className="w-full" type="submit">
          Update
        </Button>
      </form>
    </>
  );
}
