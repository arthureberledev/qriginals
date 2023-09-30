import { redirect } from "next/navigation";
import { UseButton } from "~/components/buttons/use";
import { CreationThumbnail } from "~/components/creation-thumbnail";

import { QRCodeIcon } from "~/app/icons";
import { CREATE_NEW_PAGE, SIGN_IN_PAGE } from "~/lib/constants/routes";
import { getUser } from "~/lib/server/supabase";
import { getCreations } from "~/lib/server/supabase-anon";
import { EmptyState } from "./empty-state";

// This page displays all the published qr codes that the user has made
export default async function Page() {
  const user = await getUser();
  if (!user) redirect(SIGN_IN_PAGE);

  const creations = await getCreations({
    filterByUserId: user.id,
    limit: 25,
    orderBy: "created_at",
  });

  return (
    <section className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
      {creations && creations.length > 0 ? (
        creations.map((creation) => (
          <CreationThumbnail
            key={creation.id}
            creationId={creation.id}
            creatorId={creation.user_id}
            name={creation.name}
            buttons={[<UseButton key={creation.id} creationId={creation.id} />]}
          />
        ))
      ) : (
        <EmptyState
          href={CREATE_NEW_PAGE}
          icon={QRCodeIcon}
          title="You have not created anything yet"
        />
      )}
    </section>
  );
}
