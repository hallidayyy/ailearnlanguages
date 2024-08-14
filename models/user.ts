import { getDb } from "@/models/db"; // 确保 getDb 返回的是 Supabase 客户端实例
import { User } from "@/types/user"; // 确保 User 类型定义正确
import { genOrderNo } from "@/lib/order";



export async function insertUser(user: User) {
  const createdAt: string = new Date().toISOString();
  const supabase = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }

  // 插入用户
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([
      {
        email: user.email,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        created_at: createdAt,
      },
    ])
    .select()
    .single(); // 使用 single() 确保只获取一条数据

  if (userError) {
    console.error("Failed to insert user", userError);
    throw userError;
  }

  console.log("User inserted successfully", userData);

  // 获取插入用户的 id
  const userId = userData?.id;

  if (!userId) {
    throw new Error("User ID is missing after user insertion.");
  }

  // 插入配额，默认为 free 用户
  try {
    const { error: quotaError } = await supabase
      .from("quota")
      .insert([
        {
          user_id: userId,
          access_content_quota: 4,
          run_ai_quota: 0,
        }
      ]);

    if (quotaError) {
      throw quotaError;
    }

    console.log("Quota inserted successfully for user:", userId);
  } catch (quotaError) {
    console.error("Failed to insert quota", quotaError);
    // 处理配额插入失败的逻辑（可选）
  }

  //为免费用户创建一个长期的 order
  // createFreeOrder(user.email);

  return userData;
}



export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  const supabase = await getDb();

  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);

  if (error) {
    console.error("Error querying user:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.log("No user found with email:", email);
    return undefined;
  }

  // 假设查询结果只有一条记录
  const user: User = {
    email: data[0].email,
    nickname: data[0].nickname,
    avatar_url: data[0].avatar_url,
    created_at: data[0].created_at,
    user_id: data[0].id

  };

  return user;
}

export async function findUserByID(user_id: string): Promise<User | undefined> {
  const supabase = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    return undefined;
  }

  const user: User = {
    user_id: data.id,
    email: data.email,
    nickname: data.nickname,
    avatar_url: data.avatar_url,
    created_at: data.created_at,

  };

  return user;
}


export async function updateUserNicknameByEmail(
  email: string,
  newNickname: string
): Promise<void> {
  const supabase = await getDb();

  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }

  const { data, error } = await supabase
    .from("users")
    .update({ nickname: newNickname })
    .eq("email", email);

  if (error) {
    console.error("Error updating user nickname:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.log("No user found with email:", email);
    return;
  }

  console.log("User nickname updated successfully.");
}

export async function getUserByCustomerID(customerID: string): Promise<User | undefined> {
  const supabase = await getDb();

  // 验证 supabase 对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }

  // 第一步：查询 orders 表，根据 customer_id 获取 user_email
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("user_email")
    .eq("customer_id", customerID)
    .single(); // 假设 customer_id 是唯一的

  if (orderError) {
    throw orderError;
  }

  if (!orderData) {
    return undefined; // 如果找不到对应的订单，则返回 undefined
  }

  const userEmail = orderData.user_email;

  // 第二步：根据 user_email 查询 users 表
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, email, avatar_url, created_at, nickname")
    .eq("email", userEmail)
    .single();

  if (userError) {
    throw userError;
  }

  if (!userData) {
    return undefined; // 如果找不到对应的用户，则返回 undefined
  }

  // 将查询结果映射为 User 对象
  const user: User = {
    user_id: userData.id,
    email: userData.email,
    nickname: userData.nickname, // 假设 nickname 对应 name
    avatar_url: userData.avatar_url,
    created_at: userData.created_at,
  };

  return user;
}

// 假设你有一个 User 接口
interface User {
  user_id: string;
  email: string;
  nickname: string;
  avatar_url: string;
  created_at: string;
}