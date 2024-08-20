import { insertOrder, updateOrderSession } from "@/models/order";
import { respData, respErr } from "@/lib/resp";
import { Order } from "@/types/order";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs";
import { genOrderNo } from "@/lib/order";

export const maxDuration = 60;

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return respErr("not login");
  }

  const user_email = user.emailAddresses[0].emailAddress;
  console.log("user email: ", user_email);

  try {
    const { credits, currency, amount, plan } = await req.json();
    if (!credits || !amount || !plan || !currency) {
      return respErr("invalid params");
    }

    if (!["monthly"].includes(plan)) {
      return respErr("invalid plan");
    }

    const order_no = genOrderNo();
    const currentDate = new Date();
    const oneMonthLater = new Date(currentDate);
    oneMonthLater.setMonth(currentDate.getMonth() + 1);

    const order: Order = {
      order_no: order_no,
      created_at: currentDate.toISOString(),
      user_email: user_email,
      amount: amount,
      plan: plan,
      expired_at: oneMonthLater.toISOString(),
      order_status: 1,
      credits: credits,
      currency: currency,
      customer_id: "",
      subscription_id: "",
    };

    await insertOrder(order); // Ensure the order is inserted before proceeding
    console.log("create new order: ", order);

    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
      apiVersion: "2023-10-16",
    });

    let options: Stripe.Checkout.SessionCreateParams = {
      customer_email: user_email,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "languepod subscription Plan",
            },
            unit_amount: amount,
            recurring: plan === "monthly" ? { interval: "month" } : undefined,
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: false,
      metadata: {
        project: "languepod",
        pay_scene: "subscription",
        order_no: order_no.toString(),
        user_email: user_email,
        credits: credits,
      },
      mode: plan === "monthly" ? "subscription" : "payment",
      success_url: `${process.env.WEB_BASE_URI}/pay-success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.WEB_BASE_URI}/pricing`,
    };

    if (currency === "cny") {
      options.payment_method_types = ["wechat_pay", "card"];
      options.payment_method_options = {
        wechat_pay: {
          client: "web",
        },
      };
    }

    const session = await stripe.checkout.sessions.create(options);
    const stripe_session_id = session.id;

    await updateOrderSession(order_no, stripe_session_id); // Ensure the order session is updated
    console.log("update order session: ", order_no, stripe_session_id);

    return respData({
      public_key: process.env.STRIPE_PUBLIC_KEY,
      order_no: order_no,
      session_id: stripe_session_id,
    });
  } catch (e) {
    console.error("checkout failed: ", e);
    return respErr("checkout failed");
  }
}