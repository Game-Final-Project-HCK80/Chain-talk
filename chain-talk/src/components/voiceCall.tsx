"use client";
import { useDaily } from "@daily-co/daily-react";
import CallControls from "./callControls";
import { useEffect } from "react";

export default function VoiceCall({ roomUrl }: { roomUrl: string | null }) {
  const call = useDaily();

  useEffect(() => {
    if (!call || !roomUrl) return;

    call.join({ url: roomUrl });

    return () => {
      call.leave();
    };
  }, [call, roomUrl]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-semibold">Voice Call Active</p>
      {call && <CallControls call={call} />}
    </div>
  );
}
