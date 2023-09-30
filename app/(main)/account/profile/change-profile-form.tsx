"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/buttons/generic";
import { HelperText, Input, Label } from "~/components/form-elements";
import { handleError, handleSuccess, raise } from "~/lib/client/utils";
import { CONFIRM_EMAIL_PAGE } from "~/lib/constants/routes";
import { EmailSchema, UsernameSchema } from "~/lib/schemas/inputs";

const FormSchema = z.object({
  username: UsernameSchema,
  email: EmailSchema,
});

type FormValues = z.infer<typeof FormSchema>;

const FORM_ID = "change-profile-form";

export function ChangeProfileForm(props: {
  isRegisteredViaGoogle: boolean;
  email: string | null;
  username: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: {
      email: props.email ?? "",
      username: props.username ?? "",
    },
    resolver: zodResolver(FormSchema),
  });

  const handleReset = () =>
    form.reset({ username: props.username ?? "", email: props.email ?? "" });

  const handleUpdate = async (formValues: FormValues) => {
    setIsLoading(true);
    if (
      formValues.username !== props.username ||
      formValues.email !== props.email
    ) {
      if (formValues.username !== props.username) {
        try {
          const response = await fetch("/api/v1/account/username", {
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
          if (!response.ok)
            raise("Response from '/api/v1/account/username' was not ok.");
        } catch (error) {
          handleError(error);
          setIsLoading(false);
          return;
        }
      }
      if (formValues.email !== props.email) {
        try {
          const response = await fetch("/api/v1/account/email", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formValues.email }),
          });
          if (response.status === 409)
            raise("This email address is already taken.", { exposable: true });
          if (response.status === 429) {
            const error = await response.text();
            raise(error, { exposable: true });
          }
          if (!response.ok)
            raise("Response from '/api/v1/account/email' was not ok.");
          router.push(CONFIRM_EMAIL_PAGE);
        } catch (error) {
          handleError(error);
          setIsLoading(false);
          return;
        }
      }
      router.refresh();
    }
    handleSuccess("Successfully updated!");
    setIsLoading(false);
  };

  return (
    <>
      <form
        id={FORM_ID}
        onSubmit={form.handleSubmit(handleUpdate)}
        className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
      >
        <div className="sm:col-span-4">
          <Label htmlFor="username">Username</Label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-600 sm:max-w-md">
              <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                qriginals.com/
              </span>
              <input
                type="text"
                id="username"
                autoComplete="username"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="janesmith"
                {...form.register("username")}
              />
            </div>
          </div>
        </div>

        <div className="sm:col-span-4">
          <div className="flex items-start">
            <Label htmlFor="email">Email address</Label>
          </div>

          <Input
            className="mt-2 disabled:bg-gray-100"
            id="email"
            type="email"
            autoComplete="email"
            disabled={props.isRegisteredViaGoogle}
            {...form.register("email")}
          />
          <HelperText>
            {props.isRegisteredViaGoogle
              ? "To change your email address, you need to go to your Google account security settings."
              : "Changes to your email address need to confirmed on both the old and new email address."}
          </HelperText>
        </div>
      </form>

      <div className="mt-8 flex items-center gap-x-2">
        <Button disabled={isLoading} form={FORM_ID} type="submit">
          Save
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleReset}
          type="reset"
          variant="outline"
        >
          Reset
        </Button>
      </div>
    </>
  );
}
