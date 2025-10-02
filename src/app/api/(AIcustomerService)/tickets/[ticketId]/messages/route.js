import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { senderRole, content } = await req.json(); // senderRole: "agent" or "user"
    if (!content) return new Response(JSON.stringify({ error: "No content" }), { status: 400 });

    const p = await params;
    const ticketId = p.ticketId;
    console.log(ticketId)
    const ticketsCol = dbConnect("supportTickets");
    const ticket = await ticketsCol.findOne({ ticketId });
    if (!ticket) return new Response(JSON.stringify({ error: "Ticket not found" }), { status: 404 });

    const db = dbConnect("users");
    const agent = await db.findOne({ email: session.user.email, role: "support_agent" });
    const user = await db.findOne({ email: session.user.email });

    // Authorization rules:
    if (senderRole === "support_agent") {
      if (!agent) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
      if (!(agent.role === "ceo" || agent.role === "support_agent" || agent._id.toString() === ticket.assignedAgentId?.toString() || agent.district === ticket.district)) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
      }
    } else if (senderRole === "user" || senderRole === "rider") {
      if (!user) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
      if (!ticket.userId || ticket.userId.toString() !== user._id.toString()) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
      }
    } else {
      return new Response(JSON.stringify({ error: "Invalid senderRole" }), { status: 400 });
    }

    const senderId = (agent && agent._id) || (user && user._id) || null;
    const message = {
      senderRole,
      senderId,
      content,
      timestamp: new Date(),
    };

    await ticketsCol.updateOne(
      { ticketId },
      {
        $push: { messages: message },
        $set: { updatedAt: new Date() }
      }
    );

    // Optionally: return the appended message
    return new Response(JSON.stringify({ ok: true, message }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
