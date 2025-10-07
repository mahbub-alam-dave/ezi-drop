import { NextResponse } from "next/server";

let currentRating = 4;

// 📥 GET: রেটিং ফেচ করা
export async function GET() {
  return NextResponse.json({ success: true, rating: currentRating });
}

// 📤 POST: নতুন রেটিং সেভ করা
export async function POST(req) {
  const body = await req.json();
  const { rating } = body;

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ success: false, message: "Invalid rating" }, { status: 400 });
  }

  currentRating = rating;
  return NextResponse.json({ success: true, rating: currentRating });
}
