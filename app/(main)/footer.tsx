import Link from "next/link";
import colors from "tailwindcss/colors";

import { Button } from "~/components/buttons/generic";
import {
  ACCOUNT_PAGE,
  COLLECTIONS_PAGE,
  COOKIES_PAGE,
  CREATE_NEW_PAGE,
  CREDITS_PAGE,
  GALLERY_PAGE,
  LEGAL_NOTICE_PAGE,
  PRIVACY_PAGE,
  REFUND_PAGE,
  SUPPORT_PAGE,
  TERMS_PAGE,
} from "~/lib/constants/routes";
import { Logo } from "../logo";

import type { JSX, SVGProps } from "react";

const navigation = {
  features: [
    { name: "Gallery", href: GALLERY_PAGE },
    { name: "Create", href: CREATE_NEW_PAGE },
  ],
  support: [
    { name: "Credits", href: CREDITS_PAGE },
    { name: "Community", href: SUPPORT_PAGE },
  ],
  account: [
    { name: "Settings", href: ACCOUNT_PAGE },
    { name: "Collection", href: COLLECTIONS_PAGE },
  ],
  legal: [
    { name: "Legal Notice", href: LEGAL_NOTICE_PAGE },
    { name: "Privacy Notice", href: PRIVACY_PAGE },
    { name: "Refund Policy", href: REFUND_PAGE },
    { name: "Terms of Service", href: TERMS_PAGE },
    { name: "Cookies", href: COOKIES_PAGE },
  ],
  social: [
    {
      name: "Discord",
      href: "https://discord.gg/fJdqQSyT",
      icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid"
          viewBox="0 -28.5 256 256"
          {...props}
        >
          <path
            fill="currentColor"
            d="M216.86 16.6A208.5 208.5 0 0 0 164.04 0a154.86 154.86 0 0 0-6.76 14.05 193.92 193.92 0 0 0-58.54 0C96.91 9.65 94.2 4.1 91.9 0a207.8 207.8 0 0 0-52.86 16.64C5.62 67.14-3.44 116.4 1.1 164.96c22.17 16.55 43.65 26.6 64.77 33.19a161.1 161.1 0 0 0 13.88-22.85 136.41 136.41 0 0 1-21.85-10.63c1.83-1.36 3.62-2.78 5.35-4.24 42.13 19.7 87.9 19.7 129.51 0 1.76 1.46 3.55 2.88 5.36 4.24a136.07 136.07 0 0 1-21.89 10.65c4.01 8.02 8.64 15.67 13.88 22.85 21.14-6.58 42.64-16.64 64.81-33.21 5.32-56.3-9.08-105.1-38.05-148.36ZM85.47 135.1c-12.64 0-23.01-11.81-23.01-26.19 0-14.37 10.15-26.2 23.01-26.2 12.87 0 23.24 11.8 23.02 26.2.02 14.38-10.15 26.18-23.02 26.18Zm85.06 0c-12.65 0-23.02-11.81-23.02-26.19 0-14.37 10.15-26.2 23.02-26.2 12.86 0 23.23 11.8 23.01 26.2 0 14.38-10.15 26.18-23.01 26.18Z"
          />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://twitter.com/qriginals_com",
      icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "https://github.com/arthureberledev",
      icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Logo
              className="h-10 sm:h-12 w-auto"
              colors={{
                text: colors.gray[900],
                dot: colors.fuchsia[600],
              }}
            />

            <p className="text-sm max-w-xs leading-6 text-gray-600">
              Experience QR Codes like never before on Qriginals.com.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Features
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.features.map((item) => (
                    <li key={item.name}>
                      <Button
                        variant="link"
                        className="p-0 text-sm leading-6 text-gray-600 hover:text-gray-900"
                        asChild
                      >
                        <Link href={item.href}>{item.name}</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Support
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Button
                        variant="link"
                        className="p-0 text-sm leading-6 text-gray-600 hover:text-gray-900"
                        asChild
                      >
                        <Link href={item.href}>{item.name}</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Account
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.account.map((item) => (
                    <li key={item.name}>
                      <Button
                        variant="link"
                        className="p-0 text-sm leading-6 text-gray-600 hover:text-gray-900"
                        asChild
                      >
                        <Link href={item.href}>{item.name}</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Legal
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Button
                        variant="link"
                        className="p-0 text-sm leading-6 text-gray-600 hover:text-gray-900"
                        asChild
                      >
                        <Link href={item.href}>{item.name}</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 flex flex-col gap-y-4 sm:flex-row justify-between pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500">
            &copy; 2023 Arthur Eberle Digital Solutions
          </p>
          <p className="text-xs leading-5 text-gray-500">
            Made with ❤️ in Germany
          </p>
        </div>
      </div>
    </footer>
  );
}
