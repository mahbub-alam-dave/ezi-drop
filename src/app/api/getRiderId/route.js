import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";

export async function GET(req) {
  try {
    // Logged-in user session 
    const session = await getServerSession(authOptions);

    console.log("Session object:", session); //  session

    if (!session) {
      console.log("No session found");
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
    }

    const userEmail = session.user.email;

    console.log("Logged-in user email:", userEmail); // user email

    const ridersCollection = await dbConnect("rider-applications");

    // applicantEmail 
    const rider = await ridersCollection.findOne({ applicantEmail: userEmail });

    if (!rider) {
      console.log("Rider not found for email:", userEmail);
      return new Response(JSON.stringify({ success: false, error: "Rider not found" }), { status: 404 });
    }

    console.log("Rider found:", rider);

    return new Response(JSON.stringify({ success: true, riderId: rider._id }), { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
