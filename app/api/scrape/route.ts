import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith("http")) {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://api.microlink.io?url=${encodeURIComponent(url)}`
    );

    const json = await res.json();

    if (!json.status || !json.data) {
      return NextResponse.json(
        { error: "Metadata not available" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      title: json.data.title || "",
      image_url: json.data.image?.url || "",
    });
  } catch (err) {
    console.error("Microlink error:", err);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
