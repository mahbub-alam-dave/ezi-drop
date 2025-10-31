// /app/api/support-agent/tickets/route.js
import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // "open", "in_progress", "resolved", null
  const districtId = searchParams.get("districtId"); // For main admin filtering
  const priority = searchParams.get("priority"); // "high", "medium", "low"
  const mentionedAdmin = searchParams.get("mentionedAdmin"); // "true" to show only tickets mentioning admin

  try {
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the user record
    const user = await dbConnect("users").findOne({
      email: session.user.email,
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check role authorization
    const allowedRoles = ['district_admin', 'main_admin', 'admin'];
    if (!allowedRoles.includes(user.role)) {
      return new Response(
        JSON.stringify({ error: "You don't have permission to view tickets" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build query based on role
    let query = {};

    if (user.role === 'district_admin') {
      // District admin: Only their district tickets
      query.district = user.district;
      // Only show tickets assigned to them or unassigned in their district
      query.$or = [
        { assignedAgentId: new ObjectId(user._id) },
        { assignedAgentId: { $exists: false } },
        { assignedAgentId: null }
      ];
    } else if (user.role === 'main_admin' || user.role === 'admin') {
      // Main admin: All tickets or filter by district
      if (districtId && districtId !== 'all') {
        query.district = districtId;
      }
      // If mentionedAdmin=true, only show tickets where admin is mentioned
      if (mentionedAdmin === 'true') {
        query.mentionedRoles = 'main_admin';
      }
    }

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Add priority filter if provided
    if (priority) {
      query.priority = priority;
    }

    // Fetch tickets with sorting
    const tickets = await dbConnect("supportTickets")
      .find(query)
      .sort({ 
        // High priority first, then by updatedAt
        priority: -1,
        updatedAt: -1 
      })
      .toArray();

    // Get total counts for stats
    const stats = await dbConnect("supportTickets").aggregate([
      {
        $match: user.role === 'district_admin' 
          ? { district: user.district }
          : (districtId && districtId !== 'all' ? { district: districtId } : {})
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    const statusCounts = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      total: 0
    };

    stats.forEach(s => {
      statusCounts[s._id] = s.count;
      statusCounts.total += s.count;
    });

    // Count tickets mentioning admin (only for main admin)
    let mentionedCount = 0;
    if (user.role === 'main_admin' || user.role === 'admin') {
      mentionedCount = await dbConnect("supportTickets").countDocuments({
        mentionedRoles: 'main_admin',
        status: { $ne: 'resolved' }
      });
    }

    return new Response(
      JSON.stringify({ 
        tickets, 
        role: user.role,
        district: user.district,
        stats: statusCounts,
        mentionedCount
      }), 
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error fetching tickets:", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}