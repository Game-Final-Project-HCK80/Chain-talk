"use client";
import { useEffect, useRef } from "react";
import { useDaily } from "@daily-co/daily-react";

export default function VideoCall({ roomUrl }: { roomUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const call = useDaily();

  useEffect(() => {
    console.log("Room URL:", roomUrl);
    console.log("Call object:", call);

    if (!call || !roomUrl) {
      console.error("Call object or room URL is missing");
      return;
    }

    call
      .join({
        url: roomUrl,
        audioSource: true,
        videoSource: true,
      })
      .then(() => {
        console.log("Successfully joined the room");
      })
      .catch((error) => {
        console.error("Failed to join the room:", error);
      });

    call.on("joined-meeting", () => {
      console.log("Successfully joined the meeting");
    });

    call.on("track-started", (event) => {
      console.log("Track started:", event);
      if (event.track.kind === "video") {
        if (videoRef.current) {
          videoRef.current.srcObject = new MediaStream([event.track]);
          console.log("Video stream set to videoRef:", videoRef.current.srcObject);
        } else {
          console.error("videoRef.current is null");
        }
      }
    });

    return () => {
      call.leave();
    };
  }, [call, roomUrl]);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-full h-full rounded-lg" autoPlay playsInline />
    </div>
  );
}
