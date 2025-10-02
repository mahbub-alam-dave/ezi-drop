// /api/chat/route.js
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import OpenAI from "openai";

// Initialize OpenAI client
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Local FAQ database
const faqResponses = {
  "where is my parcel": "Your parcel is on its way! Please check the tracking page for updates.",
  "how long does delivery take": "Delivery usually takes 2-5 business days depending on your location.",
  "what are your working hours": "Our working hours are Monday-Friday, 9am to 6pm.",
};

const agentKeywords = ["complaint", "damaged", "refund", "cancel", "lose", "lost", "issue"];

// Detect parcel query like "check my parcel ezi-drop-001"
function extractParcelId(message) {
  const regex = /(ezi-drop-\d+)/i;
  const match = message.match(regex);
  return match ? match[1] : null;
}

const districts = [
  "Bagerhat","Bandarban","Barguna","Barisal","Bhola","Bogra","Brahmanbaria","Chandpur","Chapai Nawabganj",
  "Chattogram","Chuadanga","Cox's Bazar","Cumilla","Dhaka","Dinajpur","Faridpur","Feni","Gaibandha",
  "Gazipur","Gopalganj","Habiganj","Jamalpur","Jashore","Jhalokati","Jhenaidah","Joypurhat","Khagrachhari",
  "Khulna","Kishoreganj","Kurigram","Kushtia","Lakshmipur","Lalmonirhat","Madaripur","Magura","Manikganj",
  "Meherpur","Moulvibazar","Munshiganj","Mymensingh","Naogaon","Narail","Narayanganj","Narsingdi",
  "Natore","Netrokona","Nilphamari","Noakhali","Pabna","Panchagarh","Patuakhali","Pirojpur","Rajbari",
  "Rajshahi","Rangamati","Rangpur","Satkhira","Shariatpur","Sherpur","Sirajganj","Sunamganj","Sylhet",
  "Tangail","Thakurgaon"
];

function detectDistrict(text) {
  const lower = text.toLowerCase();
  return districts.find(d => lower.includes(d.toLowerCase())) || null;
}


