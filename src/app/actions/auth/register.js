"use server"
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
}