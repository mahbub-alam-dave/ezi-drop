import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ObjectId } from "mongodb";

export async function GET(req) {

const session = await getServerSession(authOptions)

/* const url = new URL(req.url);
const fromDistrictId = url.searchParams.get("fromDistrictId"); */



const districtAdminData = await dbConnect("users").findOne({_id: new ObjectId(session?.user?.userId)})

  if(!districtAdminData || districtAdminData.role !== "district_admin") {
    return NextResponse.json({ success: false, message: "Parcel not found" },
        { status: 404 })
  }

  const fromDistrictId = districtAdminData.districtId;


  const transfers = dbConnect("transfers");
  const results = await transfers
    .find({ fromDistrictId, status: { $in: ["requested", "dispatched"] } })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ transfers: results });
}
