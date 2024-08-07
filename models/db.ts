import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; // 导入UUID生成库

let supabaseClient: SupabaseClient | null = null; // 声明类型并初始化为 null

export async function getDb(): Promise<SupabaseClient> {
  if (!supabaseClient) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL or Anon Key is missing from environment variables.');
      }

      // 初始化 Supabase 客户端
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      throw error; // 重新抛出错误，以便调用者可以处理
    }
  }

  return supabaseClient;
}