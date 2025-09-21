import { collectionNames, dbConnect } from "@/lib/dbConnect"
import { NextResponse } from "next/server";

export const GET = async (req) => {
    const result = await dbConnect(collectionNames.users).find().toArray();
    return NextResponse.json(result)
}