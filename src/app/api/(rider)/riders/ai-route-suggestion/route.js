import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const body = await req.json();
  const { parcelId, start, end } = body;

  // 1️⃣ Get possible routes from Google Directions API
/*   const directionsRes = await fetch(
    `https://maps.googleapis.com/maps/api/directions/json?origin=${start.lat},${start.lon}&destination=${end.lat},${end.lon}&alternatives=true&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  const data = await directionsRes.json();
  console.log("Google Directions API routes:", data.routes.length);
console.log("Sample route:", data.routes[0]);

  const routes = data.routes.map((r, i) => ({
    id: i,
    summary: r.summary,
    distance: r.legs[0].distance.text,
    duration: r.legs[0].duration.text,
    polyline: r.overview_polyline.points,
  })); */

const directionsRes = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&alternatives=true&geometries=polyline`
    );
    const data = await directionsRes.json();

    if (!data.routes || data.routes.length === 0) {
      return NextResponse.json(
        { error: "No routes available to evaluate." },
        { status: 404 }
      );
    }

    // ✅ 2️⃣ Format routes (similar to Google output)
    const routes = data.routes.map((r, i) => ({
      id: i,
      summary: `Route ${i + 1}`,
      distance: (r.distance / 1000).toFixed(2) + " km",
      duration: Math.round(r.duration / 60) + " min",
      polyline: r.geometry,
    }));


  // 2️⃣ Ask LLM to re-rank routes
const prompt = `
You are a smart logistics route planner for Ezi Drop's delivery riders.
You are given multiple possible routes between a start and end location.
Each route includes summary, distance, and duration.

Your job:
- Choose the best route for the rider.
- Consider distance, duration, road quality, safety (urban vs rural), traffic congestion likelihood, and fuel efficiency.
- Prefer safer and faster routes, even if slightly longer.
- Avoid areas that are congested or unsafe at night.
- Explain the reasoning clearly but briefly (1–2 sentences).

Return your answer in strict JSON format:
{
  "bestRouteId": number,
  "reason": string,
  "advice": string
}

Here are the routes:
${JSON.stringify(routes, null, 2)}
`;

    const llmRes = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: prompt },
        ],
      });

let content = llmRes.choices[0].message.content.trim();

content = content.replace(/```json/g, "").replace(/```/g, "").trim();

let parsed;
try {
  parsed = JSON.parse(content);
} catch (err) {
  console.error("Failed to parse LLM response:", content);
  throw new Error("Invalid JSON response from LLM");
}

const { bestRouteId, reason } = parsed;

const bestRoute = routes.find((r) => r.id === bestRouteId);
const enrichedBestRoute = {
  ...bestRoute,
  start,
  end,
};

  return NextResponse.json({ 
  bestRoute: enrichedBestRoute,
  reason,
  advice: parsed.advice || "",});
}
