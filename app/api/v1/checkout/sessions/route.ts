import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { z } from "zod";

import { stripe } from "~/lib/api/stripe";
import { createOrRetrieveCustomer } from "~/lib/api/supabase";
import { handleError, raise } from "~/lib/api/utils";
import { CREATE_NEW_PAGE, CREDITS_PAGE } from "~/lib/constants/routes";
import { getURL } from "~/lib/helpers/functions";
import { createEdgeHandlerClient } from "~/lib/edge/supabase";

const schema = z.object({
  price: z.object({
    id: z.string(),
    type: z.string(),
    product_id: z.string(),
  }),
  quantity: z.number().default(1),
  metadata: z.record(z.string()).optional(),
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = schema.safeParse(body);
    if (!validation.success) raise(400, validation.error.message);

    const supabase = createEdgeHandlerClient(req);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) raise(401, "User not found.");

    const customer = await createOrRetrieveCustomer({
      uuid: user.id,
      email: user.email ?? "",
    });

    let session: Stripe.Checkout.Session;
    if (validation.data.price.type === "recurring") {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "required",
        customer,
        customer_update: {
          address: "auto",
        },
        line_items: [
          {
            price: validation.data.price.id,
            quantity: validation.data.quantity,
          },
        ],
        mode: "subscription",
        allow_promotion_codes: false,
        subscription_data: {
          trial_from_plan: true,
          metadata: validation.data.metadata,
        },
        success_url: getURL() + CREATE_NEW_PAGE,
        cancel_url: getURL() + CREDITS_PAGE,
      });
    } else if (validation.data.price.type === "one_time") {
      session = await stripe.checkout.sessions.create({
        // payment_method_types: ["card", "paypal"],
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        customer,
        customer_update: {
          address: "auto",
        },
        line_items: [
          {
            price: validation.data.price.id,
            quantity: validation.data.quantity,
          },
        ],
        mode: "payment",
        allow_promotion_codes: false,
        success_url: getURL() + CREATE_NEW_PAGE,
        cancel_url: getURL() + CREDITS_PAGE,
      });
    } else {
      raise(400, "Invalid price type");
    }

    if (!session) raise(500, "Failed to create checkout session");

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
