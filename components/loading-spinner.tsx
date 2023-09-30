import { memo, type ComponentProps } from "react";
import { cn } from "~/lib/helpers/functions";

// looks bad on like button

function LoadingSpinnerPrimitive({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={cn("loading loading-spinner w-5 h-5 text-gray-100", className)}
      {...props}
    />
  );
}

export const LoadingSpinner = memo(LoadingSpinnerPrimitive);
