import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";

import { HeartIcon, QRCodeIcon } from "~/app/icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/avatar";
import { LikeButton } from "~/components/buttons/like";
import { UseButton } from "~/components/buttons/use";
import { CREATIONS_PAGE } from "~/lib/constants/routes";
import {
  getPublicUserData,
  getUserUploadUrl,
} from "~/lib/server/supabase-anon";

import type { Creation } from "~/lib/types/creations";

export async function GalleryItem(props: {
  isPriority: boolean;
  isLiked: boolean;
  creation: Creation;
}) {
  const creator = await getPublicUserData({ userId: props.creation.user_id });

  return (
    <div className="group">
      <div className="relative">
        <Link
          className="block relative rounded-lg overflow-hidden aspect-1 shadow-lg"
          href={`${CREATIONS_PAGE}/${props.creation.id}`}
        >
          <Image
            fill
            priority={props.isPriority}
            src={getUserUploadUrl({
              userId: props.creation.user_id,
              creationId: props.creation.id,
              variant: "thumbnail",
            })}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
            alt={`${props.creation.name} - QR Code Art Qriginals.com`}
            className="object-cover object-center"
          />
          {/* Image Background - Visible on Image Loading */}
          <div aria-hidden className="w-full h-full bg-gray-200" />
          {/* Image Backdrop - Visible on Hover */}
          <div
            className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 absolute w-full h-1/3 bottom-0 bg-gradient-to-b from-transparent to-gray-600/80"
            aria-hidden="true"
          />
        </Link>
        {/* Image Description and Actions - Visible on Hover */}
        <div className="hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 absolute bottom-4 items-center left-6 right-6 lg:flex justify-between">
          <span className="text-lg -mb-1 tracking-wide font-bold drop-shadow-lg text-white truncate pr-4">
            {props.creation.name}
          </span>
          <div className="flex gap-x-3 h-11 justify-end">
            <LikeButton
              isLiked={props.isLiked}
              creationId={props.creation.id}
            />
            <UseButton creationId={props.creation.id} />
          </div>
        </div>
      </div>

      {/* Creator Info with Likes/Uses */}
      <div className="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-gray-900">
        <div className="items-center flex">
          <div className="items-center cursor-pointer flex">
            <Avatar className="h-6 w-6 aspect-1 rounded-full overflow-hidden">
              <AvatarImage
                className="h-6 w-6 aspect-1"
                src={creator?.avatar_url ?? ""}
                alt={`Avatar Image of ${creator?.user_name}`}
              />
              <AvatarFallback className="h-6 w-6 uppercase text-center text-xs font-light">
                {creator?.user_name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-900 flex-grow font-medium ml-2 text-sm truncate overflow-hidden">
              {creator?.user_name}
            </span>
          </div>
        </div>
        <div className="flex flex-grow text-xs justify-end">
          <div className="items-center flex ml-2">
            <HeartIcon
              className={clsx(
                "h-4 w-4 mr-1",
                props.isLiked
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400 fill-gray-400"
              )}
            />
            <span className="text-gray-700 font-medium">
              {props.creation.like_count}
            </span>
          </div>
          <div className="items-center flex ml-2">
            <QRCodeIcon className="h-4 w-4 text-gray-600 mr-1" />
            <span className="text-gray-700 font-medium">
              {props.creation.use_count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
