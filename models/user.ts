import { getDb } from "@/models/db"; // 确保 getDb 返回的是 Supabase 客户端实例
import { User } from "@/types/user"; // 确保 User 类型定义正确
import { genOrderNo } from "@/lib/order";
import { v4 as uuidv4 } from "uuid";

export async function insertUser(user: User): Promise<User> {
  const createdAt: string = new Date().toISOString();
  const supabase = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== "function") {
    throw new Error("Supabase client is not properly initialized.");
  }
  const newUuid = uuidv4();
  // 插入用户
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([
      {
        email: user.email,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        created_at: createdAt,
        uuid: newUuid,
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
    const { error: quotaError } = await supabase.from("quota").insert([
      {
        user_id: userId,
        access_content_quota: 4,
        run_ai_quota: 0,
        updated_at: createdAt, // 设置当前时间
      },
    ]);

    if (quotaError) {
      throw quotaError;
    }

    console.log("Quota inserted successfully for user:", userId);
  } catch (quotaError) {
    console.error("Failed to insert quota", quotaError);
    // 处理配额插入失败的逻辑（可选）
  }

  return userData as User;
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  try {
    const supabase = await getDb();

    if (!supabase || typeof supabase.from !== "function") {
      throw new Error("Supabase client is not properly initialized.");
    }
    console.log("user email when findusersbyemail:"+email)
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      console.log("No user found with email:", email);
      return undefined;
    }

    return data as User;
  } catch (error) {
    console.error("Error querying user:", error);
    return undefined;
  }
}

export async function findUserByID(user_id: number): Promise<User | undefined> {
  const supabase = await getDb();

  if (!supabase || typeof supabase.from !== "function") {
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

  return data as User;
}

export async function updateUserNicknameByEmail(
  email: string,
  newNickname: string
): Promise<void> {
  const supabase = await getDb();

  if (!supabase || typeof supabase.from !== "function") {
    throw new Error("Supabase client is not properly initialized.");
  }

  const { error } = await supabase
    .from("users")
    .update({ nickname: newNickname })
    .eq("email", email);

  if (error) {
    console.error("Error updating user nickname:", error);
    throw error;
  }

  console.log("User nickname updated successfully.");
}

export async function getUserByCustomerID(
  customerID: string
): Promise<User | undefined> {
  const supabase = await getDb();

  if (!supabase || typeof supabase.from !== "function") {
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

  return userData as unknown as User;
}
