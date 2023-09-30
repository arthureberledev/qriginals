import { redirect } from "next/navigation";

import { SIGN_IN_PAGE } from "~/lib/constants/routes";
import { getUser, getUserData } from "~/lib/server/supabase";
import { ChangeProfileForm } from "./change-profile-form";

export default async function Page() {
  const [user, userData] = await Promise.all([getUser(), getUserData()]);
  if (!user) redirect(SIGN_IN_PAGE);
  if (!userData) redirect(SIGN_IN_PAGE);

  return (
    <section>
      <h1 className="text-base font-semibold leading-7 text-gray-900">
        Profile
      </h1>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        This information will be displayed publicly so be careful what you
        share.
      </p>
      <ChangeProfileForm
        isRegisteredViaGoogle={user.app_metadata.provider === "google"}
        email={userData.email ?? null}
        username={userData.username ?? null}
      />
    </section>
  );
}
