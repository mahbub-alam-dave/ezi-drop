// /api/chat/route.js
import { dbConnect } from "@/lib/dbConnect";
import OpenAI from "openai";

// Initialize OpenAI client
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Local FAQ database
const faqResponses = {
  "where is my parcel": "Your parcel is on its way! Please check the tracking page for updates.",
  "how long does delivery take": "Delivery usually takes 2-5 business days depending on your location.",
  "what are your working hours": "Our working hours are Monday-Friday, 9am to 6pm.",
};

// Detect parcel query like "check my parcel ezi-drop-001"
function extractParcelId(message) {
  const regex = /(ezi-drop-\d+)/i;
  const match = message.match(regex);
  return match ? match[1] : null;
}


export async function POST(req) {
  try {
    const { message } = await req.json();
    const lower = message.toLowerCase().trim();

    const db = dbConnect("CustomerServiceChat");

    let reply = "";

    // const trackMatch = lower.match(/track parcel #?(\d+)/);

    const parcelId = extractParcelId(lower)
    if(parcelId) {
      const order = await dbConnect("parcels").findOne({trackingId: parcelId})

      if(order) {
reply = `Your parcel #${parcelId} status: ${order.status}. For full details, please [go to live tracking](https://yourapp.com/tracking/${parcelId}).`;      }
      else {
        reply = `Sorry, parcel #${parcelId} not found`
      }
    }

    // Check FAQs
        for(const key in faqResponses) {
      if(lower.includes(key)) {
        reply = faqResponses[key]
      }
    }


    // 3️⃣ Fallback to OpenAI
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

    // 4️⃣ Save conversation in MongoDB
    await db.insertOne({
      message,
      reply,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });


  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ reply: "⚠️ Sorry, something went wrong." }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}



// { role: "system", content: "You are a customer support bot for EziDrop Courier. Answer questions about parcel tracking, delivery times, and services clearly and politely." }

