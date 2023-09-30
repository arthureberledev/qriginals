import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { Footer } from "./footer";
import { Header } from "./header";
import { Button } from "~/components/buttons/generic";
import { SIGN_IN_PAGE } from "~/lib/constants/routes";
import { getUserData } from "~/lib/server/supabase";
import { UserNavigation } from "./user-navigation";
import { Banner } from "./banner";

export default async function Layout(props: { children: React.ReactNode }) {
  const userData = await getUserData();

  return (
    <>
      {!userData && <Banner />}

      <div className="relative">
        <Header
          userNavigation={
            userData ? (
              <UserNavigation
                email={userData.email}
                credits={userData.credits}
                username={userData.username}
                avatarUrl={userData.avatarUrl}
              />
            ) : (
              <Button variant="link" asChild className="px-0">
                <Link
                  href={SIGN_IN_PAGE}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Sign in
                  <ArrowLongRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            )
          }
        />
        {props.children}
        <Footer />
      </div>
    </>
  );
}
