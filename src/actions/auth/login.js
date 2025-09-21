import { collectionNames, dbConnect } from "@/lib/dbConnect";

export const loginUser = async (loginData) => {
    const {email, password} = loginData;
    
    // check if user exist
    const isExistUser = await dbConnect(collectionNames.users).findOne({email})

    if(!isExistUser) {
        return null
    }

    const isPasswordMatch = await bcrypt.compare(password, isExistUser.password)

    if(!isPasswordMatch) return null

    return isExistUser
}