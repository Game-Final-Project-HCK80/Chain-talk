import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { roomUrl } = await req.json();

  if (!roomUrl) {
    return NextResponse.json({ error: "Missing roomUrl" }, { status: 400 });
  }

  const roomName = new URL(roomUrl).pathname.split("/").pop(); // Ambil nama room dari URL

  try {
    const res = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }

    return NextResponse.json({ message: "Room destroyed successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
