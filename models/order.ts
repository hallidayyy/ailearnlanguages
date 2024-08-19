

import { getDb } from "@/models/db"; // 确保 getDb 返回的是 Supabase 客户端实例
import { Order } from "@/types/order"; // 确保 Order 类型定义正确
import { genOrderNo } from "@/lib/order";
import Stripe from 'stripe';



export async function insertOrder(order: Order) {
  const supabase = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }

  console.error("call insert here");

  // 插入订单
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        order_no: order.order_no,
        created_at: order.created_at,
        user_email: order.user_email,
        amount: order.amount,
        plan: order.plan,
        expired_at: order.expired_at,
        order_status: order.order_status,
        credits: order.credits,
        currency: order.currency,
        customer_id: order.customer_id
      },
    ])
    .select()
    .single(); // 使用 single() 确保只获取一条数据

  if (orderError) {
    console.error("Failed to insert order", orderError);
    throw orderError;
  }

  console.log("Order inserted successfully", orderData);

  // 获取插入订单的 user_email
  const userEmail = orderData?.user_email;

  if (!userEmail) {
    throw new Error("User email is missing after order insertion.");
  }

  // 获取用户 id
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", userEmail)
    .single();

  if (userError) {
    console.error("Failed to get user ID", userError);
    throw userError;
  }

  const userId = userData?.id;

  if (!userId) {
    throw new Error("User ID is missing after retrieving user data.");
  }

  // 根据 plan 插入 quota
  let accessContentQuota = -1; // 默认值
  let runAiQuota = 0;

  if (order.plan === "standard") {
    runAiQuota = 20;
  } else if (order.plan === "pro") {
    runAiQuota = 50;
  }

  if (runAiQuota > 0) {
    try {
      await supabase
        .from("quota")
        .insert([
          {
            user_id: userId,
            access_content_quota: accessContentQuota,
            run_ai_quota: runAiQuota,
          }
        ]);
      console.log("Quota inserted successfully for user:", userId);
    } catch (quotaError) {
      console.error("Failed to insert quota", quotaError);
      // 处理配额插入失败的逻辑（可选）
    }
  }

  return orderData;
}

export async function findOrderByOrderNo(
  order_no: number
): Promise<Order | undefined> {
  const supabase = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_no", order_no)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    return undefined;
  }

  return formatOrder(data);
}

export async function updateOrderStatus(
  order_no: string,
  order_status: number,
  paied_at: string,
  customer_id: string,
  subscription_id: string,

) {
  const supabase = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }

  // 更新订单状态
  const { data: orderData, error: updateError } = await supabase
    .from("orders")
    .update({ order_status, paied_at, customer_id, subscription_id })
    .eq("order_no", order_no)
    .select('user_email')
    .single();

  if (updateError) {
    throw updateError;
  }

  if (!orderData) {
    throw new Error("Order not found or update failed.");
  }



  return orderData;
}

export async function updateOrderSession(
  order_no: string,
  stripe_session_id: string
) {
  const supabase = await getDb();
  console.log("orderno and stripe session id:" + order_no + stripe_session_id);
  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { data, error } = await supabase
    .from("orders")
    .update({ stripe_session_id })
    .eq("order_no", order_no);

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserOrders(
  user_email: string
): Promise<Order[] | undefined> {
  const now = new Date().toISOString();
  const supabase = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_email", user_email)
    .eq("order_status", 2)
    .gte("expired_at", now);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return undefined;
  }

  return data.map(formatOrder);
}

function formatOrder(row: any): Order {
  const order: Order = {
    order_no: row.order_no,
    created_at: row.created_at,
    user_email: row.user_email,
    amount: row.amount,
    plan: row.plan,
    expired_at: row.expired_at,
    order_status: row.order_status,
    paied_at: row.paied_at,
    stripe_session_id: row.stripe_session_id,
    credits: row.credits,
    currency: row.currency,
    customer_id: row.customer_id,
    subscription_id: row.subscription_id
  };

  return order;
}


export async function getUserCurrentPlanExpiredDate(user_email: string): Promise<Date | null> {
  const supabase = await getDb();

  try {
    // 查询 orders 表，查找 user_email 的最新的一条，且 order_status=2 的记录
    const { data, error } = await supabase
      .from('orders')
      .select('paied_at')
      .eq('user_email', user_email)
      .eq('order_status', 2)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.log("Error fetching user plan expiration date: ", error);
      throw error;
    }

    if (!data) {
      console.log("No valid order found for user");
      return null; // 如果没有找到有效的订单，则返回 null
    }

    const paid_at = new Date(data.paied_at);

    // 计算 paid_at 加上 1 个月后的日期
    const expirationDate = new Date(paid_at);
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    return expirationDate; // 返回到期日期

  } catch (e) {
    console.log("Get user plan expiration date failed: ", e instanceof Error ? e.message : e);
    return null; // 发生错误时返回 null
  }
}

export async function cancelSubscriptionAtPeriodEnd(subscriptionId: string) {
  try {
    // 将订阅设置为在当前计费周期结束时取消

    // 初始化 Stripe 客户端
    // console.log("hello")
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
      apiVersion: '2023-10-16',
    });

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    console.log(`Subscription ${subscription.id} set to cancel at period end.`);
    return subscription;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error setting subscription ${subscriptionId} to cancel at period end:`, errorMessage);
    throw new Error(errorMessage);
  }
}


export async function getSubscriptionStatus(subscriptionId: string) {
  try {
    // 初始化 Stripe 客户端
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
      apiVersion: '2023-10-16',
    });

    // 获取订阅详情
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // 返回订阅状态
    console.log(`Subscription ${subscription.id} status: ${subscription.status}`);
    return subscription.status;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error retrieving subscription ${subscriptionId} status:`, errorMessage);
    throw new Error(errorMessage);
  }
}


export async function getSubscriptionStatusByEmail(email: string) {
  try {
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
      apiVersion: '2023-10-16',
    });

    // 获取订阅 ID
    const subID = await getSubscriptionIdByEmail(email);

    // 检查 subID 是否为 null
    if (subID === null) {
      console.error(`No subscription found for email: ${email}`);
      return null;
    }

    // 获取订阅详情
    const subscription = await stripe.subscriptions.retrieve(subID);

    // 返回订阅状态
    console.log(`Subscription ${subscription.id} status: ${subscription.status}`);
    return subscription.status;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error retrieving subscription status for email ${email}:`, errorMessage);
    throw new Error(errorMessage);
  }
}




export async function getSubscriptionIdByEmail(email: string): Promise<string | null> {

  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
    apiVersion: '2023-10-16',
  });

  const supabase = await getDb();

  // 验证 Supabase 对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }

  try {
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("subscription_id")
      .eq("user_email", email)
      .order("paied_at", { ascending: false })
      .limit(1)
      .single();

    if (orderError) {
      throw orderError;
    }

    return orderData ? orderData.subscription_id : null;
  } catch (error) {
    // 如果找不到记录，返回 null
    if (error instanceof Error && error.message.includes('PGRST116')) {
      return null;
    }
    throw error;
  }
}