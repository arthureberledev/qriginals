import { redirect } from "next/navigation";

import { QRCodeIcon } from "~/app/icons";
import { LikeButton } from "~/components/buttons/like";
import { UseButton } from "~/components/buttons/use";
import { CreationThumbnail } from "~/components/creation-thumbnail";
import { CREATE_NEW_PAGE, SIGN_IN_PAGE } from "~/lib/constants/routes";
import { createServerComponentClient, getUser } from "~/lib/server/supabase";
import { EmptyState } from "../empty-state";

// This page displays all the qr codes that the user has `liked`
export default async function Page() {
  const supabase = createServerComponentClient();
  const user = await getUser();
  if (!user) redirect(SIGN_IN_PAGE);

  const { data: likes, error: getLikesError } = await supabase
    .from("likes")
    .select("id, creation:creations (id, user_id, name)")
    .eq("user_id", user.id)
    .limit(25)
    .order("created_at", { ascending: false });
  if (getLikesError) throw getLikesError;

  return (
    <section className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
      {likes.length > 0 ? (
        likes.map(({ creation }) =>
          creation ? (
            <CreationThumbnail
              key={creation.id}
              creationId={creation.id}
              creatorId={creation.user_id}
              name={creation.name}
              buttons={[
                <LikeButton
                  isLiked={true}
                  key={creation.id}
                  creationId={creation.id}
                />,
                <UseButton key={creation.id} creationId={creation.id} />,
              ]}
            />
          ) : null
        )
      ) : (
        <EmptyState
          href={CREATE_NEW_PAGE}
          icon={QRCodeIcon}
          title="You have not liked anything yet"
        />
      )}
    </section>
  );
}
