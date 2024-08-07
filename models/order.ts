import { Order } from "@/types/order";
import { getDb } from "@/models/db"; // 确保 getDb 返回的是 Supabase 客户端实例

export async function insertOrder(order: Order) {
  const supabase = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { data, error } = await supabase
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
      },
    ]);

  if (error) {
    throw error;
  }

  return data;
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
  paied_at: string
) {
  const supabase = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }

  // 更新订单状态
  const { data: orderData, error: updateError } = await supabase
    .from("orders")
    .update({ order_status, paied_at })
    .eq("order_no", order_no)
    .select('user_email, credits')
    .single();

  if (updateError) {
    throw updateError;
  }

  if (!orderData) {
    throw new Error("Order not found or update failed.");
  }

  const { user_email, credits } = orderData;
  console.log("order useremail:" + user_email);
  // 更新用户的信用
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select('credit')
    .eq('email', user_email)
    .single();

  if (userError) {
    throw userError;
  }
  console.log("order user old credit:" + userData.credit);
  console.log("order user add credit:" + credits);
  const newCredit = userData.credit + credits;

  const { error: updateUserError } = await supabase
    .from("users")
    .update({ credit: newCredit })
    .eq('email', user_email);

  if (updateUserError) {
    throw updateUserError;
  }

  return orderData;
}

export async function updateOrderSession(
  order_no: string,
  stripe_session_id: string
) {
  const supabase = await getDb();
  console.log("orderno and stripe session id:"+order_no+stripe_session_id);
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
  };

  return order;
}