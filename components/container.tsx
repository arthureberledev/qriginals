import { LowerIllustration, UpperIllustration } from "~/app/illustrations";
import { cn } from "~/lib/helpers/functions";

import type { ComponentProps } from "react";

export function Container({
  withIllustration = true,
  children,
  className,
  ...props
}: ComponentProps<"div"> & { withIllustration?: boolean }) {
  return (
    <main className="isolate">
      <div className="relative pt-14">
        {withIllustration && <UpperIllustration />}
        <div className="pt-24 sm:pt-32">
          <div
            className={cn("mx-auto max-w-7xl px-6 lg:px-8", className)}
            {...props}
          >
            {children}
          </div>
        </div>
        <div className="pt-24 sm:pt-32">
          {withIllustration && <LowerIllustration />}
        </div>
      </div>
    </main>
  );
}
