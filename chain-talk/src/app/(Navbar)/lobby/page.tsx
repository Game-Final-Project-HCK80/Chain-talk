'use client';

import React, { useEffect, useState } from "react";
import { Users, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
    <main className="min-h-screen bg-gradient-to-br from-[#1e002f] via-[#42005c] to-[#70009b] py-12 px-4 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-5xl font-extrabold text-center mb-8 text-yellow-300 drop-shadow-[0_5px_10px_rgba(255,255,0,0.3)]"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🎮 Game Lobby
        </motion.h1>

        <motion.p
          className="text-center text-white/80 mb-12 text-base max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Bergabunglah ke dalam ruang permainan dan tantang temanmu dalam permainan seru dan kompetitif!
        </motion.p>

        {loading ? (
          <p className="text-white text-center text-lg animate-pulse">🔄 Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <motion.p
            className="text-white text-center text-xl opacity-80 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            😔 Belum ada room tersedia.<br />
            <span className="text-pink-300">Ayo buat room baru dan undang temanmu!</span>
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
            {rooms.map((room, i) => (
              <motion.div
                key={room.codeRoom}
                className="bg-white/5 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-6 text-center shadow-[0_0_20px_4px_rgba(170,0,255,0.3)] hover:shadow-[0_0_30px_6px_rgba(255,0,200,0.5)] transition-all duration-300 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Floating glowing border effect */}
                <div className="absolute -top-1 -left-1 w-full h-full rounded-[inherit] border border-purple-400/40 blur-lg opacity-10 pointer-events-none" />

                <h2 className="text-3xl font-black text-white mb-2 tracking-widest drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]">
                  {room.codeRoom}
                </h2>

                {room.players.find((p) => p.id === room.hostId) && (
                  <div className="flex items-center justify-center gap-1 text-yellow-300 mb-3 text-sm font-semibold tracking-wide">
                    <Crown size={16} />
                    Host
                  </div>
                )}

                <div className="flex justify-center items-center gap-2 text-white/70 text-sm mb-5">
                  <Users size={20} />
                  <span>{room.players.length} / 4 players</span>
                </div>

                <button
                  className="cursor-pointer w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-700 text-white font-bold shadow-lg hover:from-pink-600 hover:to-purple-800 transition duration-300 hover:scale-[1.02]"
                  onClick={() => router.push(`/room/${room.codeRoom}`)}
                >
                  🚀 Join Room
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
