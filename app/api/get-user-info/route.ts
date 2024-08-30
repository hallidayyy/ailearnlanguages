import { findUserByEmail } from "@/models/user";
import { respData, respErr } from "@/lib/resp";
import { User } from "@/types/user";
import { currentUser } from "@clerk/nextjs";

export async function POST(req: Request) {
  const user = await currentUser();
  
  // 确保获取到了当前用户信息，并且用户有有效的邮箱地址
  if (!user || user.emailAddresses.length === 0 || !user.emailAddresses[0].emailAddress) {
    return respErr("User not logged in or invalid email address.");
  }

  try {
    const email = user.emailAddresses[0].emailAddress;
    const nickname = user.username || ""; // 使用空字符串作为默认值
    const avatarUrl = user.imageUrl || ""; // 使用空字符串作为默认值
    
    // 查找数据库中是否已有该用户
    const existUser = await findUserByEmail(email);

    if (existUser) {
      const userInfo: User = {
        id: existUser.id,
        email: email,
        nickname: nickname,
        avatar_url: avatarUrl,
      };
      return respData(userInfo);
    } else {
      return respErr("User not found.");
    }
  } catch (e) {
    console.error("Error while processing user information:", e);
    return respErr("Failed to process user information.");
  }
}