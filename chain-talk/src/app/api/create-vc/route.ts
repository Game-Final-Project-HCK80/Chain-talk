import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { codeRoom } = await req.json();

  if (!process.env.DAILY_API_KEY) {
    return NextResponse.json({ error: "Missing DAILY_API_KEY" }, { status: 500 });
  }

  try {
    // Cek apakah room sudah ada
    const checkResponse = await fetch(`https://api.daily.co/v1/rooms/${codeRoom}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
    });

    if (checkResponse.ok) {
      // Jika room sudah ada, hapus room tersebut
      await fetch(`https://api.daily.co/v1/rooms/${codeRoom}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
        },
      });
    }

    // Buat room baru
    const createResponse = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: codeRoom,
        properties: {
          exp: Math.floor(Date.now() / 1000) + 3600, // Expire in 1 hour
          enable_screenshare: true,
          enable_chat: true,
        },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      return NextResponse.json({ error }, { status: createResponse.status });
    }

    const data = await createResponse.json();
    return NextResponse.json({ roomUrl: data.url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}