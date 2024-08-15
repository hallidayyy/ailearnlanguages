import { findUserByEmail, findUserByID, insertUser } from "@/models/user";
import { respData, respErr } from "@/lib/resp";

import { User } from "@/types/user";
import { currentUser } from "@clerk/nextjs";
import { genUuid } from "@/lib";


export async function POST(req: Request) {
  const user = await currentUser();
  // console.log("current user:" +user);
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return respErr("not login");
  }

  try {
    const email = user.emailAddresses[0].emailAddress;
    const nickname = user.firstName;
    const avatarUrl = user.imageUrl;
    const existUser = await findUserByEmail(email);
    const user_id = existUser?.id;
    

    console.log("user id"+existUser?.id)
    console.log("existuser is null"+existUser?.avatar_url)

    let userInfo: User = {
      id: user_id as number,
      email: email,
      nickname: nickname || "",
      avatar_url: avatarUrl,
   

    };
    console.error(userInfo);

    console.error("existUser "+existUser);
    if (existUser) {
      userInfo.id = existUser.id;
      console.error("userInfo id " + userInfo.id);
    } else {
      console.error("get user info insert here.");
      await insertUser(userInfo);
    }


    return respData(userInfo);
  } catch (e) {
    console.error("get user info failed!", e);
    return respErr("get user info failed");
  }
}