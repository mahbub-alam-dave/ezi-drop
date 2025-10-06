// /app/api/agent/tickets/route.js
import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // "Open" or null

  try {
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the agent record for this user
    const agent = await dbConnect("users").findOne({
      email: session.user.email,
    });

    if (!agent) {
      return new Response(
        JSON.stringify({ error: "You are not registered as an agent." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

  let query = {
    district: agent.district,
    assignedAgentId: new ObjectId(agent._id)
  };
  if (status) {
    query.status = status;
  }

    // Fetch tickets only for agent's district
    const tickets = await dbConnect("supportTickets")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

      // const agentSideData = {...tickets, agentRole: agent.role}

    return new Response(JSON.stringify({ tickets, role: agent.role }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
