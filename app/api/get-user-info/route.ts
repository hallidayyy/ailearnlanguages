import { findUserByEmail, findUserByID, insertUser } from "@/models/user";
import { respData, respErr } from "@/lib/resp";
import { User } from "@/types/user";
import { currentUser } from "@clerk/nextjs";



export async function POST(req: Request) {
  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return respErr("not login");
  }

  try {
    const email = user.emailAddresses[0].emailAddress;
    const nickname = user.firstName;
    const avatarUrl = user.imageUrl;
    const existUser = await findUserByEmail(email);
    const user_id = existUser?.id;

    let userInfo: User = {
      id: user_id as number,
      email: email,
      nickname: nickname || "",
      avatar_url: avatarUrl,
    };

    if (existUser) {
      userInfo.id = existUser.id;
    } else {
      await insertUser(userInfo);
    }
    return respData(userInfo);
  } catch (e) {
    return respErr("get user info failed");
  }
}