"use client";

import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import colors from "tailwindcss/colors";

import { Button } from "~/components/buttons/generic";
import {
  CREATE_NEW_PAGE,
  CREDITS_PAGE,
  GALLERY_PAGE,
  SUPPORT_PAGE,
} from "~/lib/constants/routes";
import { Logo } from "../logo";

const navigation = [
  { name: "Buy Credits", href: CREDITS_PAGE },
  { name: "Support", href: SUPPORT_PAGE },
];

export function Header(props: { userNavigation: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuOpen = () => setMobileMenuOpen(true);
  const handleMobileMenuClose = () => setMobileMenuOpen(false);

  return (
    <header className="z-50 absolute inset-x-0 top-0">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex flex-1">
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Button asChild variant="link" className="p-0" key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={handleMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        <Link href={GALLERY_PAGE} className="-m-1.5 p-1.5">
          <span className="sr-only">Qriginals.com</span>
          <Logo
            className="h-10 sm:h-12 w-auto hover:opacity-75 transition-opacity duration-100"
            colors={{
              text: colors.gray[900],
              dot: colors.fuchsia[600],
            }}
          />
        </Link>
        <div className="flex flex-1 justify-end items-center">
          <Button
            variant="highlight"
            asChild
            className="hidden sm:block mr-3 sm:mr-6 font-semibold"
          >
            <Link href={CREATE_NEW_PAGE}>Create</Link>
          </Button>

          {props.userNavigation}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-1">
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={handleMobileMenuClose}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <Link href={GALLERY_PAGE} className="-m-1.5 p-1.5">
              <span className="sr-only">Qriginals.com</span>
              <Logo
                className="h-10 sm:h-12 w-auto hover:opacity-75 transition-opacity duration-100"
                colors={{
                  text: colors.gray[900],
                  dot: colors.fuchsia[600],
                }}
              />
            </Link>
            <div className="flex flex-1 justify-end">
              {props.userNavigation}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              className="block w-full text-left"
              onClick={handleMobileMenuClose}
            >
              <Link
                href={CREATE_NEW_PAGE}
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
              >
                Create
              </Link>
            </button>
            {navigation.map((item) => (
              <button
                className="block w-full text-left"
                key={item.name}
                onClick={handleMobileMenuClose}
              >
                <Link
                  href={item.href}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </Link>
              </button>
            ))}
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
