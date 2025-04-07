'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'



export default function Home() {
  const kataBerganti = ["kata", "tanaman", "antrian", "anti", "tikus", "usaha", "hantu"]

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 text-white flex flex-col items-center justify-center px-4">

      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold text-center mb-6"
      >
      </motion.h1>

      <motion.p
        className="text-center max-w-2xl text-lg md:text-xl mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Tantang temanmu menyambung kata secara cepat & kreatif. Sambungkan kata... atau kalah!
      </motion.p>

      {/* Kata yang menyambung dengan efek tilt */}
      <motion.div
        className="mt-16 flex flex-wrap justify-center gap-3 max-w-3xl text-xl text-center"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
      >
        {kataBerganti.map((kata, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
              <span className="bg-white text-blue-900 px-4 py-2 rounded-full shadow-md inline-block">
                {kata}
              </span>
            </Tilt> */}
          </motion.div>
        ))}
      </motion.div>

      {/* Tombol Aksi */}
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
  )
}