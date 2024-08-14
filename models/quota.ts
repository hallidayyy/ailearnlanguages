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