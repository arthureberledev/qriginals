"use client";

import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { LoadingSpinnerIcon, SendIcon } from "~/app/icons";
import { Button } from "~/components/buttons/generic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/dialog";
import { Input, Label } from "~/components/form-elements";
import { handleError, handleSuccess, raise } from "~/lib/client/utils";

type FormValues = { name: string };

const FORM_ID = "prediction-publish-form" as const;

export function PredictionPublishDialog(props: {
  creationId: string;
  imageUrl: string;
  parameters: {
    prompt: string;
    negativePrompt: string;
    guidanceScale: number;
    strength: number;
    controlnetConditioningScale: number;
    seed: number;
  };
  isPublished: boolean;
  onIsPublishedChange: (isPublished: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<FormValues>();
  const router = useRouter();

  const handlePublish = async (formValues: FormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: props.imageUrl,
          id: props.creationId,
          name: formValues.name,
          seed: props.parameters.seed,
          prompt: props.parameters.prompt,
          negativePrompt: props.parameters.negativePrompt,
          guidanceScale: props.parameters.guidanceScale,
          strength: props.parameters.strength,
          controlnetConditioningScale:
            props.parameters.controlnetConditioningScale,
        }),
      });
      if (response.status === 401) {
        raise("Sorry. You need to be signed in to publish.", {
          exposable: true,
        });
      }
      if (response.status === 409) {
        raise("Sorry. This Creation was already published.", {
          exposable: true,
        });
      }
      if (response.status === 429) {
        const error = await response.text();
        raise(error, { exposable: true });
      }
      if (!response.ok) raise("Response from '/api/v1/publish' was not ok.");

      handleSuccess("Your creation has been published.");
      setIsOpen(false);
      props.onIsPublishedChange(true);
      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="flex items-center"
          disabled={props.isPublished}
        >
          <div className="mr-1.5 h-4 w-4">
            {props.isPublished ? (
              <CheckBadgeIcon strokeWidth="2" className="w-full h-full" />
            ) : (
              <SendIcon className="w-full h-full" />
            )}
          </div>
          <span>{props.isPublished ? "Published" : "Publish"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="grid-cols-4 sm:max-w-lg overflow-y-scroll lg:overflow-y-auto max-svh-screen">
        <DialogHeader className="col-span-full">
          <DialogTitle>Publish your Creation</DialogTitle>
          <DialogDescription>
            Give your creation a name and publish it to the public gallery where
            it can be discovered by others.
          </DialogDescription>
        </DialogHeader>
        <form
          id={FORM_ID}
          onSubmit={form.handleSubmit(handlePublish)}
          className="py-4 col-span-full"
        >
          <Label className="text-sm font-medium leading-6 text-gray-900">
            Name
          </Label>
          <Input
            className="mt-1"
            id="name"
            placeholder="Blue Horizon..."
            {...form.register("name", {
              required: {
                value: true,
                message: "Please enter a name for your creation.",
              },
              minLength: {
                value: 3,
                message: "Please enter a name that is at least 3 characters.",
              },
              maxLength: {
                value: 50,
                message: "Please enter a name that is at most 50 characters.",
              },
            })}
          />
        </form>
        <dl className="col-span-full divide-y divide-gray-100">
          <div className="pb-6">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Design Instruction
            </dt>
            <dd className="mt-2 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {props.parameters.prompt}
            </dd>
          </div>
          <div className="py-6">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Avoidance Instruction
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {props.parameters.negativePrompt}
            </dd>
          </div>
          <div className="grid grid-cols-2 divide-y divide-gray-100">
            <div className="py-6">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Influence Level
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {props.parameters.guidanceScale}
              </dd>
            </div>
            <div className="py-6">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Transformation Level
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {props.parameters.strength}
              </dd>
            </div>
            <div className="py-6">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Fine-Tuning Scale
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {props.parameters.controlnetConditioningScale}
              </dd>
            </div>
            <div className="py-6">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Seed
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {props.parameters.seed}
              </dd>
            </div>
          </div>
        </dl>
        <DialogFooter className="col-span-full">
          <Button
            disabled={isLoading}
            form={FORM_ID}
            variant="default"
            className="flex items-center"
          >
            {isLoading ? (
              <>
                <LoadingSpinnerIcon className="mr-1.5 h-4 w-4" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <SendIcon className="mr-1.5 h-4 w-4" />
                <span>Publish</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
