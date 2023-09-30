import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "~/lib/api/stripe";
import {
  manageSubscriptionStatusChange,
  updateCredits,
  upsertPriceRecord,
  upsertProductRecord,
} from "~/lib/api/supabase";
import { handleError, raise } from "~/lib/api/utils";
import { env } from "~/lib/env.mjs";

// paid dollars: amount of credits
const creditsLookup: { [key: number]: number } = {
  500: 15,
  1000: 50,
  1500: 100,
};

const events = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.text();
  const stripeSignature = req.headers.get("Stripe-Signature");
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET_KEY;
  let event: Stripe.Event;

  try {
    if (!stripeSignature || !webhookSecret) return;
    event = await stripe.webhooks.constructEventAsync(
      body,
      stripeSignature,
      webhookSecret
    );
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (!events.has(event.type)) {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  try {
    switch (event.type) {
      case "product.created":
      case "product.updated":
        await upsertProductRecord(event.data.object as Stripe.Product);
        break;
      case "price.created":
      case "price.updated":
        await upsertPriceRecord(event.data.object as Stripe.Price);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription;
        await manageSubscriptionStatusChange(
          subscription.id,
          subscription.customer as string,
          event.type === "customer.subscription.created"
        );
        break;
      case "checkout.session.completed":
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        // Recurring Payments
        if (checkoutSession.mode === "subscription") {
          const subscriptionId = checkoutSession.subscription;
          await manageSubscriptionStatusChange(
            subscriptionId as string,
            checkoutSession.customer as string,
            true
          );
        }
        // One-Time Payments
        if (checkoutSession.mode === "payment") {
          if (!checkoutSession.amount_total) raise(400, "Missing amount_total");
          const creditAmount = creditsLookup[checkoutSession.amount_total] || 0;
          await updateCredits(checkoutSession.customer as string, creditAmount);
        }
        break;
      default:
        raise(400, "Unhandled Event Type");
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
