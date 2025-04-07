"use client";

import { UserType } from "@/types";
import { useEffect, useState } from "react";



export default function LeaderboardPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("/api/leaderboard");
                const data = await res.json();
                if (data.success) {
                    setUsers(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-4 text-center text-yellow-600">🏆 Leaderboard</h1>
            {loading ? (
                <p className="text-center text-black">Loading...</p>
            ) : (
                <ul className="space-y-3">
                    {users.map((user, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-100 rounded hover:bg-gray-200 transition text-black"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-semibold w-6">{index + 1}.</span>
                                <span className="text-lg font-bold text-black">{user.username}</span>
                            </div>
                            <span className="font-bold text-blue-600">{user.point}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
