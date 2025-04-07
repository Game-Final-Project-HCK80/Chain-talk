'use client';

import { UserType } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Profile() {
    const [profile, setProfile] = useState<UserType | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch(`/api/profile`, {
                    credentials: "include", // penting: biar cookies dibawa
                });

                if (!res.ok) throw new Error("Gagal mengambil data profile");

                const data = await res.json();
                console.log(data, "ini data profile dari api");
                setProfile(data);
            } catch (err) {
                toast.error((err as Error).message);
            }
        }

        fetchProfile();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-[#0f9d58] to-[#1abc9c] bg-clip-text text-transparent animate-pulse">
                My Profile
            </h1>

            {profile ? (
                <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
                    <p><strong>Nama:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                </div>
            ) : (
                <p className="text-center text-gray-500">Loading profile...</p>
            )}
        </div>
    );
}
