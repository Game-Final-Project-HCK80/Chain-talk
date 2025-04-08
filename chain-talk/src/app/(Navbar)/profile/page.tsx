'use client'

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserType } from "@/types";
import Link from "next/link";

export default function Profile() {
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
                    window.location.href = '/login';
                    return;
                }

                if (!res.ok) throw new Error("Please login first");

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
        if (points < 10) return "/bronze.png";
        if (points < 20) return "/silver.png";
        if (points < 30) return "/gold.png";
        if (points < 40) return "/platinum.png";
        if (points < 50) return "/diamond.png";
        return "/master.png";
    };

    const badgeImage = getImageByPoint(point);

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#6e00b3] via-[#3e0066] to-[#6e00b3] text-white flex flex-col items-center justify-center px-4">
            {!loading && profile && (
                <div className="w-full max-w-sm bg-purple bg-opacity-40 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center gap-5 shadow-2xl border border-purple-500">

                    <img
                        src={profile.picture || "/default-avatar.png"}
                        alt="User Avatar"
                        className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-lg"
                    />

                    <h1 className="text-3xl font-bold text-center text-yellow-300">
                        {profile.username}
                    </h1>

                    <Link href="/info-rank"><div className="relative">
                        <img
                            src={badgeImage}
                            alt="User Rank"
                            className="w-40 h-40 object-contain"
                        />

                    </div></Link>

                    <p className="text-lg font-semibold text-white">
                        Points: <span className="text-yellow-400">{point}</span>
                    </p>
                </div>
            )}
        </main>
    );
}
