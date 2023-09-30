import { clsx } from "clsx";

import { Button } from "~/components/buttons/generic";
import { Container } from "~/components/container";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact Qriginals Support | We're Here to Help via Discord, Email, and Twitter",
  description:
    "Need assistance? Qriginals offers support through various channels. Reach out to us via Discord, Email, or Twitter for help.",
};

const methods = [
  {
    name: "Discord",
    description:
      "Join our official Discord server to chat with us directly, get help with your questions and become a part of the Qriginals community.",
    url: "https://discord.gg/fJdqQSyT",
    label: "Join Discord",
  },
  {
    name: "Email",
    description:
      "Don't use Discord or Twitter? Send us an email and we'll get back to you as soon as possible.",
    url: "arthureberle.dev@gmail.com",
    label: "Email us",
  },
  {
    name: "Twitter/X",
    description:
      "Have a quick question? Tweet us at @qriginals_com and we'll help you resolve any issues.",
    url: "https://twitter.com/qriginals_com",
    label: "Follow us",
  },
];

export default function Page() {
  return (
    <Container>
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-base font-semibold leading-7 text-brand-600">
          Support
        </h1>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Need Help?
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        Contact us through the listed methods below to receive answers to your
        questions and learn more about Qriginals.
      </p>
      <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {methods.map((method, index) => (
          <div
            key={method.name}
            className={clsx(
              index % 2 === 1 ? "lg:z-10 lg:rounded-b-none" : "lg:mt-8",
              index === 0 ? "lg:rounded-r-none" : "",
              index === methods.length - 1 ? "lg:rounded-l-none" : "",
              "flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
            )}
          >
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h2
                  id={method.name}
                  className={clsx(
                    index % 2 === 1 ? "text-brand-600" : "text-gray-900",
                    "text-lg font-semibold leading-8"
                  )}
                >
                  {method.name}
                </h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {method.description}
              </p>
            </div>

            <Button
              asChild
              variant={index % 2 === 1 ? "highlight" : "outline"}
              className="mt-8"
            >
              {method.name === "Email" ? (
                <a href={`mailto:${method.url}`}>{method.label}</a>
              ) : (
                <a target="_blank" rel="noopener noreferrer" href={method.url}>
                  {method.label}
                </a>
              )}
            </Button>
          </div>
        ))}
      </div>
    </Container>
  );
}
