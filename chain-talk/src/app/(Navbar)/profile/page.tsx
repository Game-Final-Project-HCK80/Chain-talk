'use client'

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { UserType } from "@/types";
import Link from "next/link";

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
        <main className="min-h-screen bg-gradient-to-br from-[#6e00b3] via-[#3e0066] to-[#6e00b3] text-white flex items-center justify-center px-4 py-10 relative">
            {!loading && profile && (
                <>
                    <div className="w-full max-w-3xl h-[90vh] bg-purple bg-opacity-40 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-purple-500 flex flex-col justify-between items-center gap-6">
                        {/* Title */}
                        <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
                            <img src="/crown-icon.png" className="w-7 h-7" alt="Crown" />
                            Your Profile
                        </h2>

                        {/* Profile */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                            <div className="relative">
                                <img
                                    src={profile.picture || "/default-avatar.png"}
                                    alt="User Avatar"
                                    className={`w-32 h-32 rounded-full border-4 ${getBorderColorByPoint(point)} shadow-lg object-cover`}
                                />
                            </div>

                            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                                <h1 className="text-3xl font-bold text-yellow-300">{profile.username}</h1>
                                <div className="w-full max-w-xs">
                                    <p className="text-lg font-semibold">
                                        Points: <span className="text-yellow-400">{point}</span>
                                    </p>
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full"
                                                style={{ width: `${Math.min((point % 10) * 10, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {nextPoints} points to next rank
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center w-full gap-4 mt-4">
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-yellow-400 text-purple-900 font-bold px-5 py-2 rounded-xl hover:bg-yellow-300 transition"
                            >
                                Edit Profile
                            </button>
                        </div>

                        <div className="flex flex-col items-center gap-2 mt-8">
                            <Link href="/info-rank">
                                <img
                                    src={badgeImage}
                                    alt="User Rank"
                                    className="w-40 h-40 object-contain hover:scale-105 transition"
                                />
                            </Link>
                            <p className="text-sm text-gray-300 text-center">Click badge for rank info</p>
                        </div>
                    </div>

                    {/* Modal */}
                    <AnimatePresence>
                        {editMode && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-purple-900/80 flex items-center justify-center z-50"
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
