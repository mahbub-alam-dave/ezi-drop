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
