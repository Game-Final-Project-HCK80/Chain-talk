import React from 'react';
import { Users } from 'lucide-react';

const mockRooms = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Room ${i + 1}`,
    players: Math.floor(Math.random() * 10) + 1,
    maxPlayers: 10,
}));

export default function LobbyPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 px-6 py-12">
            <div className="w-full max-w-7xl">
                <h1 className="text-5xl font-bold text-white text-center mb-4 drop-shadow-lg">🎮 Game Lobby</h1>
                <p className="text-white text-center text-lg mb-10 opacity-90">Join a room and challenge your friends in real-time!</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                    {mockRooms.map((room) => (
                        <div
                            key={room.id}
                            className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300 group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-purple-500 to-pink-500"></div>

                            <h2 className="text-2xl font-semibold text-white mb-2">{room.name}</h2>
                            <div className="flex items-center gap-2 text-white opacity-80">
                                <Users size={20} />
                                <span>{room.players} / {room.maxPlayers} players</span>
                            </div>

                            <button className="mt-6 w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-md hover:shadow-pink-300 transition duration-300">
                                🚀 Join Room
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
