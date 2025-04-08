'use client'

import React from 'react'
import { motion } from 'framer-motion'

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
          Dalam setiap pertandingan, hanya yang terbaik yang layak naik peringkat. Dapatkan <span className="text-yellow-300 font-semibold">+1 poin</span> jika kamu menjadi juara pertama, tapi hati-hati—jika kamu berada di posisi terakhir, <span className="text-red-400 font-semibold">-1 poin</span> akan mengintaimu! Tidak di posisi puncak maupun dasar? Tenang, poinmu aman. Semakin tinggi rank, semakin kuat lawan, dan semakin besar kebanggaan saat kamu berhasil mengalahkannya!
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
    </main>
  );
}
