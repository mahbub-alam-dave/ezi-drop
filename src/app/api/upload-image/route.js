import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { image } = await req.json();

    if (!image) return NextResponse.json({ error: "No image" }, { status: 400 });

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMAGE_UPLOAD_KEY}`,
      {
        method: "POST",
        body: new URLSearchParams({ image }),
      }
    );

    const data = await response.json();

    if (!data.success) return NextResponse.json({ error: "ImgBB upload failed" }, { status: 500 });

    return NextResponse.json({ url: data.data.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}