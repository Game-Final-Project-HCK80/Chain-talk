"use client"

import { DailyCall } from "@daily-co/daily-js";

export default function CallControls({ call }: { call: DailyCall }) {
    return (
      <div className="flex space-x-4 mt-4">
        <button className="btn btn-error" onClick={() => {
          call.leave()

          console.log(call.participantCounts(), "counttttttttttt");

          // if (call.participantCounts() === null) {
          //   call.destroy();
          // }
        }}>End Call</button>
        <button className="btn btn-accent" onClick={() => call.setLocalAudio(!call.localAudio())}>
          Toggle Mute
        </button>
      </div>
    );
  }
  