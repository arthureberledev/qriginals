"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import Image from "next/image";

import { DownloadButton } from "~/components/buttons/download";
import { QRCodePlaceholder } from "~/components/qr-code-placeholder";
import { useElapsedTime } from "~/hooks/use-elapsed-time";
import { cn } from "~/lib/helpers/functions";
import { usePredictionContext } from "./context";
import { PredictionPublishDialog } from "./prediction-publish-dialog";

function NotificationWarning(props: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-yellow-100 bg-yellow-50 p-4",
        props.className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-yellow-500"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">{props.title}</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>{props.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PredictionOutput(props: {
  creationId: string;
  templatePreviewImage: string | null;
}) {
  const {
    prediction,
    loadingState,
    isUsingTemplate,
    isPublished,
    setIsPublished,
  } = usePredictionContext();
  const isImageExisting = prediction && prediction.output?.length > 0;

  const isIdle = loadingState === "idle";
  const isInitializing = loadingState === "initializing";
  const isCreatingPrompt = loadingState === "creating-prompt";
  const isStartingServer = loadingState === "starting-server";
  const isColdBooting = loadingState === "cold-booting";
  const isCreatingQRCode = loadingState === "creating-qrcode";
  const isFinished =
    loadingState === "canceled" ||
    loadingState === "succeeded" ||
    loadingState === "failed";

  const elapsedTime = useElapsedTime({ isIdle, isFinished });

  return (
    <div id="output" className="flex flex-col w-full basis-1/2">
      <div>
        <h2 className="text-xl font-semibold leading-7 text-gray-900">
          Output
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Your AI QR Code Art, created based on your input parameters, will be
          displayed here.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-y-12">
        {/* QR Codes */}
        {isImageExisting ? (
          (prediction.output as string[]).map((url, index) => (
            <div key={url}>
              <div className="relative aspect-1 rounded-lg shadow-lg overflow-hidden bg-white">
                <Image
                  fill
                  priority={index === 0}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 75vw, (max-width: 1300px) 50vw, 40vw"
                  src={url}
                  alt="QR Code AI Art Generator"
                />
              </div>

              <div className="mt-6 flex flex-row justify-end">
                <div
                  className={clsx(
                    "flex sm:flex-row flex-col-reverse w-full sm:w-fit gap-y-2 sm:gap-x-3"
                  )}
                >
                  <DownloadButton url={prediction.output[index]} />
                  {!isUsingTemplate && (
                    <PredictionPublishDialog
                      creationId={props.creationId}
                      imageUrl={prediction.output[index]}
                      parameters={{
                        strength: prediction.input.strength,
                        guidanceScale: prediction.input.guidance_scale,
                        negativePrompt: prediction.input.negative_prompt,
                        prompt: prediction.input.prompt,
                        seed: prediction.input.seed,
                        controlnetConditioningScale:
                          prediction.input.controlnet_conditioning_scale,
                      }}
                      isPublished={isPublished}
                      onIsPublishedChange={setIsPublished}
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="relative p-10 aspect-1 rounded-lg shadow-lg overflow-hidden bg-white">
            <div
              className={clsx(
                "absolute top-0 left-0 h-full w-full p-6 sm:p-10 duration-500 transition-opacity",
                isIdle ? "opacity-100" : "opacity-5"
              )}
            >
              {props.templatePreviewImage ? (
                <Image
                  priority
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 75vw, (max-width: 1300px) 50vw, 40vw"
                  src={props.templatePreviewImage}
                  alt="QR Code AI Art Generator"
                  fill
                />
              ) : (
                <QRCodePlaceholder />
              )}
            </div>
            <div
              className={clsx(
                "absolute left-10 right-10 lg:left-20 lg:right-20 top-1/2 -translate-y-1/2 duration-500 transition-opacity",
                isIdle ? "opacity-0" : "opacity-100"
              )}
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium truncate text-gray-900">
                  {isInitializing && "Initializing..."}
                  {isCreatingPrompt && "Creating Prompt..."}
                  {isStartingServer && "Starting Server..."}
                  {isColdBooting && "Starting Server..."}
                  {isCreatingQRCode && "Creating QR Code..."}
                  {isFinished && "Finishing..."}
                </span>
                <span className="text-gray-600 font-medium text-sm ml-auto">
                  {elapsedTime}
                </span>
              </div>
              <div className="h-1 w-full rounded-sm bg-gray-300">
                <div
                  className="h-1 rounded-sm bg-gray-600 animate-pulse transition-all duration-1000 ease-in-out"
                  style={{
                    width: isIdle
                      ? "1%"
                      : isInitializing
                      ? "1%"
                      : isCreatingPrompt
                      ? "10%"
                      : isStartingServer
                      ? "20%"
                      : isColdBooting
                      ? "33%"
                      : isCreatingQRCode
                      ? "75%"
                      : isFinished
                      ? "100%"
                      : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {isColdBooting && (
          <NotificationWarning
            title="Hold On Just a Bit"
            description="To be able to maintain this website, our system sleeps during quiet times. It could take up to 3-5 minutes to wake up and start on your QR Code. We're really sorry for this wait and are working on a better solution."
          />
        )}
      </div>
    </div>
  );
}
