"use client";
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDaily } from "@daily-co/daily-react";
import CallControls from "./callControls";

export default function VideoCall({ roomUrl }: { roomUrl: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const call = useDaily();
  const router = useRouter();

  const leaveCall = useCallback(async () => {
    if (!call) return;

    await call.leave();

    try {
      const response = await fetch("/api/destroy-vc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomUrl }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Error ending room:", err);
      }
    } catch (error) {
      console.error("Error calling end-room API:", error);
    }

    router.push("/lobby");
  }, [call, roomUrl, router]);

  useEffect(() => {
    if (!call || !roomUrl) return;

    call.join({ url: roomUrl });

    const handleTrackStarted = (event: any) => {
      if (event.track.kind === "video" && videoRef.current) {
        videoRef.current.srcObject = new MediaStream([event.track]);
      }
    };

    const handleLeftMeeting = () => {
      console.log("Left meeting event received");
      router.push("/lobby");
    };

    call.on("track-started", handleTrackStarted);
    call.on("left-meeting", handleLeftMeeting);

    return () => {
      call.off("track-started", handleTrackStarted);
      call.off("left-meeting", handleLeftMeeting);
      call.leave();
    };
  }, [call, roomUrl, router]);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-full max-w-2xl border rounded-lg" autoPlay playsInline />
      {call && roomUrl && <CallControls call={call} roomUrl={roomUrl} onLeave={leaveCall} />}
    </div>
  );
}