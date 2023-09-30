"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/buttons/generic";
import { ErrorText, Input, Label } from "~/components/form-elements";
import { handleError, handleSuccess, raise } from "~/lib/client/utils";
import { GALLERY_PAGE } from "~/lib/constants/routes";
import { UsernameSchema } from "~/lib/schemas/inputs";

const ENDPOINT = "/api/v1/account/username";

const FormSchema = z.object({
  username: UsernameSchema,
});

type FormValues = z.infer<typeof FormSchema>;

export function SetUsernameForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
  });

  const handleUpdateUsername = async (formValues: FormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch(ENDPOINT, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formValues.username }),
      });
      if (response.status === 409)
        raise("This user name is already taken.", { exposable: true });
      if (response.status === 429) {
        const error = await response.text();
        raise(error, { exposable: true });
      }
      if (!response.ok) raise(`Response from '${ENDPOINT}' was not ok.`);
      handleSuccess("Registration completed.");
      router.push(GALLERY_PAGE);
      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleUpdateUsername)}
      className="flex flex-col gap-y-6"
    >
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          className={clsx(
            "mt-2",
            form.formState.errors.username &&
              "ring-red-300 text-red-900 placeholder:text-red-300 focus:ring-red-500"
          )}
          id="username"
          type="text"
          autoComplete="username"
          {...form.register("username")}
        />
        {form.formState.errors.username && (
          <ErrorText>{form.formState.errors.username.message}</ErrorText>
        )}
      </div>

      <div className="mt-2">
        <Button disabled={isLoading} className="w-full" type="submit">
          Update
        </Button>
      </div>
    </form>
  );
}
