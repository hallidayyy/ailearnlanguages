import { getUserOrders, updateOrderStatus } from "@/models/order";
import { getDb } from "@/models/db"; // 请确保路径正确
import { Order } from "@/types/order";
import Stripe from "stripe";
import { updateUserQuota } from "@/models/quota";
import { findUserByEmail } from "@/models/user";
import { SubscriptIcon } from "lucide-react";



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
    const order = await updateOrderStatus(order_no, 2, paid_at, customer_id,subscription_id);
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

    const userIdAsNumber = Number(user.user_id);
    if (isNaN(userIdAsNumber)) {
      throw new Error(`Invalid user_id: ${user.user_id} cannot be converted to a number.`);
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
// export async function getUserCredits(user_email: string): Promise<number> {
//   const supabase = await getDb();

//   try {
//     // 从 users 表中获取用户的信用信息
//     const { data: userData, error: userError } = await supabase
//       .from('users')
//       .select('credit')
//       .eq('email', user_email)
//       .single();

//     if (userError) {
//       console.log("Error fetching user credits: ", userError);
//       throw userError;
//     }

//     if (!userData) {
//       console.log("User not found");
//       return 0; // 或者返回一个默认值
//     }

//     // 直接返回用户的信用信息
//     return userData.credit;
//   } catch (e) {
//     console.log("get user credits failed: ", e);
//     return 0; // 或者返回一个默认值
//   }
// }

export async function getUserQuota(user_email: string): Promise<{ user_id: number, access_content_quota: number, run_ai_quota: number } | null> {
  const supabase = await getDb();

  try {
    // 从 users 表和 quota 表中获取用户的 quota 信息
    const { data, error } = await supabase
      .from('users')
      .select('id, quota!inner(access_content_quota, run_ai_quota)')
      .eq('email', user_email)
      .single();

    if (error) {
      console.log("Error fetching user quota: ", error);
      throw error;
    }

    if (!data || !data.quota || data.quota.length === 0) {
      console.log("User or quota not found");
      return null; // 或者返回一个默认值
    }

    // 假设 quota 是数组，从数组中提取第一个元素
    const userQuota = data.quota[0];

    // 返回用户的 quota 信息
    return {
      user_id: data.id,
      access_content_quota: userQuota.access_content_quota,
      run_ai_quota: userQuota.run_ai_quota
    };
  } catch (e) {
    console.log("get user quota failed: ", e);
    return null; // 或者返回一个默认值
  }
}
export async function decrementAccessContentQuota(user_email: string): Promise<{ success: boolean, message: string }> {
  const userQuota = await getUserQuota(user_email);

  if (!userQuota) {
    return { success: false, message: "User not found or quota information missing." };
  }

  if (userQuota.access_content_quota <= 0) {
    return { success: false, message: "Access content quota is insufficient." };
  }

  const supabase = await getDb();

  try {
    const { error } = await supabase
      .from('quota')
      .update({ access_content_quota: userQuota.access_content_quota - 1 })
      .eq('user_id', userQuota.user_id);

    if (error) {
      console.log("Error updating access content quota: ", error);
      throw error;
    }

    return { success: true, message: "Access content quota decremented successfully." };
  } catch (e) {
    console.log("Decrement access content quota failed: ", e);
    return { success: false, message: "Failed to decrement access content quota." };
  }
}


export async function decrementRunAIQuota(user_email: string): Promise<{ success: boolean, message: string }> {
  const userQuota = await getUserQuota(user_email);

  if (!userQuota) {
    return { success: false, message: "User not found or quota information missing." };
  }

  if (userQuota.run_ai_quota <= 0) {
    return { success: false, message: "Run AI quota is insufficient." };
  }

  const supabase = await getDb();

  try {
    const { error } = await supabase
      .from('quota')
      .update({ run_ai_quota: userQuota.run_ai_quota - 1 })
      .eq('user_id', userQuota.user_id);

    if (error) {
      console.log("Error updating run AI quota: ", error);
      throw error;
    }

    return { success: true, message: "Run AI quota decremented successfully." };
  } catch (e) {
    console.log("Decrement run AI quota failed: ", e);
    return { success: false, message: "Failed to decrement run AI quota." };
  }
}



export async function getUserPlan(user_email: string): Promise<string> {
  const supabase = await getDb();

  try {
    // 查询 orders 表，查找 user_email 的最新的一条，且 order_status=2 的记录
    const { data, error } = await supabase
      .from('orders')
      .select('plan, paied_at')
      .eq('user_email', user_email)
      .eq('order_status', 2)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.log("Error fetching user plan: ", error);
      throw error;
    }

    if (!data) {
      console.log("No valid order found for user");
      return 'free'; // 如果没有找到有效的订单，则返回 free
    }

    const now = new Date();
    const paid_at = new Date(data.paied_at);

    // 计算 paid_at 加上 1 个月后的日期
    const expirationDate = new Date(paid_at);
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    if (now < expirationDate) {
      // 订阅还没有过期
      return data.plan;
    } else {
      // 订阅已经过期
      return 'free';
    }
  } catch (e) {
    console.log("Get user plan failed: ", e instanceof Error ? e.message : e);
    return 'free'; // 或者返回一个默认值
  }
}