import Link from "next/link";
import { notFound } from "next/navigation";

import { Logo } from "~/app/logo";
import { GALLERY_PAGE } from "~/lib/constants/routes";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm - Qriginals",
  robots: {
    follow: false,
    index: false,
  },
};

const messageLookup: { [key: string]: string } = {
  email: "We have sent you an email with a link to confirm your email address.",
  reset:
    "If this email address was used to create an account, instructions to reset your password will be sent to you. Please check your email.",
};

export default async function Page(props: {
  params: { slug: string | undefined };
}) {
  if (!props.params.slug) notFound();

  return (
    <div className="mx-auto w-full max-w-sm lg:w-96">
      <div>
        <Link href={GALLERY_PAGE}>
          <Logo className="-ml-1 h-12 w-auto hover:opacity-75" />
        </Link>
        <h1 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Thank you!
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {messageLookup[props.params.slug]}
        </p>
      </div>
    </div>
  );
}
