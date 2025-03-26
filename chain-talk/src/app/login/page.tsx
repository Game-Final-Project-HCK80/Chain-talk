"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
export const dynamic = "force-dynamic";

export default function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/login", {
                method: "POST",
                body: JSON.stringify(form),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const responseData = await res.json();
            if (!res.ok) {
                throw responseData;
            }

            console.log(responseData);
            window.location.href = "/";
        } catch (err) {
            toast((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 px-4">
            <div className="bg-white shadow-xl rounded-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
                {/* Bagian Sign In */}
                <div className="w-full md:w-1/2 p-8 flex flex-col items-center">
                    <h1 className="text-4xl font-extrabold mb-4 text-purple-700">Chain-Talk</h1>
                    <p className="text-gray-600 mb-6 text-center">Connect words, make chains, and challenge your friends!</p>
                    <form onSubmit={handleSubmit} className="w-full">
                        <input
                            type="text"
                            placeholder="Email"
                            className="w-full p-3 border border-gray-300 rounded mb-3 text-lg"
                            value={form.email}
                            name="email"
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 border border-gray-300 rounded mb-3 text-lg"
                            value={form.password}
                            name="password"
                            onChange={handleChange}
                        />
                        <p className="text-sm text-purple-600 cursor-pointer mb-4">Forgot your password?</p>
                        <button
                            disabled={isLoading}
                            className="w-full bg-purple-600 text-white p-3 rounded text-lg transition duration-300 hover:bg-purple-700"
                        >
                            {isLoading ? "Loading..." : "SIGN IN"}
                        </button>
                    </form>
                </div>
                {/* Bagian Sign Up */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-pink-500 to-purple-500 text-white flex flex-col justify-center items-center p-8">
                    <h2 className="text-2xl font-bold mb-4">New Here?</h2>
                    <p className="text-center mb-4">Join the Chain-Talk community and start playing now!</p>
                    <Link href={`/register`} className="border border-white px-6 py-3 rounded text-lg transition duration-300 hover:bg-white hover:text-purple-600">SIGN UP</Link>
                </div>
            </div>
        </div>
    );
}