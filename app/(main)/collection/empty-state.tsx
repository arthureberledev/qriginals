import Link from "next/link";

import type { ComponentProps, FunctionComponent } from "react";

export function EmptyState(props: {
  href: string;
  title: string;
  icon: FunctionComponent<ComponentProps<"svg">>;
}) {
  const Icon = props.icon;
  return (
    <Link
      href={props.href}
      className="relative aspect-1 flex flex-col justify-center items-center w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
    >
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <span className="mt-2 block text-sm font-semibold text-gray-900">
        {props.title}
      </span>
    </Link>
  );
}
