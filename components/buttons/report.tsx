"use client";

import { useState, useTransition } from "react";

import { AlertTriangleIcon, LoadingSpinnerIcon, SendIcon } from "~/app/icons";
import { handleError, handleSuccess, raise } from "~/lib/client/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Button } from "./generic";

export function ReportButton(props: { creationId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [isReported, setIsReported] = useState(false);

  const handleReport = async () => {
    try {
      const response = await fetch("/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creationId: props.creationId }),
      });
      if (response.status === 401)
        raise("You need to be logged in to report this.", { exposable: true });
      if (response.status === 429) {
        const error = await response.text();
        raise(error, { exposable: true });
      }
      if (!response.ok) raise("Response from '/api/v1/reports' was not ok.");

      startTransition(() => {
        setIsReported(true);
        setIsOpen(false);
        handleSuccess(
          "Thank you! Your Report was submitted and will be reviewed by our team.",
          { duration: 10000 }
        );
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Report"
          data-balloon-pos="down"
          type="button"
          disabled={isPending || isReported}
          variant="ghost"
          className="rounded-lg w-fit  h-full aspect-1 bg-white p-2 sm:p-3 border border-gray-200 hover:bg-gray-200 text-gray-600 hover:text-gray-600"
        >
          {isPending ? (
            <LoadingSpinnerIcon className="w-5 h-5 stroke-2" />
          ) : (
            <AlertTriangleIcon className="w-5 h-5 stroke-2" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>Submit Report</DialogTitle>
          <DialogDescription>
            You are about to report this creation as inappropriate. Are you sure
            you want to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={isPending}
            variant="default"
            className="flex items-center"
            type="button"
            onClick={handleReport}
          >
            {isPending ? (
              <>
                <LoadingSpinnerIcon className="mr-1.5 h-4 w-4" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <SendIcon className="mr-1.5 h-4 w-4" />
                <span>Submit</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
