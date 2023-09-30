"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { HeartIcon, LoadingSpinnerIcon } from "~/app/icons";
import { handleError, raise } from "~/lib/client/utils";
import { Button, type ButtonProps } from "./generic";

const ENDPOINT = "/api/v1/likes";

export function LikeButton(props: { isLiked: boolean; creationId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLike = async () => {
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creationId: props.creationId }),
      });
      if (response.status === 401)
        raise("Sorry. You need to be logged in to like this.", {
          exposable: true,
        });
      if (response.status === 429) {
        const error = await response.text();
        raise(error, { exposable: true });
      }
      if (!response.ok) raise(`Response from '${ENDPOINT}' was not ok.`);
      startTransition(() => router.refresh());
    } catch (error) {
      handleError(error);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await fetch(
        `/api/v1/likes?creation-id=${props.creationId}`,
        { method: "DELETE" }
      );
      if (response.status === 401)
        raise("Sorry. You need to be logged in to unlike this.", {
          exposable: true,
        });
      if (response.status === 429) {
        const error = await response.text();
        raise(error, { exposable: true });
      }
      if (!response.ok)
        raise(
          `Response from '/api/v1/likes?creation-id=${props.creationId}' was not ok.`
        );
      startTransition(() => router.refresh());
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Button
      aria-label="Like"
      data-balloon-pos="down"
      onClick={props.isLiked ? handleUnlike : handleLike}
      variant="ghost"
      className="rounded-lg w-fit h-full aspect-1 bg-white p-2 sm:p-3 border border-gray-200 hover:bg-gray-200 text-gray-600 hover:text-gray-600"
    >
      {isPending ? (
        <LoadingSpinnerIcon className="w-5 h-5 stroke-2" />
      ) : props.isLiked ? (
        <HeartIcon className="w-5 h-5 stroke-2 stroke-red-500 fill-red-500" />
      ) : (
        <HeartIcon className="w-5 h-5 stroke-2" />
      )}
    </Button>
  );
}
