"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { BoxesIcon, HeartIcon, QRCodeIcon } from "~/app/icons";
import {
  COLLECTIONS_PAGE,
  LIKES_PAGE,
  USES_PAGE,
} from "~/lib/constants/routes";

import type { ChangeEvent } from "react";

const tabs = [
  { name: "Creations", href: COLLECTIONS_PAGE, icon: BoxesIcon },
  { name: "Likes", href: LIKES_PAGE, icon: HeartIcon },
  { name: "Uses", href: USES_PAGE, icon: QRCodeIcon },
];

export function Tabs() {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const tab = tabs.find((tab) => tab.name === event.target.value);
    if (tab) router.push(tab.href);
  };

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 focus:border-brand-500 focus:ring-brand-500"
          defaultValue={tabs.find((tab) => pathname.endsWith(tab.href))?.name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-12" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={clsx(
                  pathname.endsWith(tab.href)
                    ? "border-brand-500 text-brand-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center select-none border-b-2 py-4 px-1 text-sm font-medium"
                )}
                aria-current={pathname.endsWith(tab.href) ? "page" : undefined}
              >
                <tab.icon
                  className={clsx(
                    pathname.endsWith(tab.href)
                      ? "text-brand-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "-ml-0.5 mr-2 h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                <span>{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
