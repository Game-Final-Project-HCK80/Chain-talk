'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { UserType } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

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

  const getLevel = (points: number) =>
    points >= 0 && points < 10 ? 1 :
      points >= 10 && points < 20 ? 2 :
        points >= 20 && points < 30 ? 3 :
          points >= 30 && points < 40 ? 4 :
            points >= 40 && points < 50 ? 5 : 6;

  const level = getLevel(point);

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
        <div className="mt-10 flex items-center gap-3">
          {level === 1 ? (
            <LevelCard level="1" color="text-red-300" image="/bronze.png" />
          ) : level === 2 ? (
            <LevelCard level="2" color="text-green-300" image="/silver.png" />
          ) : level === 3 ? (
            <LevelCard level="3" color="text-yellow-300" image="/gold.png" />
          ) : level === 4 ? (
            <LevelCard level="4" color="text-red-300" image="/platinum.png" />
          ) : level === 5 ? (
            <LevelCard level="5" color="text-red-300" image="/diamond.png" />
          ) : (
            <LevelCard level="6" color="text-red-300" image="/master.png" />
          )}
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

function LevelCard({ level, color, image }: { level: string, color: string, image: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`${color}`}>🌟 Level {level}</span>
      <Image src={image} alt={`Level ${level}`} width={100} height={100} />
    </div>
  );
}
