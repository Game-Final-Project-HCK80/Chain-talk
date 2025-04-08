"use client"

import { ChangeEvent, Dispatch, FormEvent, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Lock, Mail, User } from "lucide-react"
import { toast } from "react-toastify"
import { SetStateAction } from "jotai"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  return (
    <div className="min-h-screen bg-[#1E004A] flex flex-col md:flex-row items-center justify-center p-4 md:p-8">
      {/* Welcome Section */}
      <div className="w-full md:w-1/2 max-w-md md:max-w-lg p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Chain<span className="text-[#FFD60A]">Talk</span>
          </h1>
          <p className="text-lg text-[#CCCCCC] mb-6">
            Connect, learn, and play with words in this multiplayer educational game!
          </p>
          <div className="hidden md:block">
            <div className="relative w-full h-64 bg-[#2B0A54]/50 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(114,9,183,0.3)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 p-4">
                  {["LEARN", "PLAY", "CHAT", "WORD", "GAME", "TEAM", "CHAIN", "BUILD", "SOLVE"].map((word, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="bg-[#3A0B73] text-white font-bold py-2 px-3 rounded-lg text-center shadow-md"
                    >
                      {word}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Auth Forms Section */}
      <div className="w-full md:w-1/2 max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#2B0A54] rounded-xl shadow-[0_0_30px_rgba(123,31,162,0.4)] overflow-hidden border border-[#7209B7]/30"
        >
          {/* Tabs */}
          <div className="flex border-b border-[#7209B7]/30">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-4 font-bold text-lg transition-colors duration-300 ${activeTab === "login" ? "text-[#FFD60A] border-b-2 border-[#FFD60A]" : "text-[#CCCCCC] hover:text-white"
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-4 font-bold text-lg transition-colors duration-300 ${activeTab === "register"
                ? "text-[#FFD60A] border-b-2 border-[#FFD60A]"
                : "text-[#CCCCCC] hover:text-white"
                }`}
            >
              Register
            </button>
          </div>

          {/* Form Container */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "login" ? <LoginForm key="login" /> : <RegisterForm key="register" setActiveTab={setActiveTab} />}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
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
      // router.push('/')
    } catch (err) {
      toast((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleLogin}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-[#CCCCCC]" />
          </div>
          <input
            onChange={handleChange}
            value={form.email}
            name="email"
            type="email"
            id="email"
            className="input input-bordered w-full pl-10 bg-[#3A0B73] border-[#7209B7] text-white focus:border-[#F72585] focus:ring-[#F72585] placeholder-[#CCCCCC]"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-white">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#F72585] hover:text-[#F72585]/80 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-[#CCCCCC]" />
          </div>
          <input
            onChange={handleChange}
            value={form.password}
            name="password"
            type="password"
            id="password"
            className="input input-bordered w-full pl-10 bg-[#3A0B73] border-[#7209B7] text-white focus:border-[#F72585] focus:ring-[#F72585] placeholder-[#CCCCCC]"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn w-full bg-gradient-to-r from-[#F72585] to-[#7209B7] hover:shadow-[0_0_15px_rgba(247,37,133,0.5)] text-white border-none font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center group shadow-md"
      >
        {isLoading ? "Loading..." : "Login"}
        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.form>
  )
}

function RegisterForm({ setActiveTab }: { setActiveTab: Dispatch<SetStateAction<"login" | "register">> }) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      toast("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast("Passwords do not match");
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
      // router.push("/auth");
      setFormData({
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
      });

      setActiveTab("login");

    } catch (error) {
      toast(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleRegister}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-white">
          Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-[#CCCCCC]" />
          </div>
          <input
            onChange={handleChange}
            value={formData.username}
            name="username"
            type="text"
            id="username"
            className="input input-bordered w-full pl-10 bg-[#3A0B73] border-[#7209B7] text-white focus:border-[#F72585] focus:ring-[#F72585] placeholder-[#CCCCCC]"
            placeholder="YourUsername"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="register-email" className="block text-sm font-medium text-white">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-[#CCCCCC]" />
          </div>
          <input
            onChange={handleChange}
            value={formData.email}
            name="email"
            type="email"
            id="register-email"
            className="input input-bordered w-full pl-10 bg-[#3A0B73] border-[#7209B7] text-white focus:border-[#F72585] focus:ring-[#F72585] placeholder-[#CCCCCC]"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="register-password" className="block text-sm font-medium text-white">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-[#CCCCCC]" />
          </div>
          <input
            onChange={handleChange}
            value={formData.password}
            name="password"
            type="password"
            id="register-password"
            className="input input-bordered w-full pl-10 bg-[#3A0B73] border-[#7209B7] text-white focus:border-[#F72585] focus:ring-[#F72585] placeholder-[#CCCCCC]"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm-password" className="block text-sm font-medium text-white">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-[#CCCCCC]" />
          </div>
          <input
            onChange={handleChange}
            value={formData.confirmPassword}
            name="confirmPassword"
            type="password"
            id="confirm-password"
            className="input input-bordered w-full pl-10 bg-[#3A0B73] border-[#7209B7] text-white focus:border-[#F72585] focus:ring-[#F72585] placeholder-[#CCCCCC]"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn w-full bg-gradient-to-r from-[#F72585] to-[#7209B7] hover:shadow-[0_0_15px_rgba(247,37,133,0.5)] text-white border-none font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center group shadow-md"
      >
        {loading ? "Registering..." : "Create Account"}
        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.form>
  )
}

