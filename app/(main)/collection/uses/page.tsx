import { redirect } from "next/navigation";

import { QRCodeIcon } from "~/app/icons";
import { UseButton } from "~/components/buttons/use";
import { CreationThumbnail } from "~/components/creation-thumbnail";
import { CREATE_NEW_PAGE, SIGN_IN_PAGE } from "~/lib/constants/routes";
import { createServerComponentClient, getUser } from "~/lib/server/supabase";
import { EmptyState } from "../empty-state";

// This page displays all the templates that the user has `used`
export default async function Page() {
  const supabase = createServerComponentClient();
  const user = await getUser();
  if (!user) redirect(SIGN_IN_PAGE);

  const { data: uses, error: getUsesError } = await supabase
    .from("uses")
    .select("id, creation:creations (id, user_id, name)")
    .eq("user_id", user.id)
    .limit(25)
    .order("created_at", { ascending: false });
  if (getUsesError) throw getUsesError;

  const ids = new Set();
  const filteredUses = uses.filter((use) => {
    if (!ids.has(use.creation?.id)) {
      ids.add(use.creation?.id);
      return true;
    }
    return false;
  });

  return (
    <section className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
      {filteredUses.length > 0 ? (
        filteredUses.map(({ creation }) =>
          creation ? (
            <CreationThumbnail
              key={creation.id}
              creationId={creation.id}
              creatorId={creation.user_id}
              name={creation.name}
              buttons={[
                <UseButton key={creation.id} creationId={creation.id} />,
              ]}
            />
          ) : null
        )
      ) : (
        <EmptyState
          href={CREATE_NEW_PAGE}
          icon={QRCodeIcon}
          title="You have not used any template yet"
        />
      )}
    </section>
  );
}
