// /app/api/tickets/[ticketId]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const p = await params;
    const ticketId = p.ticketId;
    const ticketsCol = dbConnect("supportTickets");
    const ticket = await ticketsCol.findOne({ ticketId });

    if (!ticket) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

    const db = dbConnect("users");
    const user = await db.findOne({ email: session.user.email });

    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 403 });

    // Authorization based on role
    let isAuthorized = false;

    if (user.role === 'main_admin' || user.role === 'admin') {
      // Main admin can access all tickets
      isAuthorized = true;
    } else if (user.role === 'district_admin') {
      // District admin can access tickets in their district or if assigned
      isAuthorized = 
        user.district === ticket.district ||
        (ticket.assignedAgentId && ticket.assignedAgentId.toString() === user._id.toString());
    } else if (user.role === 'user' || user.role === 'rider') {
      // User/Rider can only access their own tickets
      isAuthorized = ticket.userId && ticket.userId.toString() === user._id.toString();
    }

    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    // Get assigned agent info if exists
    let assignedAgent = null;
    if (ticket.assignedAgentId) {
      assignedAgent = await db.findOne(
        { _id: new ObjectId(ticket.assignedAgentId) },
        { projection: { name: 1, email: 1, role: 1 } }
      );
    }

    return new Response(
      JSON.stringify({ 
        ticket,
        assignedAgent,
        currentUserRole: user.role,
        currentUserId: user._id.toString()
      }), 
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const ticketId = params.ticketId;
    const body = await req.json();
    const { status, priority, assignToAdmin, mentionAdmin } = body;

    const ticketsCol = dbConnect("supportTickets");
    const ticket = await ticketsCol.findOne({ ticketId });

    if (!ticket) return new Response(JSON.stringify({ error: "Ticket not found" }), { status: 404 });

    const user = await dbConnect("users").findOne({ email: session.user.email });

    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 403 });

    // Authorization check
    let canUpdate = false;

    if (user.role === 'main_admin' || user.role === 'admin') {
      canUpdate = true;
    } else if (user.role === 'district_admin') {
      canUpdate = user.district === ticket.district ||
                  (ticket.assignedAgentId && ticket.assignedAgentId.toString() === user._id.toString());
    }

    if (!canUpdate) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    // Build update object
    const updateObj = { updatedAt: new Date() };

    // Update status if provided
    if (status) {
      updateObj.status = status;
    }

    // Update priority if provided (only admins can change priority)
    if (priority && (user.role === 'main_admin' || user.role === 'admin' || user.role === 'district_admin')) {
      updateObj.priority = priority;
    }

    // Assign to main admin
    if (assignToAdmin === true && user.role === 'district_admin') {
      // Find main admin
      const mainAdmin = await dbConnect("users").findOne({ role: 'main_admin' });
      if (mainAdmin) {
        updateObj.assignedAgentId = new ObjectId(mainAdmin._id);
        updateObj.mentionedRoles = 'main_admin';
        
        // Add system message about escalation
        await ticketsCol.updateOne(
          { ticketId },
          {
            $push: {
              messages: {
                senderRole: 'system',
                senderId: null,
                content: `Ticket escalated to main admin by ${user.name || user.email}`,
                timestamp: new Date()
              }
            }
          }
        );
      }
    }

    // Mention admin (without assigning)
    if (mentionAdmin === true && user.role === 'district_admin') {
      if (!ticket.mentionedRoles || !ticket.mentionedRoles.includes('main_admin')) {
        updateObj.mentionedRoles = 'main_admin';
        
        // Add system message
        await ticketsCol.updateOne(
          { ticketId },
          {
            $push: {
              messages: {
                senderRole: 'system',
                senderId: null,
                content: `Main admin mentioned by ${user.name || user.email} - Attention needed`,
                timestamp: new Date()
              }
            }
          }
        );
      }
    }

    // Update ticket
    await ticketsCol.updateOne(
      { ticketId },
      { $set: updateObj }
    );

    return new Response(
      JSON.stringify({ ok: true, updated: updateObj }), 
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}