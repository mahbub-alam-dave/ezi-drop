import { dbConnect } from "./dbConnect";

export async function districtsData() {
    const allDistricts = await dbConnect("districts").find().toArray();
    return allDistricts;
}