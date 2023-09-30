"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import { clsx } from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LoadingSpinnerIcon } from "~/app/icons";
import { Button } from "~/components/buttons/generic";
import { Container } from "~/components/container";
import { getStripe } from "~/lib/client/stripe";
import { handleError, handleSuccess, raise } from "~/lib/client/utils";
import { SIGN_IN_PAGE } from "~/lib/constants/routes";
import { isObjectWithProperty } from "~/lib/helpers/functions";

import type { User } from "@supabase/supabase-js";
import type {
  Price,
  ProductWithPrices,
  SubscriptionWithProduct,
} from "~/lib/types/subscriptions";

function formatToCurrency(currency: string, amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

const ENDPOINT = "/api/v1/checkout/sessions";

export function Tiers(props: {
  user: User | null;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}) {
  const router = useRouter();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleCheckout = async (price: Price) => {
    if (!props.user) router.push(SIGN_IN_PAGE);
    setPriceIdLoading(price.id);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({ price }),
      });

      if (!response.ok) raise(`Response from ${ENDPOINT} was not ok`);
      const data = await response.json();
      if (!isObjectWithProperty<string>(data, "sessionId"))
        raise("Checkout session id is invalid or missing");

      handleSuccess("Redirecting to checkout...");
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      handleError(error);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  return (
    <Container>
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-base font-semibold leading-7 text-brand-600">
          Credits
        </h1>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Simple no-tricks pricing
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        After signing up you get 15 free credits to try out the platform. If you
        want to continue using it, you can buy more credits. No hidden fees, no
        confusing tiers, and absolutely no tricks.
      </p>
      <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {props.products.map(
          (product, index) =>
            product.prices.length > 0 && (
              <div
                key={product.id}
                className={clsx(
                  index % 2 === 1 ? "lg:z-10 lg:rounded-b-none" : "lg:mt-8",
                  index === 0 ? "lg:rounded-r-none" : "",
                  index === props.products.length - 1
                    ? "lg:rounded-l-none"
                    : "",
                  "flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h2
                      id={product.id}
                      className={clsx(
                        index % 2 === 1 ? "text-brand-600" : "text-gray-900",
                        "text-lg font-semibold leading-8"
                      )}
                    >
                      {product.name}
                    </h2>
                    {index % 2 === 1 ? (
                      <p className="rounded-full bg-brand-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-brand-600">
                        Most popular
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {product.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      {formatToCurrency(
                        product.prices[0].currency ?? "USD",
                        product.prices[0].unit_amount ?? 0
                      )}
                    </span>
                  </p>
                  <ul
                    role="list"
                    className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                  >
                    {[
                      "Commercial use",
                      "Premium Support",
                      "No Storage Limit",
                      "Community Templates",
                      "Access to Discord Server",
                      "Ability to request new features",
                    ].map((text) => (
                      <li key={text} className="flex gap-x-3">
                        <CheckIcon
                          className="h-6 w-5 flex-none text-brand-600"
                          aria-hidden="true"
                        />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
                {props.user ? (
                  <Button
                    onClick={() => handleCheckout(product.prices[0])}
                    disabled={priceIdLoading === product.prices[0].id}
                    variant={index % 2 === 1 ? "highlight" : "outline"}
                    aria-describedby={product.id}
                    className="mt-8"
                  >
                    {priceIdLoading === product.prices[0].id && (
                      <LoadingSpinnerIcon className="w-4 h-4 mr-2" />
                    )}
                    Buy Credits
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant={index % 2 === 1 ? "highlight" : "outline"}
                    className="mt-8"
                  >
                    <Link href={SIGN_IN_PAGE}>Sign in</Link>
                  </Button>
                )}
              </div>
            )
        )}
      </div>
    </Container>
  );
}
