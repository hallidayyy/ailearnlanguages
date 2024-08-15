import { findUserByEmail, insertUser } from "@/models/user";

import { User } from "@/types/user";

/**
 * Saves a user to the database if the user does not already exist.
 * @param user - The user object to be saved.
 */
export async function saveUser(user: User) {
  try {
    const existUser = await findUserByEmail(user.email);
    if (!existUser) {
      await insertUser(user);
    }
  } catch (e) {
    console.log("save user failed: ", e);
  }
}
