"use client";
import { useEffect, useRef } from "react";
import { useDaily } from "@daily-co/daily-react";
import CallControls from "./callControls";

export default function VideoCall({ roomUrl }: { roomUrl: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const call = useDaily();

  useEffect(() => {
    if (!call || !roomUrl) return;

    call.join({ url: roomUrl });

    call.on("track-started", (event) => {
      if (event.track.kind === "video" && videoRef.current) {
        videoRef.current.srcObject = new MediaStream([event.track]);
      }
    });

    return () => {
      call.leave();
    };
  }, [call, roomUrl]);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-full max-w-2xl border rounded-lg" autoPlay playsInline />
      {call && <CallControls call={call} />}
    </div>
  );
}
