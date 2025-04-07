'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { UserType } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [point, setPoint] = useState(0);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile`, {
          credentials: "include",
        });

        if (res.status === 401) {
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error("please login first");

        const data = await res.json();
        setProfile(data);
        setPoint(data.point);
      } catch (err) {
        toast.error((err as Error).message); // hanya error selain 401
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const getImageByPoint = (points: number) => {
    if (points >= 0 && points < 10) return "/bronze.png";
    if (points >= 10 && points < 20) return "/silver.png";
    if (points >= 20 && points < 30) return "/gold.png";
    if (points >= 30 && points < 40) return "/platinum.png";
    if (points >= 40 && points < 50) return "/diamond.png";
    return "/master.png";
  };

  const badgeImage = getImageByPoint(point);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 text-white flex flex-col items-center justify-center px-4">
      <motion.p
        className="text-center max-w-2xl text-lg md:text-xl mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Tantang temanmu menyambung kata secara cepat & kreatif. Sambungkan kata... atau kalah!
      </motion.p>

      {profile && (
        <div className="flex flex-col items-center gap-4 mt-10">
          <img
            src={badgeImage}
            alt="User Rank Badge"
            className="w-60 h-60 object-contain rounded-xl shadow-2xl"
          />
          <p className="text-2xl font-bold">Points: {point}</p>
        </div>
      )}

      {!profile && !loading && (
        <p className="mt-6 text-white text-sm opacity-80">
          Please login to see your level and play the game.
        </p>
      )}

      <div className="mt-10">
        <motion.button
          className="btn btn-primary text-lg px-6 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/play-game">Play Game</Link>
        </motion.button>
      </div>
    </main>
  );
}
