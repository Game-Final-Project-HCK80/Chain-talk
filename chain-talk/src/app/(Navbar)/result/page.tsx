"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ResultType {
  rank: number;
  username: string;
  profileImage: string;
  score: number;
}

const mockResults: ResultType[] = [
  { rank: 1, username: "Player1", profileImage: "/1.png", score: 20 },
  { rank: 2, username: "Player2", profileImage: "/2.png", score: 18 },
  { rank: 3, username: "Player3", profileImage: "/3.png", score: 15 },
  { rank: 4, username: "Player4", profileImage: "/4.png", score: 10 },
];

export default function ResultPage() {
  const [results] = useState<ResultType[]>(mockResults);

  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return (
        <Image
          src="/1.png"
          alt="Rank 1"
          width={40}
          height={40}
          className="drop-shadow-xl"
        />
      );
    } else if (rank === 4) {
      return (
        <span className="text-red-400 text-lg font-bold flex items-center gap-1">
          4 ( Loser )
        </span>
      );
    }
    return <span className="text-white text-lg font-bold">{rank}</span>;
  };
  
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1c002d] via-[#32004a] to-[#56006f] py-16 px-4 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-5xl font-extrabold text-yellow-300 drop-shadow-[0_4px_10px_rgba(255,255,0,0.3)] mb-10"
      >
        🎉 Game Results
      </motion.h1>

      <div className="max-w-5xl mx-auto overflow-x-auto rounded-3xl p-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
        <table className="min-w-full table-auto text-sm md:text-base">
          <thead>
            <tr className="text-left text-yellow-200 uppercase border-b border-yellow-500/50">
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Player</th>
              <th className="py-3 px-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <motion.tr
                key={result.rank}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={clsx(
                  "transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]",
                  index === 0 && "bg-yellow-400/10",
                  index === 1 && "bg-gray-300/10",
                  index === 2 && "bg-orange-400/10",
                  index === 3 && "bg-gray-400/10"
                )}
              >
                <td className="py-3 px-4">{getRankDisplay(result.rank)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <Image
                        src={result.profileImage}
                        alt={`Profile of ${result.username}`}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="font-semibold">{result.username}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-pink-300 font-bold">{result.score}</td>
              </motion.tr>
            ))}
            
          </tbody>
        </table>
        
      </div>
      <motion.p
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.6 }}
  className="text-center text-lg md:text-xl font-medium text-white mb-8 mt-10"
>
  Selamat kepada <span className="text-yellow-300 font-bold">Player1</span> atas pencapaian luar biasa sebagai juara pertama! 🥇 Anda mendapatkan <span className="text-green-400 font-bold">+1 poin</span>.  
  <br />
  Sayangnya, <span className="text-pink-300 font-bold">Player4</span> berada di posisi terakhir dan kehilangan <span className="text-red-400 font-bold">-1 poin</span>. Tetap semangat!
</motion.p>

    </main>
  );
}
