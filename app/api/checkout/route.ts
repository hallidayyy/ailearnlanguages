import { insertOrder, updateOrderSession } from "@/models/order";
import { respData, respErr } from "@/lib/resp";
import { Order } from "@/types/order";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs";
import { genOrderNo } from "@/lib/order";
import { findCustomerIdByEmail } from "@/models/order";
import { getDb } from "@/models/db";

export const maxDuration = 60;

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return respErr("not login");
  }

  const user_email = user.emailAddresses[0].emailAddress;
  console.log("user email: ", user_email);

  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
    apiVersion: "2023-10-16",
  });

  let customerId: string | undefined = await findCustomerIdByEmail(user_email);

  // 如果没有找到 customer_id，则创建新的 customer
  if (!customerId) {
    try {
      const customer = await stripe.customers.create({
        email: user_email,
        description: 'Customer for ' + user_email,
      });

      customerId = customer.id;

      // // 存储 customer_id
      // const supabase = await getDb();
      // if (!supabase || typeof supabase.from !== 'function') {
      //   throw new Error("Supabase client is not properly initialized.");
      // }
      // const { error } = await supabase
      //   .from("orders")
      //   .update({ customer_id: customerId })
      //   .eq("user_email", user_email);

      // if (error) {
      //   throw error;
      // }

      console.log("Created new customer:", customerId);
    } catch (error) {
      console.error("Failed to create Stripe customer:", error);
      return respErr("Failed to create Stripe customer");
    }
  } else {
    console.log("Existing customer ID:", customerId);
  }

  try {
    const { currency, amount, plan } = await req.json();
    if (!amount || !plan || !currency) {
      return respErr("invalid params");
    }

    if (!["pro", "standard"].includes(plan)) {
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
      order_status: 1, // 尚未完成支付
      credits: 0,
      currency: currency,
      customer_id: customerId || "", // 确保 customer_id 被设置
      subscription_id: "",
    };

    await insertOrder(order); // 确保订单被插入到数据库中
    console.log("Created new order: ", order);

    let options: Stripe.Checkout.SessionCreateParams = {
      customer: customerId, // 使用已有的 customer_id
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "languepod subscription Plan",
            },
            unit_amount: amount,
            recurring: ["pro", "standard"].includes(plan) ? { interval: "month" } : undefined,
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
      },
      mode: ["pro", "standard"].includes(plan) ? "subscription" : "payment",
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

    await updateOrderSession(order_no, stripe_session_id); // 确保订单会话被更新
    console.log("Updated order session: ", order_no, stripe_session_id);

    return respData({
      public_key: process.env.STRIPE_PUBLIC_KEY,
      order_no: order_no,
      session_id: stripe_session_id,
    });
  } catch (e) {
    console.error("Checkout failed: ", e);
    return respErr("Checkout failed");
  }
}