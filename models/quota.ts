import { getDb } from "@/models/db"; // 确保 getDb 返回的是 Supabase 客户端实例


//更新用户 quota，用在续订的场景。
export async function updateUserQuota(user_id: number, access_content_quota: number, run_ai_quota: number): Promise<boolean> {
  const supabase = await getDb();

  try {
    // 更新用户的 quota 信息
    const { error } = await supabase
      .from('quota')
      .update({ access_content_quota, run_ai_quota })
      .eq('user_id', user_id);

    if (error) {
      console.log("Error updating user quota: ", error);
      throw error;
    }
    return true;
  } catch (e) {
    console.log("Update user quota failed: ", e);
    return false;
  }
}


interface Quota {
  access_content_quota: number;
  run_ai_quota: number;
}

export async function getUserQuota(user_email: string): Promise<{ user_id: number, access_content_quota: number, run_ai_quota: number } | null> {
  const supabase = await getDb();

  try {
    // 从 users 表和 quota 表中获取用户的 quota 信息
    const { data, error } = await supabase
      .from('users')
      .select('id, quota:quota!inner(access_content_quota, run_ai_quota)')
      .eq('email', user_email)
      .single();

    if (error) {
      console.error("Error fetching user quota: ", error);
      return null;
    }

    if (!data || !data.quota || typeof data.quota !== 'object') {
      console.log("User or quota not found or quota is not an object");
      return null; // 或者返回一个默认值
    }

    // 确保 quota 是一个对象，并且符合 Quota 接口
    const quota = data.quota as unknown as Quota;

    // 返回用户的 quota 信息
    return {
      user_id: data.id,
      access_content_quota: quota.access_content_quota,
      run_ai_quota: quota.run_ai_quota
    };
  } catch (e) {
    console.error("get user quota failed: ", e);
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