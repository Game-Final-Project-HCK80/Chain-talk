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
        toast.error((err as Error).message);
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
    <main className="relative w-full h-screen overflow-hidden text-white">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 py-10 space-y-8">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-center drop-shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Chain<span className="text-yellow-300">Talk</span>
        </motion.h1>

        <motion.p
          className="text-center max-w-2xl text-lg md:text-2xl text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Tantang temanmu menyambung kata secara cepat & kreatif. Sambungkan kata... atau kalah!
        </motion.p>

        {profile && (
          <Link href="/info-rank">
            <motion.div
              className="flex flex-col items-center gap-4 mt-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={badgeImage}
                alt="User Rank Badge"
                className="w-32 h-32 md:w-48 md:h-48 object-contain rounded-2xl shadow-2xl border-4 border-white"
              />
              <p className="text-xl font-semibold">Points: {point}</p>
            </motion.div>
          </Link>
        )}

        {!profile && !loading && (
          <p className="text-white/70 text-sm italic">
            Please login to see your Rank and play the game.
          </p>
        )}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href="/play-game"
            className="inline-block px-10 py-4 bg-yellow-400 text-purple-900 font-bold text-lg rounded-full shadow-xl hover:bg-yellow-300 transition-colors duration-300"
          >
            Play Game
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
