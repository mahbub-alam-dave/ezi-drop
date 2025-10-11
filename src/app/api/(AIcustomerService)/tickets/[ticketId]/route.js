import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const p = await params

    const ticketId = p.ticketId; // e.g. "ezi-tik-001"
    const ticketsCol = dbConnect("supportTickets");
    const ticket = await ticketsCol.findOne({ ticketId });

    if (!ticket) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

    // Determine caller role:
    const db = dbConnect("users");

    const agent = await db.findOne({ email: session.user.email, role: "district_admin" });
    const user = await db.findOne({ email: session.user.email });

    // Authorization:
    if (agent) {
      // allow if agent assigned to same district OR agent.role is 'admin'/'ceo'
      if (agent.role === "ceo" || agent.role === "district_admin" || agent.district === ticket.district) {
        return new Response(JSON.stringify({ ticket }), { headers: { "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    } else if (user) {
      // allow if ticket.userId matches user._id
      if (ticket.userId && ticket.userId.toString() === user._id.toString()) {
        return new Response(JSON.stringify({ ticket }), { headers: { "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}


export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    // const { status } = await req.json(); // "Resolved", "Closed", etc.
    // const { ticketId } = await req.json();
    const ticketId = params.ticketId;

    const ticketInfo = await dbConnect("supportTickets").findOne({ticketId})

    const agent = await dbConnect("users").findOne({ email: session.user.email, role: "district_admin", district: ticketInfo.district });

    // only agent or admin can change status
    if (!agent) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });

    // update
    await dbConnect("supportTickets").updateOne(
      { ticketId },
      { $set: { status: "resolved", updatedAt: new Date() } }
    );

    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

