/* "use server"
import { collectionNames, dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt"

export const registerUser = async (registerData) => {
    const {name, email, password} = registerData;

    if (!email || ! password) {
        return
    }

    // check user availability
    const isUserExist = await dbConnect(collectionNames.users).findOne({email: registerData.email})

    if(!isUserExist){
        const newRegisteredUser = {...registerData, role: "user", createdAt: new Date(),
        updatedAt: new Date()}
        const hashedPassword = await bcrypt.hash(password, 10);
        newRegisteredUser.password = hashedPassword;
        const result = await dbConnect(collectionNames.users).insertOne(newRegisteredUser)

        const uiConfirmation = {
            acknowledged: result.acknowledged,
            insertedId: result.insertedId.toString()
        }

    return {
    acknowledged: result.acknowledged,
    insertedId: result.insertedId.toString(),
    }
    
    }

    else {
        return
    }
} */

"use server";

import { collectionNames, dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt";

export const registerUser = async (registerData) => {
  const { name, email, password } = registerData;

  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  const users = dbConnect("users");
  const userReferral = dbConnect("referraluser"); // ✅ ensure this is defined in collectionNames

  // 1️⃣ Check if user already exists
  const isUserExist = await users.findOne({ email });
  if (isUserExist) {
    return { success: false, message: "User already exists." };
  }

  // 2️⃣ Check referral info
  const referralData = await userReferral.findOne({ referredEmail: email });

  // Default points for any new user
  let newUserPoints = 100;
  let referrerRewardPoints = 0;
  let referralStatus = "no_referral";

  // 3️⃣ Handle valid referral
  if (referralData) {
    const now = new Date();
    const isExpired = now > new Date(referralData.expireDate);

    if (!isExpired) {
      // Referral is valid
      referralStatus = "referral_success";
      newUserPoints = 100; // referred user gets 100 pts
      referrerRewardPoints = 50; // referrer gets 50 pts

      console.log("referral is in time")

      // ✅ Update referrer’s points
      const referrer = await users.findOne({ email: referralData.referrerEmail });
      if (referrer) {
        const currentPoints = referrer.points || 0;
        await users.updateOne(
          { email: referralData.referrerEmail },
          { $set: { updatedAt: new Date() }, $inc: { points: referrerRewardPoints } }
        );
      }
    } else {
      // Referral expired
      referralStatus = "referral_expired";
      newUserPoints = 100; // referred user still gets points
      referrerRewardPoints = 0; // referrer gets none
    }

    // ✅ Mark referral as "used"
    await userReferral.updateOne(
      { referredEmail: email },
      { $set: { joinedAt: new Date(), isJoined: true, referralStatus } }
    );
  }

  // 4️⃣ Register new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    name,
    email,
    password: hashedPassword,
    role: "user",
    points: newUserPoints,
    referralStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await users.insertOne(newUser);

  return {
    success: true,
    message:
      referralStatus === "referral_success"
        ? `Registered successfully! You earned ${newUserPoints} points and your referrer got ${referrerRewardPoints} points.`
        : referralStatus === "referral_expired"
        ? "Registered successfully! You earned 100 points (referral expired)."
        : "Registered successfully! You earned 100 points.",
    acknowledged: result.acknowledged,
    insertedId: result.insertedId.toString(),
  };
};
