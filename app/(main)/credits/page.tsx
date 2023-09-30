import {
  getActiveProductsWithPrices,
  getSession,
  getSubscription,
} from "~/lib/server/supabase";
import { Tiers } from "./tiers";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Credits at Qriginals | Affordable Pricing for Unique QR Codes",
  description:
    "Buy credits on Qriginals today and enjoy the freedom of creating more QR Code Art. Experience our simple pricing, commercial use, and premium support.",
};

export default async function Page() {
  const [session, products, subscription] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription(),
  ]);

  return (
    <Tiers
      products={products}
      subscription={subscription}
      user={session?.user ?? null}
    />
  );
}
