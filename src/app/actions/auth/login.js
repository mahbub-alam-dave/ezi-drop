"use server"
import { collectionNames, dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt"

export const loginUser = async (loginData) => {
    const {email, password} = loginData;
    
    // check if user exist
    const isExistUser = await dbConnect(collectionNames.users).findOne({email})
    console.log(isExistUser)

    if(!isExistUser) {
        console.log("user not exist")
        return null
    }

    const isPasswordMatch = await bcrypt.compare(password, isExistUser.password)

    if(!isPasswordMatch) return null

    return isExistUser
}