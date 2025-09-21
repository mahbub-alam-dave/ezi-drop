import { collectionName, dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt"

export const registerUser = async (registerData) => {
    const {name, email, password} = registerData;

    if (!email || ! password) {
        return
    }

    // check user availability
    const isUserExist = await dbConnect(collectionName.users).findOne({email: registerData.email})

    if(!isUserExist){
        const hashedPassword = await bcrypt.hash(password, 10);
        registerData.password = hashedPassword;
        const result = await dbConnect(collectionNames.users).insertOne(registerData)

        const uiConfirmation = {
            acknowledged: result.acknowledged,
            insertedId: result.insertedId.toString()
        }

        return uiConfirmation
    }

    else {
        return
    }
}