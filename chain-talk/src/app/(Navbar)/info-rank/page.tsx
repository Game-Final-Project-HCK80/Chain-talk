'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type RankInfo = {
  name: string;
  range: string;
  image: string;
  description: string;
};

const ranks: RankInfo[] = [
  {
    name: 'Bronze',
    range: '0 - 9',
    image: '/bronze.png',
    description: 'Rank awal bagi petarung pemula yang baru memulai petualangan.',
  },
  {
    name: 'Silver',
    range: '10 - 19',
    image: '/silver.png',
    description: 'Sudah mulai panas! Kamu sudah menunjukkan potensi yang luar biasa.',
  },
  {
    name: 'Gold',
    range: '20 - 29',
    image: '/gold.png',
    description: 'Pengalamanmu bersinar terang—kamu pemain sejati!',
  },
  {
    name: 'Platinum',
    range: '30 - 39',
    image: '/platinum.png',
    description: 'Kamu adalah pemain elite yang ditakuti lawan-lawanmu.',
  },
  {
    name: 'Diamond',
    range: '40 - 49',
    image: '/diamond.png',
    description: 'Langka dan berkilau—hanya sedikit yang bisa mencapai titik ini.',
  },
  {
    name: 'Master',
    range: '50+',
    image: '/master.png',
    description: 'Sang legenda! Tak tertandingi dan selalu berada di puncak.',
  },
];

export default function InfoRankPage() {
  const [selectedRank, setSelectedRank] = useState<RankInfo | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1e002f] via-[#42005c] to-[#70009b] py-12 px-4 text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-5xl font-extrabold text-center mb-8 text-yellow-300 drop-shadow-[0_5px_10px_rgba(255,255,0,0.3)]"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🌟 Rank Information
        </motion.h1>

        <motion.p
          className="text-center text-white/80 mb-12 text-base max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Dalam setiap pertandingan, hanya yang terbaik yang layak naik peringkat. Dapatkan <span className="text-yellow-300 font-semibold">+1 poin</span> jika kamu menjadi juara pertama, tapi hati-hati—jika kamu berada di posisi terakhir, <span className="text-red-400 font-semibold">-1 poin</span> akan mengintaimu! Tidak di posisi puncak maupun dasar? Tenang, poinmu aman. Semakin tinggi rank, semakin besar kebanggaan dan prestasi yang kamu raih di setiap permainan!
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {ranks.map((rank, index) => (
            <motion.div
              key={rank.name}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center shadow-2xl hover:scale-105 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ rotate: [0, 2, -2, 0] }}
              onClick={() => setSelectedRank(rank)}
            >
              <img
                src={rank.image}
                alt={rank.name}
                className="w-24 h-24 mx-auto mb-4 drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)]"
              />
              <h2 className="text-2xl font-bold text-yellow-200 tracking-wide mb-1">{rank.name}</h2>
              <p className="text-sm text-white/70 mb-3">Point Range: <span className="font-semibold">{rank.range}</span></p>
              <p className="text-white text-sm">{rank.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-white/90 mt-16 text-lg max-w-3xl mx-auto italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Kemenangan demi kemenangan akan membawamu menuju kejayaan. Tantang dirimu, kalahkan lawan-lawanmu, dan capai rank tertinggi untuk menjadi legenda sejati!
        </motion.p>
      </div>

      {/* MODAL */}
      <AnimatePresence>
  {selectedRank && (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedRank(null)}
    >
      <motion.div
        className="relative bg-gradient-to-br from-[#2c003c] via-[#4d006a] to-[#7300a3] text-white p-8 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.15)] max-w-md w-full border border-white/20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-4 text-white text-2xl hover:text-red-400"
          onClick={() => setSelectedRank(null)}
        >
          ✕
        </button>

        <motion.img
          src={selectedRank.image}
          alt={selectedRank.name}
          className="w-36 h-36 mx-auto mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        <h2 className="text-3xl font-bold text-center text-yellow-300 drop-shadow-[0_0_8px_rgba(255,255,0,0.4)] mb-2">
          {selectedRank.name}
        </h2>
        <p className="text-center text-sm text-white/80 mb-3">
          Point Range: <span className="font-semibold">{selectedRank.range}</span>
        </p>
        <p className="text-white/90 text-center leading-relaxed px-2">
          {selectedRank.description}
        </p>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </main>
  );
}
