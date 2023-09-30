import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

import { env } from "../env.mjs";
import { stripe } from "./stripe";

import { formatToDateTime } from "../helpers/functions";
import type { Database } from "../types/db";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Price = Database["public"]["Tables"]["prices"]["Row"];

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
//       as it has admin privileges and overwrites RLS policies!
const UNSAFE_supabaseAdmin = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Note: This runs in a webhook and thus no user info is available. We need to
//       use the customer ID from the Stripe event to look up the user ID in
//       our mapping table.
const updateCredits = async (customerId: string, amount: number) => {
  const { data: customer, error: noCustomerError } =
    await UNSAFE_supabaseAdmin.from("customers")
      .select("user_id:id")
      .eq("stripe_customer_id", customerId)
      .single();
  if (noCustomerError) throw noCustomerError;
  if (!customer) throw new Error("No customer data found");

  const { error: updateCreditsError } = await UNSAFE_supabaseAdmin.rpc(
    "increment_credits_by_amount",
    { purchased_amount: amount, user_id_input: customer.user_id }
  );
  if (updateCreditsError) throw updateCreditsError;
  console.info(
    `Updated credits for user [${customer.user_id}] by [${amount}] credits.`
  );
};

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error } = await UNSAFE_supabaseAdmin.from("products").upsert([
    productData,
  ]);
  if (error) throw error;
  console.info(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  };

  const { error } = await UNSAFE_supabaseAdmin.from("prices").upsert([
    priceData,
  ]);
  if (error) throw error;
  console.info(`Price inserted/updated: ${price.id}`);
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  const { data, error } = await UNSAFE_supabaseAdmin.from("customers")
    .select("stripe_customer_id")
    .eq("id", uuid)
    .single();
  if (error || !data?.stripe_customer_id) {
    // No customer record found, let's create one.
    const customerData: { metadata: { supabaseUUID: string }; email?: string } =
      {
        metadata: {
          supabaseUUID: uuid,
        },
      };
    if (email) customerData.email = email;
    const customer = await stripe.customers.create(customerData);
    // Now insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await UNSAFE_supabaseAdmin.from(
      "customers"
    ).insert([{ id: uuid, stripe_customer_id: customer.id }]);
    if (supabaseError) throw supabaseError;
    console.info(`New customer created and inserted for ${uuid}.`);
    return customer.id;
  }
  return data.stripe_customer_id;
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  // Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error } = await UNSAFE_supabaseAdmin.from("users")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", uuid);
  if (error) throw error;
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } =
    await UNSAFE_supabaseAdmin.from("customers")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();
  if (noCustomerError) throw noCustomerError;

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"] =
    {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      // Todo check quantity on subscription
      // @ts-ignore
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? formatToDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? formatToDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: formatToDateTime(
        subscription.current_period_start
      ).toISOString(),
      current_period_end: formatToDateTime(
        subscription.current_period_end
      ).toISOString(),
      created: formatToDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? formatToDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? formatToDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? formatToDateTime(subscription.trial_end).toISOString()
        : null,
    };

  const { error } = await UNSAFE_supabaseAdmin.from("subscriptions").upsert([
    subscriptionData,
  ]);
  if (error) throw error;
  console.info(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};

export {
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  updateCredits,
  upsertPriceRecord,
  upsertProductRecord,
};
