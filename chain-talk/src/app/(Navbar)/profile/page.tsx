'use client'

import { useEffect, useState, useRef } from "react";
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
                const res = await fetch(`/api/profile`, {
                    credentials: "include",
                });

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

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type and size
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
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ username: tempUsername, picture: tempPicture }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data?.message === "Username already exists") {
                    toast.error("Username is already taken");
                } else {
                    toast.error("Failed to save changes");
                }
                return;
            }

            setProfile(data);
            setEditMode(false);
            toast.success("Profile updated successfully!");
        } catch (err) {
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

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#6e00b3] via-[#3e0066] to-[#6e00b3] text-white flex flex-col items-center justify-center px-4">
            {!loading && profile && (
                <div className="w-full max-w-sm bg-purple bg-opacity-40 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center gap-5 shadow-2xl border border-purple-500">
                    <div className="relative">
                        <img
                            src={editMode ? tempPicture : (profile.picture || "/default-avatar.png")}
                            alt="User Avatar"
                            className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-lg object-cover"
                        />
                        {editMode && (
                            <>
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
                            </>
                        )}
                    </div>

                    {editMode ? (
                        <input
                            type="text"
                            value={tempUsername}
                            onChange={(e) => setTempUsername(e.target.value)}
                            className="w-full p-2 text-center bg-transparent border-b-2 border-yellow-400 text-white text-xl font-bold placeholder:text-gray-300"
                            placeholder="Username"
                        />
                    ) : (
                        <h1 className="text-3xl font-bold text-center text-yellow-300">{profile.username}</h1>
                    )}

                    <Link href="/info-rank">
                        <div className="relative">
                            <img
                                src={badgeImage}
                                alt="User Rank"
                                className="w-40 h-40 object-contain"
                            />
                        </div>
                    </Link>

                    <p className="text-lg font-semibold text-white">
                        Points: <span className="text-yellow-400">{point}</span>
                    </p>

                    {editMode ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-yellow-400 text-purple-900 font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 transition"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="bg-gray-300 text-black font-bold px-4 py-2 rounded-xl hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setEditMode(true)}
                            className="mt-4 bg-yellow-400 text-purple-900 font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 transition"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            )}
        </main>
    );
}
