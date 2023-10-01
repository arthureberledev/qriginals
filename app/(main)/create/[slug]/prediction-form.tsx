"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { LoadingSpinnerIcon, LogInIcon, QRCodeIcon } from "~/app/icons";
import { Button } from "~/components/buttons/generic";
import { HelperText, Input, Label, Textarea } from "~/components/form-elements";
import { Slider, SliderValue } from "~/components/slider";
import { handleError, raise } from "~/lib/client/utils";
import { SIGN_IN_PAGE } from "~/lib/constants/routes";
import { isArray, sleep } from "~/lib/helpers/functions";
import { usePredictionContext } from "./context";

import type { CreationParameters } from "~/lib/types/creations";
import type { Prediction, PredictionParameters } from "~/lib/types/predictions";

const SLIDER_SETTINGS = {
  guidanceScale: {
    min: 7.5,
    max: 30,
    step: 0.01,
  },
  strength: {
    min: 0.01,
    max: 1,
    step: 0.01,
  },
  controlnetConditioningScale: {
    min: 1,
    max: 2,
    step: 0.01,
  },
  seed: {
    min: 1,
    max: 9999999999,
    step: 1,
  },
} as const;

type FormValues = PredictionParameters & { useGptPrompt: boolean };

export function PredictionForm(props: {
  isAuthenticated: boolean;
  template: { id: string; parameters: CreationParameters } | null;
}) {
  const defaultValues: FormValues = props.template?.parameters
    ? {
        ...props.template.parameters,
        useGptPrompt: false,
        qrCodeContent: "https://www.qriginals.com",
      }
    : {
        prompt: "",
        useGptPrompt: false,
        negativePrompt: "ugly, disfigured, low quality, blurry, nsfw",
        guidanceScale: 20,
        strength: 0.9,
        controlnetConditioningScale: 1.2,
        seed: 22304,
        qrCodeContent: "https://www.qriginals.com",
      };

  const router = useRouter();
  const form = useForm<FormValues>({ defaultValues });
  const useGptPrompt = form.watch("useGptPrompt");
  const {
    setPrediction,
    loadingState,
    setLoadingState,
    setIsUsingTemplate,
    setIsPublished,
  } = usePredictionContext();

  const handleSubmit = async ({
    controlnetConditioningScale,
    guidanceScale,
    negativePrompt,
    prompt,
    qrCodeContent,
    seed,
    strength,
  }: FormValues) => {
    if (loadingState !== "idle") return;

    router.push("#output");

    setPrediction(null);
    setIsPublished(false);
    setLoadingState("initializing");

    // Check if the user is using the template parameters
    // If so, publish button will be disabled
    if (
      props.template &&
      props.template.parameters.prompt === prompt &&
      props.template.parameters.negativePrompt === negativePrompt &&
      props.template.parameters.guidanceScale === guidanceScale &&
      props.template.parameters.strength === strength &&
      props.template.parameters.controlnetConditioningScale ===
        controlnetConditioningScale &&
      props.template.parameters.seed === seed
    ) {
      setIsUsingTemplate(true);
    }

    await sleep(500);

    const predictionParameters: PredictionParameters = {
      qrCodeContent,
      negativePrompt,
      prompt: useGptPrompt ? "" : prompt,
      guidanceScale: isArray(guidanceScale) ? guidanceScale[0] : guidanceScale,
      strength: isArray(strength) ? strength[0] : strength,
      seed: isArray(seed) ? seed[0] : seed,
      controlnetConditioningScale: isArray(controlnetConditioningScale)
        ? controlnetConditioningScale[0]
        : controlnetConditioningScale,
    };

    let numOfPolls = 0;
    try {
      setLoadingState("starting-server");
      const response = await fetch("/api/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "same-origin",
        },
        body: JSON.stringify(predictionParameters),
      });
      if (response.status === 400)
        raise("Sorry. The given parameters are invalid.", { exposable: true });
      if (response.status === 401)
        raise("Sorry. You need to be signed for this.", { exposable: true });
      if (response.status === 402)
        raise("Sorry. You don't have enough credits left.", {
          exposable: true,
        });
      if (!response.ok)
        raise("Response from '/api/v1/predictions' was not ok.");

      let prediction = (await response.json()) as Prediction;
      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed" &&
        prediction.status !== "canceled"
      ) {
        const status = prediction.status;
        const isColdBooting = status === "starting" && numOfPolls > 8;
        const isProcessing = status === "processing";
        if (isColdBooting) setLoadingState("cold-booting");
        if (isProcessing) setLoadingState("creating-qrcode");
        await sleep(isColdBooting ? 10000 : 3000); // The increased timeout is to prevent execution limits of Edge Functions
        const response = await fetch(`/api/v1/predictions?id=${prediction.id}`);
        if (!response.ok)
          raise(
            `Response from '/api/v1/predictions?id=${prediction.id}' was not ok.`
          );
        prediction = (await response.json()) as Prediction;
        setPrediction(prediction);
        numOfPolls++;
      }
      setLoadingState(prediction.status);
      router.refresh();
    } catch (error) {
      handleError(
        error,
        "An error occurred while creating the QR Code. Please try again later."
      );
    } finally {
      numOfPolls = 0;
      setLoadingState("idle");
    }

    if (props.template) {
      try {
        const response = await fetch("/api/v1/uses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            credentials: "same-origin",
          },
          body: JSON.stringify({
            creationId: props.template.id,
          }),
        });
        if (response.status === 429) {
          const error = await response.text();
          raise(error, { exposable: true });
        }
        if (!response.ok) raise("Response from '/api/v1/uses' was not ok.");
        router.refresh();
      } catch (error) {
        handleError(error, ""); // If this fails, it should not be visible to the user
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div>
        <div>
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            Input
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Use these parameters to guide and customize your AI QR Code Art.
            Each parameter offers a unique way to influence the AI&apos;s
            Artistic process.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* QR Code Content */}
          <div className="col-span-full">
            <Label htmlFor="qrCodeContent">Content</Label>
            <Input
              placeholder="https://www.qriginals.com"
              className="mt-2"
              type="text"
              id="qrCodeContent"
              {...form.register("qrCodeContent", {
                required: {
                  value: true,
                  message: "Please enter the content of your QR Code.",
                },
                minLength: {
                  value: 1,
                  message: "Please enter at least 1 characters.",
                },
                maxLength: {
                  value: 1000,
                  message: "Please enter at most 1000 characters.",
                },
              })}
            />
            <HelperText className="mt-3">
              The website/content your QR Code will point to.
            </HelperText>
          </div>

          {/* Prompt */}
          <div className="col-span-full">
            <Label htmlFor="prompt">Design Instruction</Label>
            <Textarea
              rows={3}
              id="prompt"
              className="mt-2"
              disabled={useGptPrompt}
              placeholder="Create a 3D dark and futuristic city street with vibrant blue, purple, and turquoise colors."
              {...form.register("prompt", {
                required: {
                  value: !useGptPrompt,
                  message:
                    "Please enter a design instruction for your QR Code.",
                },
                minLength: {
                  value: 10,
                  message: "Please enter at least 10 characters.",
                },
                maxLength: {
                  value: 1000,
                  message: "Please enter at most 1000 characters.",
                },
              })}
            />
            <HelperText className="mt-3">
              The main idea or theme to shape your QR Code Art.
            </HelperText>

            <div className="relative flex items-stArt mt-2">
              <div className="flex h-6 items-center">
                <input
                  id="useGptPrompt"
                  aria-describedby="useGptPrompt"
                  type="checkbox"
                  {...form.register("useGptPrompt")}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-600"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label
                  htmlFor="use-gpt-prompt"
                  className="font-medium text-gray-900"
                >
                  Alternatively use ChatGPT
                </label>{" "}
                <span className="text-gray-500">
                  to create a prompt for you.
                </span>
              </div>
            </div>
          </div>

          {/* Negative Prompt */}
          <div className="col-span-full">
            <Label htmlFor="negativePrompt">Avoidance Instruction</Label>
            <Textarea
              rows={3}
              id="negativePrompt"
              className="mt-2"
              placeholder="ugly, disfigured, low quality, blurry, nsfw"
              {...form.register("negativePrompt", {
                required: {
                  value: true,
                  message: "Please enter an avoidance instruction.",
                },
                minLength: {
                  value: 1,
                  message: "Please enter at least 1 characters.",
                },
                maxLength: {
                  value: 1000,
                  message: "Please enter at most 1000 characters.",
                },
              })}
            />
            <HelperText className="mt-3">
              Things you don&apos;t want to see in your QR Code Art.
            </HelperText>
          </div>

          {/* Guidance Scale */}
          <div className="col-span-full">
            <div className="flex justify-between">
              <Label htmlFor="guidanceScale">Influence Level</Label>
              <SliderValue
                value={form.watch("guidanceScale")}
                onChange={(e) =>
                  form.setValue("guidanceScale", +e.target.value)
                }
                {...SLIDER_SETTINGS.guidanceScale}
              />
            </div>
            <Controller
              control={form.control}
              name="guidanceScale"
              rules={{
                required: {
                  value: true,
                  message: "Please choose a value for the influence level.",
                },
                min: {
                  value: 7.5,
                  message: "The minimum value for this slide is 9.",
                },
                max: {
                  value: 30,
                  message: "The maximum value for this slide is 30.",
                },
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Slider
                  id="guidanceScale"
                  className="mt-2"
                  ref={ref}
                  value={[value]}
                  onBlur={onBlur}
                  onValueChange={onChange}
                  {...SLIDER_SETTINGS.guidanceScale}
                />
              )}
            />
            <HelperText className="mt-3">
              How much influence the Design and Avoidance Instructions should
              have on the QR code. Low values tend to look more like artworks
              while high values tend to be more 3D like.
            </HelperText>
          </div>

          {/* Strength */}
          <div className="col-span-full">
            <div className="flex justify-between">
              <Label htmlFor="strength">Transformation Level</Label>
              <SliderValue
                value={form.watch("strength")}
                onChange={(e) => form.setValue("strength", +e.target.value)}
                {...SLIDER_SETTINGS.strength}
              />
            </div>
            <Controller
              control={form.control}
              name="strength"
              rules={{
                required: {
                  value: true,
                  message:
                    "Please choose a value for the transformation level.",
                },
                min: {
                  value: 0.01,
                  message: "The minimum value for this slide is 0.01.",
                },
                max: {
                  value: 1,
                  message: "The maximum value for this slide is 1.",
                },
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Slider
                  id="strength"
                  className="mt-2"
                  ref={ref}
                  value={[value]}
                  onBlur={onBlur}
                  onValueChange={onChange}
                  {...SLIDER_SETTINGS.strength}
                />
              )}
            />
            <HelperText className="mt-3">
              How much of your Design Instruction will change the original QR
              Code Art. Ranges from not at all (0) to completely (1).
            </HelperText>
          </div>

          {/* Controlnet Conditioning Scale */}
          <div className="col-span-full">
            <div className="flex justify-between">
              <Label htmlFor="controlnetConditioningScale">
                Fine-Tuning Scale
              </Label>
              <SliderValue
                value={form.watch("controlnetConditioningScale")}
                onChange={(e) =>
                  form.setValue("controlnetConditioningScale", +e.target.value)
                }
                {...SLIDER_SETTINGS.controlnetConditioningScale}
              />
            </div>
            <Controller
              control={form.control}
              name="controlnetConditioningScale"
              rules={{
                required: {
                  value: true,
                  message: "Please choose a value for the fine-tuning scale.",
                },
                min: {
                  value: 1,
                  message: "The minimum value for this slide is 1.",
                },
                max: {
                  value: 2,
                  message: "The maximum value for this slide is 2.",
                },
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Slider
                  id="controlnetConditioningScale"
                  className="mt-2"
                  ref={ref}
                  value={[value]}
                  onBlur={onBlur}
                  onValueChange={onChange}
                  {...SLIDER_SETTINGS.controlnetConditioningScale}
                />
              )}
            />
            <HelperText className="mt-3">
              This adjusts the fine details of your QR Code Art. High values:
              The generated QR code will be more readable. Low values: The
              generated QR code will be more creative.
            </HelperText>
          </div>

          {/* Seed */}
          <div className="col-span-full">
            <div className="flex justify-between">
              <Label htmlFor="seed">Randomness Seed</Label>
              <SliderValue
                value={form.watch("seed")}
                onChange={(e) => form.setValue("seed", +e.target.value)}
                {...SLIDER_SETTINGS.seed}
              />
            </div>
            <Controller
              control={form.control}
              name="seed"
              rules={{
                required: {
                  value: true,
                  message: "Please choose a value for the fine-tuning scale.",
                },
                min: {
                  value: 1,
                  message: "The minimum value for this slide is 1.",
                },
                max: {
                  value: 9999999999,
                  message: "The maximum value for this slide is 9999999999.",
                },
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Slider
                  id="seed"
                  className="mt-2"
                  ref={ref}
                  value={[value]}
                  onBlur={onBlur}
                  onValueChange={onChange}
                  {...SLIDER_SETTINGS.seed}
                />
              )}
            />
            <HelperText className="mt-3">
              This is a sort of &apos;starting point&apos; for the QR Code Art
              generation process. Different seeds will create different outputs.
            </HelperText>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end">
        {props.isAuthenticated ? (
          <div className="group w-full">
            <Button
              disabled={loadingState !== "idle"}
              size="lg"
              type="submit"
              className="w-full"
            >
              {loadingState !== "idle" ? (
                <>
                  <LoadingSpinnerIcon className="mr-2 w-4 h-4 sm:h-5 sm:w-5 text-white" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <QRCodeIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Create</span>
                </>
              )}
            </Button>
            {props.template && (
              <span
                className={clsx(
                  "mt-3 block w-full text-center text-sm text-gray-600"
                )}
              >
                Due to the nature of the AI, the created QR codes may look
                different from the selected ones.
              </span>
            )}
          </div>
        ) : (
          <Button asChild size="lg" className="w-full">
            <Link href={SIGN_IN_PAGE}>
              <LogInIcon className="w-4 h-4 mr-2 stroke-2" />
              <span>Sign in</span>
            </Link>
          </Button>
        )}
      </div>
    </form>
  );
}
