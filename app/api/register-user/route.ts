import { insertUser } from "@/models/user";
import { respData, respErr } from "@/lib/resp";
import { User } from "@/types/user";
import { currentUser } from "@clerk/nextjs";



export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return respErr("User not found");
    }

    const email = user.emailAddresses[0].emailAddress;
    const nickname = user.username || "";
    const avatarUrl = user.imageUrl || "";

    let userInfo: User = {
      id: 0,
      email: email,
      nickname: nickname,
      avatar_url: avatarUrl,
    };

    // 如果 `insertUser` 返回 `User` 对象
    const insertedUser = await insertUser(userInfo);

    // 从返回的 `User` 对象中提取 `id`
    userInfo.id = insertedUser.id;

    return respData(userInfo);
  } catch (e) {
    console.error("Error while handling user registration:", e);
    return respErr("Failed to handle user registration.");
  }
}