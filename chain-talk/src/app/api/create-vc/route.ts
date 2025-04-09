import { NextResponse } from "next/server";

export type RoomType = {
  roomCode: string
}

export async function POST(req: Request) {
  console.log(process.env.DAILY_API_KEY);
  console.log(process.env.MONGO_URI);
  
  
  const { codeRoom } = await req.json();

  try {
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: codeRoom,
        properties: {
          exp: Math.floor(Date.now() / 1000) + 3600, // Expire dalam 1 jam
          enable_screenshare: true,
          enable_chat: true,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ roomUrl: data.url }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
