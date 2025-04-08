'use client'

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { UserType } from "@/types";
import Link from "next/link";
import { UserRoundCog } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [point, setPoint] = useState(0);

  const [editMode, setEditMode] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [tempPicture, setTempPicture] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile`, { credentials: "include" });
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        if (!res.ok) throw new Error("Please login first");

        const data = await res.json();
        setProfile(data);
        setTempUsername(data.username);
        setTempPicture(data.picture || "/default-avatar.png");
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
    if (points < 10) return "/bronze.png";
    if (points < 20) return "/silver.png";
    if (points < 30) return "/gold.png";
    if (points < 40) return "/platinum.png";
    if (points < 50) return "/diamond.png";
    return "/master.png";
  };

  const getBorderColorByPoint = (points: number) => {
    if (points < 10) return "border-yellow-600";
    if (points < 20) return "border-gray-300";
    if (points < 30) return "border-yellow-300";
    if (points < 40) return "border-blue-400";
    if (points < 50) return "border-cyan-300";
    return "border-purple-400";
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempPicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!tempUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    if (tempUsername.length > 20) {
      toast.error("Username must be less than 20 characters");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: tempUsername, picture: tempPicture }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message === "Username already exists" ? "Username is already taken" : "Failed to save changes");
        return;
      }

      setProfile(data);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTempUsername(profile?.username || "");
    setTempPicture(profile?.picture || "/default-avatar.png");
    setEditMode(false);
  };

  const badgeImage = getImageByPoint(point);
  const nextPoints = 10 - (point % 10);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1e002f] via-[#42005c] to-[#70009b] relative text-white overflow-hidden px-4 py-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#ffffff0d_0%,transparent_70%)]" />

      {!loading && profile && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center space-y-8"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-center flex items-center gap-3">
              <UserRoundCog size={50} className="text-yellow-400" />
              My Profile
            </h1>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 w-full justify-center mt-8">
              <div className="relative">
                <motion.img
                  src={profile.picture || "/default-avatar.png"}
                  alt="Avatar"
                  className={`w-32 h-32 rounded-full border-4 ${getBorderColorByPoint(point)} object-cover shadow-xl`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="text-center md:text-left space-y-3">
                <h2 className="text-2xl font-bold text-yellow-300">{profile.username}</h2>
                <p className="text-lg font-medium">
                  Points: <span className="text-yellow-400">{point}</span>
                </p>

                <div className="w-60 bg-white/20 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-yellow-400 h-full rounded-full"
                    style={{ width: `${Math.min((point % 10) * 10, 100)}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((point % 10) * 10, 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <p className="text-xs text-gray-300">{nextPoints} points to next rank</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => setEditMode(true)}
                className="bg-yellow-400 text-purple-900 font-semibold px-6 py-2 rounded-xl hover:bg-yellow-300 transition shadow-lg hover:shadow-2xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                Edit Profile
              </motion.button>
            </div>

            <div className="flex flex-col items-center gap-2 mt-6">
              <Link href="/info-rank">
                <motion.img
                  src={badgeImage}
                  alt="User Rank"
                  className="w-36 h-36 object-contain hover:scale-105 transition"
                  whileHover={{ rotate: [0, 2, -2, 0] }}
                />
              </Link>
              <p className="text-sm text-gray-300 text-center">Click badge for rank info</p>
            </div>
          </motion.div>

          {/* Edit Modal */}
          <AnimatePresence>
            {editMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="bg-white text-black p-8 rounded-2xl shadow-2xl w-[90%] max-w-md space-y-6"
                >
                  <h3 className="text-xl font-bold text-purple-700 text-center">Edit Profile</h3>

                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <img
                        src={tempPicture}
                        alt="Temp Avatar"
                        className="w-28 h-28 rounded-full object-cover border-4 border-purple-300"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-yellow-400 p-1 rounded-full"
                      >
                        <img src="/pencil-icon.png" alt="Edit" className="w-5 h-5" />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handlePictureChange}
                      />
                    </div>

                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="w-full p-2 border-b-2 border-purple-400 focus:outline-none text-lg font-semibold"
                      placeholder="Enter new username"
                    />
                  </div>

                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-yellow-400 text-purple-900 font-bold px-5 py-2 rounded-xl hover:bg-yellow-300 transition"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-300 text-black font-bold px-5 py-2 rounded-xl hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </main>
  );
}