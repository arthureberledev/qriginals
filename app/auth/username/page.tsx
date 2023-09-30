import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "~/app/logo";
import { GALLERY_PAGE } from "~/lib/constants/routes";
import { getUser, getUserData } from "~/lib/server/supabase";
import { SetUsernameForm } from "./set-username-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set Username - Qriginals",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function Page() {
  const [user, userData] = await Promise.all([getUser(), getUserData()]);
  if (!user) redirect(GALLERY_PAGE);
  if (!userData) redirect(GALLERY_PAGE);
  if (userData.username) redirect(GALLERY_PAGE);

  return (
    <div className="mx-auto w-full max-w-sm lg:w-96">
      <div>
        <Link href={GALLERY_PAGE}>
          <Logo className="-ml-1 h-12 w-auto hover:opacity-75" />
        </Link>
        <h1 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          One last thing...
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Set a username that will be displayed on your published creations.
        </p>
      </div>

      <div className="mt-10">
        <SetUsernameForm />
      </div>
    </div>
  );
}
