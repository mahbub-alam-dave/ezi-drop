// /api/chat/route.js
const faqResponses = {
  "where is my parcel": "Your parcel is on its way! Please check the tracking page for updates.",
  "how long does delivery take": "Delivery usually takes 2-5 business days depending on your location.",
  "what are your working hours": "Our working hours are Monday-Friday, 9am to 6pm.",
};

export async function POST(req) {
  const { message } = await req.json();
  const lower = message.toLowerCase().trim();

  // Check local FAQs first
  for (const key in faqResponses) {
    if (lower.includes(key)) {
      return new Response(JSON.stringify({ reply: faqResponses[key] }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Fallback to OpenAI if no FAQ match
  try {
    const OpenAI = require("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful support assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ reply: "⚠️ Sorry, something went wrong." }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}


// { role: "system", content: "You are a customer support bot for EziDrop Courier. Answer questions about parcel tracking, delivery times, and services clearly and politely." }

