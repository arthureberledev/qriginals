"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/buttons/generic";
import { Label, PasswordInput } from "~/components/form-elements";
import { handleError, handleSuccess, raise } from "~/lib/client/utils";
import { PasswordSchema } from "~/lib/schemas/inputs";

const FORM_ID = "change-password-form";
const ENDPOINT = "/api/v1/account/password";

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

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  const handleUpdate = async (formValues: FormValues) => {
    try {
      const response = await fetch(ENDPOINT, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: formValues.newPassword }),
      });
      if (response.status === 429) {
        const error = await response.text();
        raise(error, { exposable: true });
      }
      if (!response.ok) raise(`Response from '${ENDPOINT}' was not ok.`);

      startTransition(() => {
        handleSuccess("Successfully updated!");
        router.refresh();
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <form
        id={FORM_ID}
        onSubmit={form.handleSubmit(handleUpdate)}
        className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-5"
      >
        <div className="sm:col-span-3">
          <Label htmlFor="new-password">New password</Label>
          <PasswordInput
            className="mt-2"
            id="new-password"
            autoComplete="password"
            error={form.formState.errors.newPassword}
            {...form.register("newPassword")}
          />
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <PasswordInput
            className="mt-2"
            id="confirm-password"
            autoComplete="password"
            error={form.formState.errors.confirmPassword}
            {...form.register("confirmPassword")}
          />
        </div>
      </form>

      <div className="mt-8 flex items-center justify-start gap-x-2">
        <Button disabled={isPending} form={FORM_ID} type="submit">
          Save
        </Button>
        <Button
          disabled={isPending}
          form={FORM_ID}
          type="reset"
          variant="outline"
        >
          Reset
        </Button>
      </div>
    </>
  );
}
