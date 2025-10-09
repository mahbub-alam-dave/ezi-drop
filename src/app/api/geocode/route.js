// app/api/geocode/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) return NextResponse.json({ error: "Address required" }, { status: 400 });

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

    const response = await fetch(url, {
      headers: { "User-Agent": "SmartCourierApp/1.0 (abdulahlim1100@gmail.com)" },
    });

    const data = await response.json();

    if (!data || data.length === 0)
      return NextResponse.json({ error: "No location found" }, { status: 404 });

    return NextResponse.json({
      lat: data[0].lat,
      lon: data[0].lon,
      display_name: data[0].display_name,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch coordinates" }, { status: 500 });
  }
}
