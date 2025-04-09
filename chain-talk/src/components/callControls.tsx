"use client";

import { DailyCall } from "@daily-co/daily-js";

export default function CallControls({
  call,
  roomUrl,
  onLeave,
}: {
  call: DailyCall;
  roomUrl: string;
  onLeave?: () => Promise<void>;
}) {
  const handleEndCall = async () => {
    await call.leave();

    try {
      await fetch("/api/destroy-vc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomUrl }),
      });
      console.log("Room destroyed");
    } catch (err) {
      console.error("Failed to destroy room:", err);
    }
  };

  return (
    <div className="flex space-x-4 mt-4">
      <button className="btn btn-error" onClick={handleEndCall}>
        End Call
      </button>
      <button
        className="btn btn-accent"
        onClick={() => call.setLocalAudio(!call.localAudio())}
      >
        Toggle Mute
      </button>
    </div>
  );
}
