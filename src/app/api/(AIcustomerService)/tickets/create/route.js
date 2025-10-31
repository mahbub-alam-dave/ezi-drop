import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";


// for ticket Id (serially)
async function getNextTicketId() {
  const hex = new ObjectId().toHexString();
  const num = parseInt(hex.substring(0, 6), 16); // take timestamp part
  return `ezi-tik-${String(num % 1000).padStart(3, "0")}`;
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  try {
    
    const db = dbConnect("supportTickets")
    const { subject } = await req.json();


    const user = await dbConnect("users").findOne({email: session.user.email})

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "You are not a valid user" }),
        { status: 400 }
      );
    }

    // check if already an open ticket
    const existing = await db.findOne({
      userId: new ObjectId(user._id),
      status: { $ne: "resolved"}
    });

    if (existing) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You already have an active support ticket."
        }),
        { status: 400 }
      );
    }

    const ticketId = await getNextTicketId();

    const agent = await dbConnect("users").findOne({role: "district_admin", districtId: user.districtId})


    const newTicket = await db.insertOne({
      ticketId,
      userId: user._id,
      status: "open",
      district: agent.district,
      districtId: agent.districtId,
      assignedAgentEmail: agent.email,
      assignedAgentId: agent._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
            senderRole: user.role,
            senderId: user._id,
            content: subject,
            timestamp: new Date(),
        }
      ]
    });

    return new Response(
      JSON.stringify({ success: true, ticket: newTicket }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating ticket:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
