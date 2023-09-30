import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "~/app/logo";
import { Button } from "~/components/buttons/generic";
import { GALLERY_PAGE, SIGN_IN_PAGE } from "~/lib/constants/routes";
import { getUser } from "~/lib/server/supabase";
import { ResetPasswordForm } from "./reset-password-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Qriginals",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function Page() {
  const user = await getUser();
  if (user) redirect(GALLERY_PAGE);

  return (
    <div className="mx-auto w-full max-w-sm lg:w-96">
      <div>
        <Link href={GALLERY_PAGE}>
          <Logo className="-ml-1 h-12 w-auto hover:opacity-75" />
        </Link>
        <h1 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgot Password?
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Enter the email address you used when you joined and we&apos;ll send
          you instructions to reset your password.
          <Button
            asChild
            variant="link"
            className="p-0 h-fit text-brand-600 hover:text-brand-500"
          >
            <Link href={SIGN_IN_PAGE} className="font-semibold ">
              Go back to Sign in.
            </Link>
          </Button>
        </p>
      </div>

      <div className="mt-10">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
