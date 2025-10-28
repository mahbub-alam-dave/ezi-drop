import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { parcelId, start, end } = body;

  // 1️⃣ Get possible routes from Google Directions API
  const directionsRes = await fetch(
    `https://maps.googleapis.com/maps/api/directions/json?origin=${start.lat},${start.lon}&destination=${end.lat},${end.lon}&alternatives=true&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  const data = await directionsRes.json();
  const routes = data.routes.map((r, i) => ({
    id: i,
    summary: r.summary,
    distance: r.legs[0].distance.text,
    duration: r.legs[0].duration.text,
    polyline: r.overview_polyline.points,
  }));

  // 2️⃣ Ask LLM to re-rank routes
  const prompt = `
  You are an intelligent route planner for delivery riders.
  Given multiple routes with distance, duration, and summary, choose the most efficient and safe one.
  Consider traffic conditions, total distance, and congestion likelihood.
  Respond in JSON format:
  { "bestRouteId": number, "reason": string }
  
  Routes: ${JSON.stringify(routes)}
  `;

  const llmRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const llmData = await llmRes.json();
  const { bestRouteId, reason } = JSON.parse(llmData.choices[0].message.content);

  const bestRoute = routes.find((r) => r.id === bestRouteId);

  return NextResponse.json({ bestRoute, reason });
}
