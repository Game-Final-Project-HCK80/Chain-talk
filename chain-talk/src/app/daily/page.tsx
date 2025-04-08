"use client";
import { useState, useEffect } from "react";
import { DailyProvider } from "@daily-co/daily-react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import VideoCall from "@/components/videoCall";
import VoiceCall from "@/components/voiceCall";
import Link from "next/link";

export default function DailyPage() {
  const [call, setCall] = useState<DailyCall | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [callType, setCallType] = useState<"video" | "voice" | null>(null);

  useEffect(() => {
    if (!call) {
      const newCall = DailyIframe.createCallObject();
      setCall(newCall);
    }
  }, [call]);

  const createRoom = async () => {
    const codeRoom = "Testing";
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"/api/create-vc", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ codeRoom })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setRoomUrl(data.roomUrl);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  return (
    <DailyProvider callObject={call}>
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-gray-100 p-4">
        {!callType ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Start a Call</h1>
            <button className="btn btn-primary mr-2" onClick={() => { createRoom(); setCallType("video"); }}>
              Start Video Call
            </button>
            <button className="btn btn-secondary" onClick={() => { createRoom(); setCallType("voice"); }}>
              Start Voice Call
            </button>
            <Link 
              href={"https://chain-talk.daily.co/6JYcIa1FPjywvRiMza0e"}
              className="btn btn-secondary">
              JOIN Call
            </Link>

            
          </div>
        ) : callType === "video" ? (
          <VideoCall roomUrl={roomUrl} />
        ) : (
          <VoiceCall roomUrl={roomUrl} />
        )}
      </div>
    </DailyProvider>
  );
}
