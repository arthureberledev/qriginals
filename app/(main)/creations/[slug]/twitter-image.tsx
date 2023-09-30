/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/server";
import { getCreation, getUserUploadUrl } from "~/lib/server/supabase-anon";

export const runtime = "edge";

export const alt = "QR Code Art - Qriginals";
export const size = {
  width: 1200,
  height: 675,
};
export const contentType = "image/png";

export default async function Image(props: { params: { slug: string } }) {
  const creation = await getCreation(props.params.slug);

  if (!creation) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Qriginals
        </div>
      ),
      {
        ...size,
      }
    );
  }

  const imageUrl = getUserUploadUrl({
    creationId: creation.id,
    userId: creation.user_id,
    variant: "original",
  });

  return new ImageResponse(
    (
      <div tw="relative w-full h-full flex justify-center items-center">
        <img
          style={{
            display: "flex",
            flex: "1 1 0%",
            objectFit: "cover",
          }}
          src={imageUrl}
          alt={alt}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
