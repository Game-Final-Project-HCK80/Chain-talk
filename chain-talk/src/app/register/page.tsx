"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const router = useRouter();
  const [loading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.username || !formData.password) {
      toast("All fields are required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || "Registration failed");
      }

      toast("Registration successful");
      router.push("/login");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 px-4">
      <div className="bg-white shadow-xl rounded-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Register Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center">
          <h1 className="text-4xl font-extrabold mb-4 text-purple-700">Chain-Talk</h1>
          <p className="text-gray-600 mb-6 text-center">Join the game and start making word chains!</p>
          <form onSubmit={handleSubmit} className="w-full">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mb-3 text-lg"
            />
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mb-3 text-lg"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mb-3 text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white p-3 rounded text-lg transition duration-300 hover:bg-purple-700"
            >
              {loading ? "Registering..." : "SIGN UP"}
            </button>
          </form>
        </div>
        {/* Info Panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-pink-500 to-purple-500 text-white flex flex-col justify-center items-center p-8">
          <h2 className="text-2xl font-bold mb-4">Already Have an Account?</h2>
          <p className="text-center mb-4">Log in now and start playing!</p>
          <button
            onClick={() => router.push("/login")}
            className="border border-white px-6 py-3 rounded text-lg transition duration-300 hover:bg-white hover:text-purple-600"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}