import dbConnect from "@/lib/dbConnect";


// for ticket Id (serially)
async function getNextTicketId() {
  const hex = new ObjectId().toHexString();
  const num = parseInt(hex.substring(0, 6), 16); // take timestamp part
  return `ezi-tik-${String(num % 1000).padStart(3, "0")}`;
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
  try {
    
    const db = dbConnect("supportTickets")
    const body = await req.json();
    const { subject, userDistrict } = body;

    const user = dbConnect("users").findOne({email: session.user.email})

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "You are not a valid user" }),
        { status: 400 }
      );
    }

    // check if already an open ticket
    const existing = await db.findOne({
      userId: user._id,
      status: { $ne: "resolved" }
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

    const agent = await dbConnect("users").findOne({role: "support_agent", district: userDistrict})

    const newTicket = await db.create({
      ticketId,
      userId: user._id,
      status: "open",
      district: userDistrict,
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
