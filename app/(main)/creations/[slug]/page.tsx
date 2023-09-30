import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { LowerIllustration, UpperIllustration } from "~/app/illustrations";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/avatar";
import { LikeButton } from "~/components/buttons/like";
import { ReportButton } from "~/components/buttons/report";
import { ShareButton } from "~/components/buttons/share";
import { UseButton } from "~/components/buttons/use";
import { getURL } from "~/lib/helpers/functions";
import { creationParametersSchema } from "~/lib/schemas/creations";
import { getUserLikes } from "~/lib/server/supabase";
import {
  getCreation,
  getPublicUserData,
  getUserUploadUrl,
} from "~/lib/server/supabase-anon";

export async function generateMetadata(
  props: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = props.params.slug;
  if (!slug) return notFound();
  const creation = await getCreation(slug);
  if (!creation) return notFound();
  const image = getUserUploadUrl({
    creationId: creation.id,
    userId: creation.user_id,
    variant: "original",
  });
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Discover User Art: Detail View of '${creation.name}' Creation | Qriginals.com `,
    description: `Explore '${creation.name}', a user's QR Code creation on Qriginals.com. Learn about the unique parameters used to generate this work of art.`,
    openGraph: {
      images: [image, ...previousImages],
    },
  };
}

export default async function Page(props: { params: { slug: string } }) {
  const slug = props.params.slug;

  const [userLikes, creation] = await Promise.all([
    getUserLikes(),
    getCreation(slug),
  ]);
  if (!creation) notFound();

  const creator = await getPublicUserData({ userId: creation.user_id });
  const creationParameters = creationParametersSchema.parse(
    creation.parameters
  );
  const creationUrl = getUserUploadUrl({
    userId: creation.user_id,
    creationId: creation.id,
    variant: "original",
  });

  return (
    <main className="isolate">
      <div className="relative sm:pt-14">
        <UpperIllustration />
        <div className="pt-24 sm:pt-32">
          <div className="max-w-2xl lg:max-w-7xl mx-auto flex flex-col lg:flex-row lg:gap-x-12 px-6 lg:px-8">
            {/* Qr Code */}
            <div className="flex flex-col w-full basis-1/2">
              <div className="relative aspect-1 rounded-lg shadow-lg overflow-hidden">
                <Image
                  fill
                  priority
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 75vw, 40vw"
                  src={creationUrl}
                  alt={`${creation.name} - QR Code Art Qriginals.com`}
                  className="object-cover object-center"
                />
                <div aria-hidden className=" w-full h-full bg-gray-100" />
              </div>
              {/* Creator Info */}
              <div className="px-2 mt-6 flex flex-row justify-between">
                <div className="flex items-center">
                  <Avatar className="w-8 aspect-1 h-8">
                    <AvatarImage
                      src={creator?.avatar_url ?? ""}
                      alt={`Avatar Image of ${creator?.user_name}`}
                    />
                    <AvatarFallback className="w-8 h-8 text-base uppercase">
                      {creator?.user_name?.[0] ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-3 text-base font-medium text-gray-900">
                    {creator?.user_name}
                  </span>
                </div>
                <div className="flex justify-end gap-x-1 sm:gap-x-3 sm:h-12 h-10">
                  <ReportButton creationId={creation.id} />
                  <ShareButton
                    url={getURL() + "creations/" + slug}
                    quote={`Discover User Art: Detail View of '${creation.name}' Creation | Qriginals.com`}
                  />
                  <LikeButton
                    isLiked={userLikes.includes(creation.id)}
                    creationId={creation.id}
                  />
                  <UseButton creationId={creation.id} />
                </div>
              </div>
            </div>
            {/* Model Info */}
            <div className="basis-1/2 px-2 mt-16 lg:mt-2">
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Model Parameters
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Those are the details of the parameters the model used to
                  generate this QR Code.
                </p>
              </div>
              <div className="mt-6">
                <dl className="divide-y divide-gray-100">
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Name
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {creation.name}
                    </dd>
                  </div>
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Design Instruction
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {creationParameters.prompt}
                    </dd>
                  </div>
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Avoidance Instruction
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {creationParameters.negativePrompt}
                    </dd>
                  </div>
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Influence Level
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {creationParameters.guidanceScale}
                    </dd>
                  </div>
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Transformation Level
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {creationParameters.strength}
                    </dd>
                  </div>
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Fine-Tuning Scale
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {creationParameters.controlnetConditioningScale}
                    </dd>
                  </div>
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Randomness Seed
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {creationParameters.seed}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <LowerIllustration />
      </div>
    </main>
  );
}
