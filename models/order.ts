import { Order } from "@/types/order";
import { getDb } from "@/models/db"; // 确保 getDb 返回的是 Supabase 客户端实例

export async function insertOrder(order: Order) {
  const supabase: SupabaseClient = await getDb();

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
  const supabase: SupabaseClient = await getDb();

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
  const supabase: SupabaseClient = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { data, error } = await supabase
    .from("orders")
    .update({ order_status, paied_at })
    .eq("order_no", order_no);

  if (error) {
    throw error;
  }

  return data;
}

export async function updateOrderSession(
  order_no: string,
  stripe_session_id: string
) {
  const supabase: SupabaseClient = await getDb();

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
  const supabase: SupabaseClient = await getDb();

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