'use client';

import { useEffect, useRef, useState } from 'react';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sound/bgm.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch((e) => {
        // Auto-play might be blocked until user interaction
        console.warn('Audio play blocked:', e.message);
      });
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <button
      onClick={toggleMute}
      className="text-white text-lg ml-4 bg-purple-700 px-3 py-1 rounded-full hover:bg-purple-900 transition"
    >
      {isMuted ? '🔇 Unmute' : '🔊 Mute'}
    </button>
  );
}
