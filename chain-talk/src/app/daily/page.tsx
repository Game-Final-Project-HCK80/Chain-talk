"use client";
import { useState, useEffect } from "react";
import { DailyProvider } from "@daily-co/daily-react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import VideoCall from "@/components/videoCall";
import VoiceCall from "@/components/voiceCall";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function DailyPage() {
  const [call, setCall] = useState<DailyCall | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [callType, setCallType] = useState<"video" | "voice" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!call) {
      const newCall = DailyIframe.createCallObject();
      setCall(newCall);
    }
  }, [call]);

  const createRoom = async () => {
    const codeRoom = `Room-${Date.now()}`; // Nama room unik
    try {
      const res = await fetch("/api/create-vc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codeRoom }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create room");
      setRoomUrl(data.roomUrl); // Simpan URL room ke state
      toast.success("Room created successfully!");
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room. Check console for details.");
    }
  };

  const handleStartCall = async (type: "video" | "voice") => {
    setLoading(true);
    await createRoom();
    setCallType(type);
    setLoading(false);
  };

  return (
    <DailyProvider callObject={call}>
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-gray-100 p-4">
        {loading ? (
          <p className="text-xl font-medium">Creating room...</p>
        ) : callType === "video" && roomUrl ? (
          <VideoCall roomUrl={roomUrl} />
        ) : callType === "voice" && roomUrl ? (
          <VoiceCall roomUrl={roomUrl} />
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Start a Call</h1>
            <button className="btn btn-primary mr-2" onClick={() => handleStartCall("video")}>
              Start Video Call
            </button>
            <button className="btn btn-secondary mr-2" onClick={() => handleStartCall("voice")}>
              Start Voice Call
            </button>
            <Link href="https://chain-talk.daily.co/6JYcIa1FPjywvRiMza0e" className="btn btn-outline">
              Join Existing Call
            </Link>
          </div>
        )}
      </div>
    </DailyProvider>
  );
}