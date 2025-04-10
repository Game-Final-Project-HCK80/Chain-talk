"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function CreateRoomPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const userId = "your-user-id"; // Replace with actual user ID logic
      const res = await fetch("/api/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId, // Pass user ID in headers
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create room");
      }

      toast.success("Room created successfully!");
      router.push(`/room/${data.codeRoom}`); // Redirect to the created room
    } catch (error: any) {
      console.error("Error creating room:", error);
      toast.error(error.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1c002d] via-[#32004a] to-[#56006f] text-white">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-yellow-300 mb-6"
      >
        Create a New Room
      </motion.h1>
      <motion.button
        onClick={handleCreateRoom}
        disabled={loading}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-400 disabled:opacity-50"
      >
        {loading ? "Creating Room..." : "Create Room"}
      </motion.button>
    </main>
  );
}