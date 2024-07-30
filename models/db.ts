import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; // 导入UUID生成库

let supabaseClient;

export async function getDb() {
  if (!supabaseClient) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase URL or Anon Key is missing from environment variables.");
      }

      console.log("Supabase URL:", supabaseUrl);
      console.log("Supabase Anon Key:", supabaseAnonKey);

      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

      // 插入测试记录
      const testEmail = `test_${Date.now()}@example.com`; // 生成一个唯一的测试邮箱
      const testUuid = uuidv4(); // 生成一个唯一的UUID
      const { data: insertData, error: insertError } = await supabaseClient
        .from('users')
        .insert([{ email: testEmail, uuid: testUuid }]);

      if (insertError) {
        throw new Error(`Insert test record failed: ${insertError.message}`);
      }
      console.log("Insert test record succeeded:", insertData);

      // 查询测试记录
      const { data: queryData, error: queryError } = await supabaseClient
        .from('users')
        .select('email')
        .eq('email', testEmail)
        .single();

      if (queryError) {
        throw new Error(`Query test record failed: ${queryError.message}`);
      }
      console.log("Query test record succeeded:", queryData);
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error);
      throw error; // 重新抛出错误，以便调用者可以处理
    }
  }

  //console.log("Returning supabaseClient:", supabaseClient);
  return supabaseClient;
}