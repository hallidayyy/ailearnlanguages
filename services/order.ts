import { getUserOrders, updateOrderStatus } from "@/models/order";
import { getDb } from "@/models/db"; // 请确保路径正确
import { Order } from "@/types/order";
import Stripe from "stripe";
import { updateUserQuota } from "@/models/quota";
import { findUserByEmail } from "@/models/user";


export async function handleOrderSession(session_id: string) {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
    apiVersion: '2023-10-16',
  });

  console.log("Call handleOrderSession");
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Order session: ", session);

    if (!session || !session.metadata || !session.metadata.order_no) {
      console.log("Invalid session or missing order number", session_id);
      throw new Error("Invalid session or missing order number");
    }

    const order_no = session.metadata.order_no;
    const paid_at = new Date().toISOString();
    const customer_id = session.customer; // 获取 Customer ID
    const subscription_id = session.subscription;

    if (customer_id === null || typeof customer_id !== 'string') {
      throw new Error("Invalid customer ID");
    }

    if (subscription_id === null || typeof subscription_id !== 'string') {
      throw new Error("Invalid subscription ID");
    }

    // 更新订单状态
    const order = await updateOrderStatus(order_no, 2, paid_at, customer_id, subscription_id);
    console.log(`Order no: ${order_no}, Paid at: ${paid_at}`);
    console.log(`Customer ID: ${customer_id}`);
    console.log("Update success order status: ", order_no, paid_at);

    // 计算首月 quota
    const planTypes: { [key: number]: string } = {
      590: 'standard',
      1190: 'pro'
    };

    const amount_paid = session.amount_total || 0;
    const current_plan = planTypes[amount_paid] || 'unknown';

    const quotaByPlan: { [key: string]: { access_content_quota: number, run_ai_quota: number } } = {
      'standard': { access_content_quota: -1, run_ai_quota: 20 },
      'pro': { access_content_quota: -1, run_ai_quota: 50 },
      'unknown': { access_content_quota: 999, run_ai_quota: 999 } // 仅用于测试
    };

    // 获取对应的 quota
    const { access_content_quota, run_ai_quota } = quotaByPlan[current_plan];

    // 查找用户并更新 quota
    const user = await findUserByEmail(order.user_email); // 这里使用 order.user_email 而不是 order.email
    if (!user) {
      throw new Error(`User not found with email: ${order.user_email}`);
    }

    const userIdAsNumber = Number(user.id);
    if (isNaN(userIdAsNumber)) {
      throw new Error(`Invalid user_id: ${user.id} cannot be converted to a number.`);
    }

    const success = await updateUserQuota(userIdAsNumber, access_content_quota, run_ai_quota);
    if (!success) {
      throw new Error("Failed to update user quota");
    }

    console.log("User quota updated successfully");

  } catch (e) {
    if (e instanceof Error) {
      console.error("Handle order session failed: ", e.message);
    } else {
      console.error("Handle order session failed: An unknown error occurred");
    }
    throw e;
  }
}




