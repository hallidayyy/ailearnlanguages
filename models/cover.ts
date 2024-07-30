import { Cover } from "@/types/cover";
import { getDb } from "./db"; // 确保 getDb 返回的是 Supabase 客户端实例

export async function insertCover(cover: Cover) {
  const supabase: SupabaseClient = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { data, error } = await supabase
    .from("covers")
    .insert([
      {
        user_email: cover.user_email,
        img_description: cover.img_description,
        img_size: cover.img_size,
        img_url: cover.img_url,
        llm_name: cover.llm_name,
        llm_params: cover.llm_params,
        created_at: cover.created_at,
        uuid: cover.uuid,
        status: cover.status,
      },
    ]);

  if (error) {
    throw error;
  }

  return data;
}

export async function getCoversCount(): Promise<number> {
  const supabase: SupabaseClient = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { count, error } = await supabase
    .from("covers")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count;
}

export async function getUserCoversCount(user_email: string): Promise<number> {
  const supabase: SupabaseClient = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { count, error } = await supabase
    .from("covers")
    .select("*", { count: "exact", head: true })
    .eq("user_email", user_email);

  if (error) {
    throw error;
  }

  return count;
}

export async function findCoverById(id: number): Promise<Cover | undefined> {
  const supabase: SupabaseClient = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { data, error } = await supabase
    .from("covers")
    .select(
      "id, user_email, img_description, img_size, img_url, llm_name, llm_params, created_at, uuid, status, users!inner(uuid, email, nickname, avatar_url)"
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    return;
  }

  return formatCover(data);
}

export async function findCoverByUuid(
  uuid: string
): Promise<Cover | undefined> {
  const supabase: SupabaseClient = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { data, error } = await supabase
    .from("covers")
    .select(
      "id, user_email, img_description, img_size, img_url, llm_name, llm_params, created_at, uuid, status, users!inner(uuid, email, nickname, avatar_url)"
    )
    .eq("uuid", uuid)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    return;
  }

  return formatCover(data);
}

export async function getRandCovers(
  page: number,
  limit: number
): Promise<Cover[]> {
  if (page <= 0) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const supabase = getDb();
  const { data, error } = await supabase
    .from("covers")
    .select(
      "id, user_email, img_description, img_size, img_url, llm_name, llm_params, created_at, uuid, status, users!inner(uuid, email, nickname, avatar_url)"
    )
    .eq("status", 1)
    .order("random()")
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return getCoversFromSqlResult(data);
}

export async function getCovers(page: number, limit: number): Promise<Cover[]> {
  if (page < 1) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const supabase: SupabaseClient = await getDb();

  // 验证supabase对象
  if (!supabase || typeof supabase.from !== 'function') {
    throw new Error("Supabase client is not properly initialized.");
  }
  const { data, error } = await supabase
    .from("covers")
    .select(
      "id, user_email, img_description, img_size, img_url, llm_name, llm_params, created_at, uuid, status, users!inner(uuid, email, nickname, avatar_url)"
    )
    .eq("status", 1)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return getCoversFromSqlResult(data);
}

export function getCoversFromSqlResult(data: any[]): Cover[] {
  if (!data || data.length === 0) {
    return [];
  }

  const covers: Cover[] = [];
  data.forEach((row) => {
    const cover = formatCover(row);
    if (cover) {
      covers.push(cover);
    }
  });

  return covers;
}

export function formatCover(row: any): Cover | undefined {
  let cover: Cover = {
    id: row.id,
    user_email: row.user_email,
    img_description: row.img_description,
    img_size: row.img_size,
    img_url: row.img_url,
    llm_name: row.llm_name,
    llm_params: row.llm_params,
    created_at: row.created_at,
    uuid: row.uuid,
    status: row.status,
  };

  if (row.users) {
    cover.created_user = {
      email: row.users.email,
      nickname: row.users.nickname,
      avatar_url: row.users.avatar_url,
      uuid: row.users.uuid,
    };
  }

  try {
    cover.llm_params = JSON.parse(JSON.stringify(cover.llm_params));
  } catch (e) {
    console.log("parse cover llm_params failed: ", e);
  }

  return cover;
}