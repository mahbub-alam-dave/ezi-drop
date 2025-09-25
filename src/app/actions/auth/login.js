"use server"
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt";


export async function loginUser({ username, password }) {

  const users = dbConnect("users");

  const user = await users.findOne({ email: username });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // 1. Check lock
  if (user.lockUntil && user.lockUntil > new Date()) {
    throw new Error("Account locked. Try again later.");
  }

  // 2. Validate password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    let update = { $inc: { failedLoginAttempts: 1 } };

    if ((user.failedLoginAttempts || 0) + 1 >= 5) {
      update = {
        $set: {
          failedLoginAttempts: 0,
          lockUntil: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes lock
        },
      };
    }

    await users.updateOne({ _id: user._id }, update);
    throw new Error("Invalid credentials");
  }

  // 3. Successful login → reset lock
  await users.updateOne(
    { _id: user._id },
    { $set: { failedLoginAttempts: 0, lockUntil: null } }
  );

  // 4. Return user object to NextAuth
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    emailVerified: user.emailVerified,
    image: user.image || null,
  };
}



/* import { collectionNames, dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt"

export const loginUser = async (loginData) => {
    const {email, password} = loginData;
    
    // check if user exist
    const isExistUser = await dbConnect(collectionNames.users).findOne({email})
    console.log(isExistUser)

    if(isExistUser) {
        await dbConnect(collectionNames.users).updateOne({_id: isExistUser._id},{$set: {updatedAt: new Date()}})
    }

    if(!isExistUser) {
        console.log("user not exist")
        return null
    }

    const isPasswordMatch = await bcrypt.compare(password, isExistUser.password)

    if(!isPasswordMatch) return null

    return isExistUser
} */