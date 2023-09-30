import Image from "next/image";
import Link from "next/link";

import { CREATIONS_PAGE } from "~/lib/constants/routes";
import { getUserUploadUrl } from "~/lib/server/supabase-anon";

export function CreationThumbnail(props: {
  name: string;
  creationId: string;
  creatorId: string;
  buttons: JSX.Element[];
}) {
  return (
    <div className="group">
      <div className="relative bg-gray-100">
        <Link
          className="block aspect-1 rounded-lg overflow-hidden shadow-lg relative"
          href={`${CREATIONS_PAGE}/${props.creationId}`}
        >
          <Image
            fill
            src={getUserUploadUrl({
              userId: props.creatorId,
              creationId: props.creationId,
              variant: "thumbnail",
            })}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
            alt={`${props.name} - QR Code Art Qriginals.com`}
            className="object-cover object-center"
          />
          <div aria-hidden className="w-full h-full bg-gray-200" />
          {/* Image Backdrop - Visible on Hover */}
          <div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 absolute w-full h-full bottom-0 bg-gradient-to-b from-transparent via-transparent via-75% to-gray-600/80"
            aria-hidden="true"
          />
        </Link>
        {/* Image Description and Actions - Visible on Hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 absolute bottom-4 items-center left-6 right-6 flex justify-between">
          <span className="text-xl -mb-1 font-medium drop-shadow-lg text-white truncate pr-4">
            {props.name}
          </span>
          <div className="flex gap-x-3">
            {props.buttons.map((button) => button)}
          </div>
        </div>
      </div>
    </div>
  );
}
