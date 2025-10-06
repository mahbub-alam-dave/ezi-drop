import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";


export async function GET(req) {
    
    const session = await getServerSession(authOptions)

       if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  
    try {
    const user = await dbConnect("users").findOne({email: session.user.email})

    if (!user) return new Response(JSON.stringify({ error: "User Not found" }), { status: 404 });

    // const { userId } = params;

    const tickets = await dbConnect("supportTickets").find({ userId: new ObjectId(user._id) }).sort({ createdAt: -1 }).toArray();

    return new Response(JSON.stringify({ success: true, tickets, role: user.role }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch tickets" }),
      { status: 500 }
    );
  }
}
