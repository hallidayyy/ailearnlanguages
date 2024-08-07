import { User } from "@/types/user";
import { getDb } from "@/models/db"; // 确保 getDb 返回的是 Supabase 客户端实例

export async function insertUser(user: User) {
  const createdAt: string = new Date().toISOString();
  const supabase = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  console.error("call insert here");
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        email: user.email,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        created_at: createdAt,
        uuid: user.uuid,
      },
    ]).select();

  if (error) {
    console.error("Failed to insert user", error);
    throw error;
  }

  console.log("User inserted successfully", data);
  return data;
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
    uuid: data[0].uuid,
  };

  return user;
}

export async function findUserByUuid(uuid: string): Promise<User | undefined> {
  const supabase = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    return undefined;
  }

  const user: User = {
    email: data.email,
    nickname: data.nickname,
    avatar_url: data.avatar_url,
    created_at: data.created_at,
    uuid: data.uuid,
  };

  return user;
}