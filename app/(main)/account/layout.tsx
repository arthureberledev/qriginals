import { redirect } from "next/navigation";

import { SIGN_IN_PAGE } from "~/lib/constants/routes";
import { getUser } from "~/lib/server/supabase";
import { SideNavigation } from "./side-navigation";

import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account - Qriginals",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function Layout(props: { children: ReactNode }) {
  const user = await getUser();
  if (!user) redirect(SIGN_IN_PAGE);

  return (
    <div className="mx-auto max-w-7xl pt-20 lg:flex lg:gap-x-16 lg:px-8">
      <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <SideNavigation />
        </nav>
      </aside>

      <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
          {props.children}
        </div>
      </main>
    </div>
  );
}
