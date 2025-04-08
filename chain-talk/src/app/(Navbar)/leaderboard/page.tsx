"use client";

import { UserType } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LeaderboardPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("/api/leaderboard");
                const data = await res.json();

                if (data.success) {
                    const sortedUsers = data.data.sort((a: UserType, b: UserType) => b.point - a.point);
                    setUsers(sortedUsers);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankDisplay = (index: number) => {
        if (index >= 0 && index <= 3) {
            return (
                <Image
                    src={`/${index + 1}.png`}
                    alt={`Rank ${index + 1}`}
                    width={30}
                    height={30}
                    className="inline-block"
                />
            );
        } else {
            return <span>{index + 1}</span>;
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg overflow-x-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-yellow-600">🏆 Leaderboard</h1>
            {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
            ) : (
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-yellow-500 text-white text-center">
                            <th className="border border-yellow-600 px-4 py-2 text-left">Rank</th>
                            <th className="border border-yellow-600 px-4 py-2 text-left">Name</th>
                            <th className="border border-yellow-600 px-4 py-2 text-left">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr
                                key={index}
                                className="hover:bg-yellow-100 transition-colors text-center"
                            >
                                <td className="border border-yellow-300 px-4 py-2 font-semibold">
                                    {getRankDisplay(index)}
                                </td>
                                <td className="border border-yellow-300 px-4 py-2">{user.username}</td>
                                <td className="border border-yellow-300 px-4 py-2 font-bold text-blue-600">{user.point}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
