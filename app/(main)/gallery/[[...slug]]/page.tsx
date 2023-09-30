import { notFound } from "next/navigation";

import { LowerIllustration, UpperIllustration } from "~/app/illustrations";
import {
  createServerComponentClient,
  getUserLikes,
} from "~/lib/server/supabase";
import { GalleryItem } from "./gallery-item";
import { Hero } from "./hero";
import { Sort } from "./sort";

async function getGalleryItems(sorting: "new" | "most-popular" | undefined) {
  const supabase = createServerComponentClient();

  const query = supabase
    .from("creations")
    .select("id, user_id, name, like_count, use_count, parameters, created_at");

  const { data: galleryItems, error: getGalleryItemsError } = await query
    .order(sorting === "new" ? "created_at" : "like_count", {
      ascending: false,
    })
    .limit(50);
  if (getGalleryItemsError) {
    console.error(getGalleryItemsError);
    notFound();
  }
  if (!galleryItems) notFound();

  return galleryItems;
}

export default async function Page(props: {
  params: { slug: string[] | undefined };
}) {
  const slug = props.params.slug ? props.params.slug[0] : undefined;
  if (slug && slug !== "most-popular" && slug !== "new") notFound();
  const sorting = (slug ? slug : "most-popular") as "most-popular" | "new";

  const [userLikes, galleryItems] = await Promise.all([
    getUserLikes(),
    getGalleryItems(sorting),
  ]);

  return (
    <main className="isolate">
      <div className="relative pt-14">
        <UpperIllustration />
        <div className="pt-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Hero />
          </div>
        </div>
        <div className="pt-24">
          <LowerIllustration />
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <Sort currentSorting={sorting} />
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <GalleryItem
              key={item.id}
              isLiked={userLikes.includes(item.id)}
              isPriority={index === 0 || index === 1 || index === 2}
              creation={item}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
