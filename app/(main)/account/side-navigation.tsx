"use client";

import { FingerPrintIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GanttChartSquare } from "~/app/icons";

import { ACCOUNT_PAGE } from "~/lib/constants/routes";

const routes = [
  { name: "Activity", href: ACCOUNT_PAGE, icon: GanttChartSquare },
  { name: "Profile", href: `${ACCOUNT_PAGE}/profile`, icon: UserCircleIcon },
  { name: "Password", href: `${ACCOUNT_PAGE}/password`, icon: FingerPrintIcon },
];

export function SideNavigation() {
  const pathname = usePathname();

  return (
    <ul
      role="list"
      className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
    >
      {routes.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            className={clsx(
              pathname.endsWith(item.href)
                ? "bg-gray-50 text-brand-600"
                : "text-gray-700 hover:text-brand-600 hover:bg-gray-50",
              "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold"
            )}
          >
            <item.icon
              className={clsx(
                pathname.endsWith(item.href)
                  ? "text-brand-600"
                  : "text-gray-400 group-hover:text-brand-600",
                "h-6 w-6 shrink-0"
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
