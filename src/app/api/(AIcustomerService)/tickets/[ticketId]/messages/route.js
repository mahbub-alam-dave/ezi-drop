// /app/api/tickets/[ticketId]/messages/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { senderRole, content } = await req.json();
    if (!content) return new Response(JSON.stringify({ error: "No content" }), { status: 400 });

    const p = await params;
    const ticketId = p.ticketId;
    
    const ticketsCol = dbConnect("supportTickets");
    const ticket = await ticketsCol.findOne({ ticketId });
    
    if (!ticket) return new Response(JSON.stringify({ error: "Ticket not found" }), { status: 404 });

    const db = dbConnect("users");
    const user = await db.findOne({ email: session.user.email });

    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 403 });

    // Authorization rules
    let isAuthorized = false;

    if (senderRole === "main_admin" || senderRole === "admin") {
      // Main admin can reply to any ticket
      isAuthorized = (user.role === 'main_admin' || user.role === 'admin');
    } else if (senderRole === "district_admin") {
      // District admin can reply if:
      // 1. It's their district
      // 2. They are assigned to the ticket
      // 3. They are mentioned in the ticket
      isAuthorized = user.role === 'district_admin' && (
        user.district === ticket.district ||
        (ticket.assignedAgentId && ticket.assignedAgentId.toString() === user._id.toString()) ||
        ticket.mentionedRoles === 'main_admin' // Can participate if admin is mentioned
      );
    } else if (senderRole === "user" || senderRole === "rider") {
      // User/Rider can only reply to their own tickets
      isAuthorized = ticket.userId && ticket.userId.toString() === user._id.toString();
    } else {
      return new Response(JSON.stringify({ error: "Invalid senderRole" }), { status: 400 });
    }

    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    // Create message object
    const message = {
      senderRole,
      senderId: new ObjectId(user._id),
      senderName: user.name || user.email,
      content,
      timestamp: new Date(),
    };

    // Build update object
    const updateMessage = {
      $push: { messages: message },
      $set: { updatedAt: new Date() }
    };

    // Status management
    if (senderRole === "district_admin" || senderRole === "main_admin" || senderRole === "admin") {
      // Agent/Admin replies → set status to in_progress (only if currently open)
      if (ticket.status === "open") {
        updateMessage.$set.status = "in_progress";
      }
      
      // If main admin replies, mark as handled by admin
      if (senderRole === "main_admin" || senderRole === "admin") {
        updateMessage.$set.handledByAdmin = true;
        updateMessage.$set.adminId = new ObjectId(user._id);
      }
    } else if (senderRole === "user" || senderRole === "rider") {
      // User replies → if ticket was resolved, reopen it
      if (ticket.status === "resolved") {
        updateMessage.$set.status = "open";
      }
    }

    // Update ticket
    await ticketsCol.updateOne({ ticketId }, updateMessage);

    // Return the appended message
    return new Response(
      JSON.stringify({ 
        ok: true, 
        message: {
          ...message,
          senderId: message.senderId.toString()
        }
      }), 
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}