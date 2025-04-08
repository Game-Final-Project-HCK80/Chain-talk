"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Video, X, Send, UserCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { Player, RoomType } from "@/db/model/roomModel"
import { socket } from "@/lib/socketClient" // <- Make sure this is correctly configured
import { useRouter } from "next/navigation"

export default function GameRoom({ params }: { params: Promise<{ codeRoom: string }> }) {
  const [room, setRoom] = useState<RoomType | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSidebar, setActiveSidebar] = useState<"chat" | "video" | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<{ id: number; sender: string; text: string }[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [username, setUsername] = useState<string>("Player")
  const [isHost, setIsHost] = useState(false)
  const router = useRouter()

  const toggleSidebar = (type: "chat" | "video") => {
    if (sidebarOpen && activeSidebar === type) {
      setSidebarOpen(false)
      setActiveSidebar(null)
    } else {
      setSidebarOpen(true)
      setActiveSidebar(type)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const msgData = { room: room?.codeRoom, message: newMessage.trim(), sender: username }
      socket.emit("message", msgData)
      setMessages(prev => [...prev, { id: Date.now(), sender: "You", text: newMessage.trim() }])
      setNewMessage("")
    }
  }

  // Fetch room data
  async function getRoomByCode() {
    try {
      const { codeRoom } = await params
      const response = await fetch(`/api/room/${codeRoom}`)
      if (!response.ok) throw new Error("Room not found")

      const roomData = await response.json()
      setRoom(roomData.data)
      setPlayers(roomData.data.players)

      const responseUser = await fetch("/api/profile")
      if (!responseUser.ok) throw new Error("User not found")

      const userData = await responseUser.json()
      const actualUsername = userData.username
      setUsername(actualUsername)
      setIsHost(userData._id === roomData.data.hostId)
      
      // Join the socket room
      socket.emit("join-room", { room: codeRoom, player: userData });

      socket.on("room-joined", (data: RoomType) => {
        setPlayers(data.players)
        setRoom(data)
      })

    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  // Handle socket events
  useEffect(() => {
    getRoomByCode();

    socket.on("message", (data: { sender: string; message: string }) => {
      setMessages(prev => [...prev, { id: Date.now(), sender: data.sender, text: data.message }])
    })

    socket.on("user_joined", (message: string) => {
      setMessages(prev => [...prev, { id: Date.now(), sender: "System", text: message }])
    })

    socket.on("game_started", () => {
      router.push("/game")
    })

    return () => {
      socket.off("message")
      socket.off("user_joined")
      socket.off("game_started")
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-[#1E004A] overflow-hidden">
      {/* Header */}
      <header className="bg-[#2B0A54] text-white p-4 flex justify-between items-center shadow-lg z-10 border-b border-[#7209B7]/30">
        <h1 className="text-xl font-bold text-[#FFD60A]">Room: {room?.codeRoom}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSidebar("chat")}
            className={`btn btn-circle ${
              activeSidebar === "chat" && sidebarOpen
                ? "bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white"
                : "bg-[#2B0A54] text-white border-[#7209B7]"
            } shadow-md hover:shadow-[#F72585]/20`}
            aria-label="Toggle chat"
          >
            <MessageSquare size={20} />
          </button>
          <button
            onClick={() => toggleSidebar("video")}
            className={`btn btn-circle ${
              activeSidebar === "video" && sidebarOpen
                ? "bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white"
                : "bg-[#2B0A54] text-white border-[#7209B7]"
            } shadow-md hover:shadow-[#F72585]/20`}
            aria-label="Toggle video call"
          >
            <Video size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Game Area */}
        <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? "mr-0 md:mr-80" : ""}`}>
          <div className="flex flex-col h-full">
            {/* Player Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {players.map((player) => (
                <motion.div
                  key={player?.userId.toString()}
                  className={`bg-[#2B0A54] text-white rounded-xl p-4 shadow-[0_4px_20px_rgba(123,31,162,0.25)] flex items-center justify-between
                    ${player.isReady ? "border-l-4 border-[#FFD60A]" : ""}`}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(247, 37, 133, 0.3)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="flex items-center">
                    <UserCircle2 size={36} className="mr-3 text-[#F72585]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{player.name}</h3>
                        {player.isHost && (
                          <span className="text-xs bg-[#F1C40F] text-[#34495E] px-2 py-1 rounded-full font-bold">Host</span>
                        )}
                      </div>
                      <span className={`text-xs ${player.isReady ? "text-[#FFD60A]" : "text-[#CCCCCC]"}`}>
                        {player.isReady ? "Ready" : "Not Ready"}
                      </span>
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex flex-col sm:flex-row gap-3 justify-center sm:justify-between">
              <motion.button
                className="btn border-none shadow-lg hover:shadow-[#F72585]/30 bg-gradient-to-r from-[#7209B7] to-[#560BAD] text-white"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(247, 37, 133, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                Leave Room
              </motion.button>
              <motion.button
                className="btn border-none shadow-lg hover:shadow-[#F72585]/30 bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white font-bold"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(247, 37, 133, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                {isHost ? "Start Game" : "Ready"}
              </motion.button>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-full sm:w-80 h-full bg-[#2B0A54] shadow-[0_0_30px_rgba(123,31,162,0.4)] z-20 mt-16 flex flex-col border-l border-[#7209B7]/30"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-[#7209B7]/30 flex justify-between items-center bg-[#2B0A54] text-white">
                <h2 className="font-bold text-[#FFD60A]">{activeSidebar === "chat" ? "Chat" : "Video Call"}</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="btn btn-circle btn-sm bg-transparent border-none hover:bg-[#3A0B73]"
                  aria-label="Close sidebar"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-hidden">
                {activeSidebar === "chat" ? (
                  <div className="flex flex-col" style={{ maxHeight: "calc(100% - 10%)" }}>
                    {/* Chat Messages */}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-lg max-w-[85%] shadow-md ${
                            msg.sender === "You"
                              ? "bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white ml-auto"
                              : "bg-[#3A0B73] text-white"
                            }`}
                        >
                          <p className="font-bold text-xs text-[#FFD60A]">{msg.sender}</p>
                          <p>{msg.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-[#7209B7]/30 flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="input input-bordered flex-1 bg-[#3A0B73] text-white border-[#7209B7] placeholder-[#CCCCCC]"
                      />
                      <button
                        type="submit"
                        className="btn bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white border-none shadow-md"
                        disabled={!newMessage.trim()}
                      >
                        <Send size={18} />
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100% - 10%)" }}>
                    {/* Video Call Grid */}
                    <div className="grid grid-cols-1 gap-3">
                      {[1, 2, 3, 4].map((id) => (
                        <div
                          key={id}
                          className="aspect-video bg-[#3A0B73] rounded-lg flex items-center justify-center text-white shadow-md"
                        >
                          <UserCircle2 size={40} className="text-[#F72585]" />
                          <span className="ml-2 font-bold">Player {id}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-center">
                      <button className="btn bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white border-none shadow-md hover:shadow-[#F72585]/30">
                        End Call
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

