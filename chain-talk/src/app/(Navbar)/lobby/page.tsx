"use client";

import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";

type Player = {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
};

type RoomType = {
  id?: string;
  codeRoom: string;
  hostId: string;
  roomUrl: string;
  status: string;
  players: Player[];
  answer: string[];
};

export default function LobbyPage() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("/api/lobby");
        const json = await res.json();

        if (json.success) {
          setRooms(json.data);
        } else {
          console.error("Gagal fetch rooms:", json.message);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 px-6 py-12">
      <div className="w-full max-w-7xl">
        <h1 className="text-5xl font-bold text-white text-center mb-4 drop-shadow-lg">
          🎮 Game Lobby
        </h1>
        <p className="text-white text-center text-lg mb-10 opacity-90">
          Join a room and challenge your friends in real-time!
        </p>

        {loading ? (
          <p className="text-white text-center">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p className="text-white text-center">No rooms available 😔</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {rooms.map((room) => (
              <div
                key={room.codeRoom}
                className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300 group"
              >
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-purple-500 to-pink-500"></div>

                <h2 className="text-2xl font-semibold text-white mb-2">
                  {room.codeRoom}
                </h2>
                <div className="flex items-center gap-2 text-white opacity-80">
                  <Users size={20} />
                  <span>{room.players.length} / 4 players</span>
                </div>

                <button className="mt-6 w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-md hover:shadow-pink-300 transition duration-300">
                  🚀 Join Room
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
