import { getUserOrders, updateOrderStatus } from "@/models/order";
import { getDb } from "@/models/db"; // 请确保路径正确
import { Order } from "@/types/order";
import Stripe from "stripe";

import { getUserCoversCount } from "@/models/cover";

export async function handleOrderSession(session_id: string) {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");

  console.log("call hos");
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("order session: ", session);
    if (!session || !session.metadata || !session.metadata.order_no) {
      console.log("invalid session", session_id);
      throw new Error("invalid session");
    }

    const order_no = session.metadata.order_no;
    const paied_at = new Date().toISOString();
    console.log("order no and paid at:" + order_no + paied_at);
    updateOrderStatus(order_no, 2, paied_at);
    console.log("update success order status: ", order_no, paied_at);
  } catch (e) {
    console.log("handle order session failed: ", e);
    throw e;
  }
}

export async function getUserCredits(user_email: string): Promise<number> {
  const supabase = await getDb();

  try {
    // 从 users 表中获取用户的信用信息
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credit')
      .eq('email', user_email)
      .single();

    if (userError) {
      console.log("Error fetching user credits: ", userError);
      throw userError;
    }

    if (!userData) {
      console.log("User not found");
      return 0; // 或者返回一个默认值
    }

    // 直接返回用户的信用信息
    return userData.credit;
  } catch (e) {
    console.log("get user credits failed: ", e);
    return 0; // 或者返回一个默认值
  }
}