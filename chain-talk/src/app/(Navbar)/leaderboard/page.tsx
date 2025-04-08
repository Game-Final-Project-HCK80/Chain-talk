"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";
import { UserType } from "@/types";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();

        if (data.success) {
          const sortedUsers = data.data.sort((a: UserType, b: UserType) => b.point - a.point);
          setUsers(sortedUsers);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankDisplay = (index: number) => {
    if (index < 4) {
      return (
        <Image
          src={`/${index + 1}.png`}
          alt={`Rank ${index + 1}`}
          width={40}
          height={40}
          className="drop-shadow-xl"
        />
      );
    }
    return <span className="text-white text-lg font-bold">{index + 1}</span>;
  };
  

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1c002d] via-[#32004a] to-[#56006f] py-16 px-4 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-5xl font-extrabold text-yellow-300 drop-shadow-[0_4px_10px_rgba(255,255,0,0.3)] mb-10"
      >
        🏆 Leaderboard
      </motion.h1>

      <div className="max-w-5xl mx-auto overflow-x-auto rounded-3xl p-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
        {loading ? (
          <p className="text-center text-lg text-white/80 animate-pulse">Loading leaderboard...</p>
        ) : (
          <table className="min-w-full table-auto text-sm md:text-base">
            <thead>
              <tr className="text-left text-yellow-200 uppercase border-b border-yellow-500/50">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4">Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                return (
                  <motion.tr
                    key={index}
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
                    <td className="py-3 px-4">{getRankDisplay(index)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                          <Image
                            src={
                              user.picture && !user.picture.endsWith('.svg')
                                ? user.picture
                                : "/default-avatar.png"
                            }
                            alt={user.username}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="font-semibold">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-pink-300 font-bold">{user.point}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