// for ticket Id (serially)
async function getNextTicketId() {
  const counter = await dbConnect("counters").findOneAndUpdate(
    { _id: "supportTickets" },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  );

  const seqNumber = counter.value?.seq || 1;
  return `ezi-tik-${seqNumber.toString().padStart(3, "0")}`;
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  try {
    const { conversationId, message } = await req.json();
    const db = dbConnect("CustomerServiceChat");

    // add user message to conversation
    await db.updateOne(
      { _id: new ObjectId(conversationId) },
      {
        $push: {
          messages: {
            role: "user",
            content: message,
            timestamp: new Date(),
          },
        },
      }
    );

    let reply = "";
    const lower = message.toLowerCase().trim();
    const needsAgent = agentKeywords.some((word) => lower.includes(word));

    // ---------------- Agent Handover ----------------

if (needsAgent) {
  if (!session) {
    reply = "⚠️ Please login to get support from our agents.";
  } else {
    const user = await dbConnect("users").findOne({
      email: session.user.email,
    });

    let district = user?.district || null;
    const ticketId = await getNextTicketId()

    if (!district) {
      // Try detecting from current message
      const detected = detectDistrict(message);

      if (detected) {
        // Save detected district to user
        await dbConnect("users").updateOne(
          { _id: user._id },
          { $set: { district: detected } }
        );


        // Find agent for that district
        const agent = await dbConnect("users").findOne({ district: detected });


        if (agent) {
          await dbConnect("supportTickets").insertOne({
            userId: user._id,
            conversationId: new ObjectId(conversationId),
            ticketId,
            message,
            district: detected,
            assignedAgentEmail: agent.email,
            assignedAgentId: agent._id,
            status: "Open",
            createdAt: new Date(),
            updatedAt: new Date(),
            agentReply: "",
          });

          reply = `✅ I’ve updated your profile with district **${detected}** and connected you to the **${detected} support agent**. Please wait...`;
        } else {
          reply = `⚠️ No agent found for ${detected}. Our central support team will assist you soon.`;
        }
      } else {
        // Could not detect district
        reply = "⚠️ To connect you with the right agent, please type your district (e.g., Dhaka, Khulna).";
      }
    } else {
      // User already has district → find agent
      const agent = await dbConnect("users").findOne({ district });
      if (agent) {
        await dbConnect("supportTickets").insertOne({
          userId: user._id,
          conversationId: new ObjectId(conversationId),
          ticketId,
          message,
          district,
          assignedAgentId: agent._id,
          status: "Open",
          createdAt: new Date(),
          updatedAt: new Date(),
          agentReply: "",
        });

        reply = `✅ I’m connecting you to our **${district} support agent**. Please wait...`;
      } else {
        reply = `⚠️ Sorry, no agent found for ${district}. Our support team will reach you soon.`;
      }
    }
  }
}

// --- EXTRA: District Detection Outside Agent Keywords ---
if (!reply && session) {
  const detected = detectDistrict(message);
  if (detected) {
    // Update user profile with district
    await dbConnect("users").updateOne(
      { email: session.user.email },
      { $set: { district: detected } }
    );

    reply = `✅ I’ve updated your profile with district **${detected}**. Now, if you need help with issues like *refund, complain, damage*, I’ll connect you directly to the **${detected} support agent**.`;
  }
}


    // ---------------- Parcel Tracking ----------------
    if (!reply) {
      const parcelId = extractParcelId(lower);
      if (parcelId) {
        const order = await dbConnect("parcels").findOne({ trackingId: parcelId });
        if (order) {
          reply = `Your parcel #${parcelId} status: ${order.status}. For full details, please [go to live tracking](https://ezi-drop.vercel.app/tracking/${parcelId}).`;
        } else {
          reply = `❌ Sorry, parcel #${parcelId} not found.`;
        }
      }
    }

    // ---------------- FAQ ----------------
    if (!reply) {
      for (const key in faqResponses) {
        if (lower.includes(key)) {
          reply = faqResponses[key];
          break;
        }
      }
    }

    // ---------------- OpenAI Fallback ----------------
    if (!reply) {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful support assistant for a courier and delivery service." },
          { role: "user", content: message },
        ],
      });
      reply = response.choices[0].message.content;
    }

    // Save bot reply
    await db.updateOne(
      { _id: new ObjectId(conversationId) },
      {
        $push: {
          messages: {
            role: "bot",
            content: reply,
            timestamp: new Date(),
          },
        },
      }
    );

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ reply: "⚠️ Sorry, something went wrong." }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

/* 
{
"name":"Shamim Hossen",
"email": "agentjhenaidah@ezidrop.com",
"password":"$2b$10$XW/QHHFe7TbqKA5cCT0c5e5OfFJiVVRW6xVsNT8F3Dhtdc29M5oy2",
"role": "support_agent",
"district": "Jhenaidah",
"createdAt":{"$date":{"$numberLong":"1758632734086"}},
"updatedAt":{"$date":{"$numberLong":"1758890539171"}},
"providers":[{"provider":"credentials"}],
"emailVerified":true,
"failedLoginAttempts":{"$numberInt":"0"},
"lockUntil":null
}


{
"name":"Abul Bashar",
"email":"abulbashar@gmail.com",
"password":"$2b$10$XW/QHHFe7TbqKA5cCT0c5e5OfFJiVVRW6xVsNT8F3Dhtdc29M5oy2",
"role":"rider",
"createdAt":{"$date":{"$numberLong":"1758632734086"}},
"updatedAt":{"$date":{"$numberLong":"1759242673191"}},
"providers":[{"provider":"credentials"}],
"emailVerified":true,
"failedLoginAttempts":{"$numberInt":"0"},
"lockUntil":null,
"delivery_district":"Dhaka"
"working_status": "duty" (vacation)
}
*/
