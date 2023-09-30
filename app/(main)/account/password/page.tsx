import { redirect } from "next/navigation";

import { SIGN_IN_PAGE } from "~/lib/constants/routes";
import { getUser } from "~/lib/server/supabase";
import { ChangePasswordForm } from "./change-password-form";

export default async function Page() {
  const user = await getUser();
  if (!user) redirect(SIGN_IN_PAGE);

  return (
    <div>
      <h1 className="text-base font-semibold leading-7 text-gray-900">
        Change password
      </h1>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Update your password associated with your account.
      </p>

      <div className="mt-10">
        {user.app_metadata.provider === "google" ? (
          <div>
            Since you have created your Account through Google, you need to
            change your password there as well. Please visit{" "}
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-500"
            >
              Google Account Security
            </a>{" "}
            to change your password.
          </div>
        ) : (
          <ChangePasswordForm />
        )}
      </div>
    </div>
  );
}
