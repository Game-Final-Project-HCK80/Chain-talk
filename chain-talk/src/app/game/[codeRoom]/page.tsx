"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Video, X, Send, Clock, ChevronRight, User, UserCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CurrentTurn, HistoriesAnswerType, Player, RoomType } from "@/db/model/roomModel"
import { socket } from "@/lib/socketClient"
import { toast } from "react-toastify"
import { UserType } from "@/types"
import { useRouter } from "next/navigation"

export default function ChainTalkGame({ params }: { params: Promise<{ codeRoom: string }> }) {
  const router = useRouter();

  const [room, setRoom] = useState<RoomType | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [user, setUser] = useState<UserType | null>(null)
  const [currentTurn, setCurrentTurn] = useState<CurrentTurn | null>(null)
  // const [isCurrentTurn, setIsCurrentTurn] = useState(false)
  const [histories, setHistories] = useState<HistoriesAnswerType[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSidebar, setActiveSidebar] = useState<"chat" | "video" | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredWord, setHoveredWord] = useState<HistoriesAnswerType | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)


  // Sample messages for the chat
  const [messages, setMessages] = useState([
    { id: 1, sender: "Player 1", text: "Let's start the game!" },
    { id: 2, sender: "Player 2", text: "I'm ready!" },
    { id: 3, sender: "Player 3", text: "This is going to be fun!" },
  ])

  const [newMessage, setNewMessage] = useState("")

  // Sample history answers
  // const [history, setHistory] = useState([
  //   { player: "Player 1", word: "Apple" },
  //   { player: "Player 2", word: "Elephant" },
  // ])

  // Auto-scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, activeSidebar])

  // Timer countdown effect
  useEffect(() => {
    console.log("Time left:", timeLeft);
    
    if (timeLeft !== null) {
      if (timeLeft > 0) {
        const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
        return () => clearTimeout(timerId)
      }

      if (timeLeft <= 0) {
        if (user) {
          console.log("Time's up! Submitting answer...", user);
          console.log("input: ", inputValue);
          
          
          if (currentTurn?.id.toString() === user?._id?.toString()) {
            handleSubmitWord();
          }
        }
      }
    }

  }, [timeLeft])

  // Focus input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

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
      setMessages([...messages, { id: messages.length + 1, sender: "You", text: newMessage.trim() }])
      setNewMessage("")
    }
  }

  const handleSubmitWord = () => {
    // e.preventDefault()
    // if (inputValue.trim()) {
      setIsSubmitting(true)

      socket.emit("submit-answer", { room: room?.codeRoom, player: currentTurn, answer: inputValue.trim() })
      setInputValue("");
      setIsSubmitting(false)

      // socket.on("answer_submitted", (data: { players: RoomType }) => {
      //   console.log("Answer submitted:", data)

      //   setPlayers(data.players.players)
      //   setCurrentTurn((data.players.currentTurn as CurrentTurn))
      //   setHistories(data.players.answer)
      //   setTimeLeft(10)
      // });


      // Simulate network request
      // setTimeout(() => {
      //   setHistory([...history, { player: "You", word: inputValue.trim() }])
      //   setInputValue("")
      //   setIsSubmitting(false)

      //   // Reset timer for demo purposes
      //   setTimeLeft(30)

      //   // Refocus the input field
      //   if (inputRef.current) {
      //     inputRef.current.focus()
      //   }
      // }, 600)
    // }
  }

  // Sample player data
  // const players = [
  //   { id: 1, name: "Player 1", isCurrentTurn: true },
  //   { id: 2, name: "Player 2", isCurrentTurn: false },
  //   { id: 3, name: "Player 3", isCurrentTurn: false },
  //   { id: 4, name: "Player 4", isCurrentTurn: false },
  // ]

  async function getRoom() {
    try {
      const roomCode = await params
      const response = await fetch(`/api/room/${roomCode.codeRoom}`)
      if (!response.ok) {
        throw new Error("Failed to fetch room data")
      }
      const roomData = await response.json()
      console.log("Room data:", roomData)

      setRoom(roomData.data)
      setPlayers(roomData.data.players)
      setHistories(roomData.data.answer)

      const responseUser = await fetch("/api/profile")
      if (!responseUser.ok) throw new Error("User not found")

      const userData = await responseUser.json()

      setUser(userData);
      setCurrentTurn(roomData.data.currentTurn)
      // setIsCurrentTurn(roomData.data.currentTurn.id.toString() === userData._id.toString())
      console.log("Current turn:", roomData.data.currentTurn, "<<<<", currentTurn);
      console.log("Current user ID:", userData._id);
      

      const now = new Date();
      const endTime = new Date(roomData.data.startDate || 0);
      const timeDiff = Math.floor(((endTime.getTime()+10) - now.getTime()) / 1000); // Difference in seconds
      console.log(roomData.data.startDate, "timeDiff: ", timeDiff);

      setTimeLeft(timeDiff)

    } catch (error) {
      console.error("Error fetching room data:", error)
    }
  }

  useEffect(() => {
    getRoom();

    socket.on("answer_submitted", async (data: { players: RoomType }) => {
      console.log("Answer submitted:", data)

      // const responseUser = await fetch("/api/profile")
      // if (!responseUser.ok) throw new Error("User not found")

      // const userData = await responseUser.json()


      setRoom(data.players);
      setPlayers(data.players.players)
      setCurrentTurn((data.players.currentTurn as CurrentTurn))
      // setIsCurrentTurn(data.players.currentTurn?.id.toString() === userData._id.toString())
      setHistories(data.players.answer.reverse());

      const now = new Date();
      const endTime = new Date(data.players.startDate || 0);
      const timeDiff = Math.floor(((endTime.getTime()) - now.getTime()) / 1000); // Difference in seconds
      console.log("timeDiff: ", timeDiff);
      
      setTimeLeft(timeDiff);
      // const remainingTime = Math.abs(timeLeft - timeDiff);


      if (data.players.round === 5) {
        toast.success("Game Over!")
        router.push("/result");
      }

      toast.success(`Word "${data.players.answer[0].answer}" by ${data.players.answer[0].player.name} ${data.players.answer[0].message}!`)
    });

    return () => {
      socket.off("answer_submitted")
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (hoveredWord) {
        // Position the tooltip slightly above and to the right of the cursor
        setTooltipPosition({
          x: e.clientX + 10,
          y: e.clientY - 10,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [hoveredWord])

  // Calculate timer percentage for visual indicator
  const timerPercentage = ((timeLeft || 10) / 10) * 100

  return (
    <div className="flex flex-col h-screen bg-[#1E004A] overflow-hidden">
      {/* Header */}
      <header className="bg-[#2B0A54] text-white p-4 flex justify-between items-center shadow-lg z-10 border-b border-[#7209B7]/30">
        <h1 className="text-xl font-bold text-[#FFD60A]">Room: {room?.codeRoom}</h1>
        <h1 className="text-lg font-bold text-[#FFD60A]">{user?.username}</h1>
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

      {/* <header className="bg-black text-white py-2 px-3 sm:px-4 flex justify-between items-center shadow-lg z-10 border-b border-[#7209B7]/30">
        <h1 className="text-lg sm:text-xl font-bold">
          Room: <span className="text-[#FFD60A]">codeRoom</span>
        </h1>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleSidebar("chat")}
            className={`relative btn btn-circle btn-sm ${
              activeSidebar === "chat" && sidebarOpen
                ? "bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white"
                : "bg-[#2B0A54] text-white border-[#7209B7]"
            } shadow-[0_0_10px_rgba(247,37,133,0.3)]`}
            aria-label="Toggle chat"
          >
            <MessageSquare size={16} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFD60A] rounded-full text-[10px] text-black font-bold flex items-center justify-center">
              3
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleSidebar("video")}
            className={`btn btn-circle btn-sm ${
              activeSidebar === "video" && sidebarOpen
                ? "bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white"
                : "bg-[#2B0A54] text-white border-[#7209B7]"
            } shadow-[0_0_10px_rgba(247,37,133,0.3)]`}
            aria-label="Toggle video call"
          >
            <Video size={16} />
          </motion.button>
        </div>
      </header> */}

      {/* Game Title */}
      <div className="text-center py-1">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-[#FFD60A] drop-shadow-[0_0_8px_rgba(255,214,10,0.5)]"
        >
          Chain Talk
        </motion.h1>
      </div>

      {/* Main Content - Single Screen Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Game Area */}
        <main
          className={`flex-1 px-2 py-1 sm:px-4 sm:py-2 transition-all duration-300 ${sidebarOpen ? "mr-0 md:mr-80" : ""
            } flex justify-center`}
        >
          <div className="w-full max-w-4xl flex flex-col h-full">
            {/* Game Content Container */}
            <div className="flex flex-col h-full">
              {/* Game Board with Players */}
              <div className="relative bg-[#2B0A54] rounded-xl shadow-[0_0_20px_rgba(123,31,162,0.4)] border border-[#7209B7]/50 flex-1 mb-2 overflow-hidden">
                {/* Player Avatars in Corners */}
                <div className="absolute inset-0 p-2 sm:p-4">
                  <div className="relative w-full h-full">
                    {players.map((player, index) => {
                      // Position in corners: top-left, top-right, bottom-left, bottom-right
                      const positions = [
                        "top-0 left-0", // top-left
                        "top-0 right-0", // top-right
                        "bottom-0 left-0", // bottom-left
                        "bottom-0 right-0", // bottom-right
                      ]

                      return (
                        <div key={player.userId.toString()} className={`absolute ${positions[index]} z-10`}>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            animate={
                              (currentTurn?.id.toString() === player.userId.toString())
                                ? {
                                  scale: [1, 1.1, 1],
                                  // boxShadow: [
                                  //   "0 0 5px rgba(247, 37, 133, 0.5)",
                                  //   "0 0 15px rgba(247, 37, 133, 0.8)",
                                  //   "0 0 5px rgba(247, 37, 133, 0.5)",
                                  // ],
                                }
                                : {}
                            }
                            transition={{ repeat: (currentTurn?.id.toString() === player.userId.toString()) ? Number.POSITIVE_INFINITY : 0, duration: 1.5 }}
                            className="group relative"
                          >
                            <div
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-base font-bold 
                                ${(currentTurn?.id.toString() === player.userId.toString())
                                  ? "bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white"
                                  : "bg-[#3A0B73] text-white"} 
                              border-2 ${currentTurn?.id.toString() === player.userId.toString() ? "border-[#FFD60A]" : "border-[#7209B7]/50"}`}
                            >
                              <User size={currentTurn?.id.toString() === player.userId.toString() ? 22 : 18} />
                            </div>

                            {/* Player name below avatar */}
                            <div className="text-center mt-1">
                              <p
                                className={`text-center mt-1 text-xs ${currentTurn?.id.toString() === player.userId.toString() ? "text-[#FFD60A]" : "text-white"
                                  }`}
                              >
                                {player.name}
                              </p>
                              <p className="text-[#FFD60A] text-xs font-bold mt-0.5 bg-[#3A0B73] px-1.5 py-0.5 rounded-full inline-block shadow-[0_0_5px_rgba(255,214,10,0.3)]">
                                {player.score}
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Center Game Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <motion.h2
                    animate={{
                      textShadow: [
                        "0 0 5px rgba(255, 214, 10, 0.5)",
                        "0 0 8px rgba(255, 214, 10, 0.7)",
                        "0 0 5px rgba(255, 214, 10, 0.5)",
                      ],
                    }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    className="text-[#FFD60A] text-base sm:text-lg font-bold mb-2 text-center"
                  >
                    {room?.answer.length === 0 ? "Enter a word to start the game" : `Next word must start with: ${room?.answer[0].answer.slice(-1).toUpperCase()}`}
                  </motion.h2>

                  {/* Input Form */}
                  <div className="w-full max-w-xs sm:max-w-sm">
                    <div className="mb-2">
                      <div className="relative">
                        <input
                          ref={inputRef}
                          type="text"
                          id="answer"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="w-full p-2 rounded-lg bg-[#3A0B73] text-white border-2 border-[#7209B7] focus:border-[#F72585] focus:ring-[#F72585] shadow-[0_0_10px_rgba(123,31,162,0.2)] placeholder-[#CCCCCC]/70 text-sm"
                          placeholder="Type your word here..."
                          disabled={isSubmitting}
                        />
                        <motion.div
                          animate={inputValue ? { x: [0, -3, 3, -2, 2, 0] } : {}}
                          transition={{ repeat: 0, duration: 0.5 }}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <ChevronRight className={`h-4 w-4 ${inputValue ? "text-[#F72585]" : "text-[#7209B7]/50"}`} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    {/* <motion.button
                      whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(247, 37, 133, 0.5)" }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={isSubmitting || !inputValue.trim() || !isCurrentTurn}
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white font-bold shadow-[0_0_10px_rgba(247,37,133,0.3)] hover:shadow-[0_0_15px_rgba(247,37,133,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Submit"
                      )}
                    </motion.button> */}
                  </div>
                </div>
              </div>

              {/* Bottom Section: History and Game Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-1">
                {/* History Box */}
                <div className="sm:col-span-2 bg-[#2B0A54] rounded-lg shadow-[0_0_10px_rgba(123,31,162,0.2)] border border-[#7209B7]/50 p-2">
                  <div className="text-xs text-white font-medium mb-1">History answers:</div>
                  <div className="max-h-16 overflow-y-auto">
                    {histories?.length > 0 ? (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {histories?.filter((el) => el.isValid === true).map((item: HistoriesAnswerType, index) => (
                          <motion.div
                            key={index}
                            initial={index === histories.length - 1 ? { opacity: 0, y: 5 } : { opacity: 1 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-[#CCCCCC]">{item.player.name}:</span>
                            <span
                              className="text-[#FFD60A] font-medium cursor-help border-b border-dashed border-[#FFD60A]/50 hover:border-[#FFD60A]"
                              onMouseEnter={() => setHoveredWord(item)}
                              onMouseLeave={() => setHoveredWord(null)}
                            >
                              {item.answer}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#CCCCCC] text-xs text-center">No words yet</p>
                    )}
                  </div>
                </div>

                {/* Timer and Round Info */}
                <div className="flex flex-col gap-2">
                  {/* Timer */}
                  <div className="bg-[#2B0A54] rounded-lg shadow-[0_0_10px_rgba(123,31,162,0.2)] border border-[#7209B7]/50 flex items-center justify-center p-2">
                    <div className="relative w-12 h-12 rounded-full bg-[#3A0B73] flex items-center justify-center shadow-[0_0_10px_rgba(123,31,162,0.3)] border border-[#7209B7]/50">
                      {/* Timer progress circle */}
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#F72585] to-[#7209B7] transition-all duration-1000 ease-linear rounded-b-full"
                        style={{ height: `${timerPercentage}%` }}
                      ></div>

                      <div className="w-10 h-10 rounded-full bg-[#2B0A54] flex items-center justify-center text-white text-lg font-bold z-10 border border-[#7209B7]/50">
                        {timeLeft && timeLeft >= 0? timeLeft : 0}
                      </div>
                      <Clock className="absolute -top-1 -right-1 text-[#FFD60A] w-4 h-4" />
                    </div>
                  </div>

                  {/* Round Indicator */}
                  <div className="bg-[#2B0A54] rounded-lg shadow-[0_0_10px_rgba(123,31,162,0.2)] border border-[#7209B7]/50 flex items-center justify-center p-2">
                    <p className="text-white text-center text-xs">
                      <span className="text-[#FFD60A] font-bold">Round {room ? room.round : 1}</span> — Turn:{" "}
                      <span className="text-[#FFD60A]">{currentTurn?.name}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Word Definition Tooltip */}
        <AnimatePresence>
          {hoveredWord && (
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed z-50 max-w-xs bg-[#3A0B73] text-white p-3 rounded-lg shadow-[0_0_15px_rgba(247,37,133,0.4)] border border-[#F72585]"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                pointerEvents: "none",
              }}
            >
              <div className="font-bold text-[#FFD60A] mb-1 text-sm">{hoveredWord.answer}</div>
              <div className="text-xs">{hoveredWord.meaning}</div>
            </motion.div>
          )}
        </AnimatePresence>

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
                          className={`p-3 rounded-lg max-w-[85%] shadow-md ${msg.sender === "You"
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

        {/* Sidebar */}
        {/* <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-full sm:w-80 h-full bg-[#2B0A54] shadow-[0_0_30px_rgba(123,31,162,0.4)] z-20 mt-16 flex flex-col"
            > */}
        {/* Sidebar Header */}
        {/* <div className="p-3 border-b border-[#7209B7]/30 flex justify-between items-center bg-[#2B0A54] text-white">
                <h2 className="font-bold text-[#FFD60A]">{activeSidebar === "chat" ? "Chat" : "Video Call"}</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(false)}
                  className="btn btn-circle btn-sm bg-transparent border-none hover:bg-[#3A0B73]"
                  aria-label="Close sidebar"
                >
                  <X size={18} className="text-[#F72585]" />
                </motion.button>
              </div> */}

        {/* Sidebar Content */}
        {/* <div className="flex-1 overflow-hidden">
                {activeSidebar === "chat" ? (
                  <div className="flex flex-col h-full"> */}
        {/* Chat Messages */}
        {/* <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3">
                      {messages.map((msg) => (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={msg.id}
                          className={`p-2 rounded-lg max-w-[85%] ${msg.sender === "You"
                            ? "bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white ml-auto shadow-[0_0_10px_rgba(247,37,133,0.3)]"
                            : "bg-[#3A0B73] text-white shadow-[0_0_10px_rgba(123,31,162,0.2)]"
                            } border border-[#7209B7]/50`}
                        >
                          <p className="font-bold text-xs text-[#FFD60A]">{msg.sender}</p>
                          <p className="text-sm mt-1">{msg.text}</p>
                        </motion.div>
                      ))}
                    </div> */}

        {/* Chat Input */}
        {/* <form onSubmit={handleSendMessage} className="p-3 border-t border-[#7209B7]/30 flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="input input-bordered flex-1 bg-[#3A0B73] text-white border-[#7209B7] placeholder-[#CCCCCC]/70 text-sm"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        className="btn btn-sm bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white border-none shadow-[0_0_10px_rgba(247,37,133,0.3)]"
                        disabled={!newMessage.trim()}
                      >
                        <Send size={16} />
                      </motion.button>
                    </form>
                  </div>
                ) : (
                  <div className="p-3"> */}
        {/* Video Call Grid */}
        {/* <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((id) => (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          key={id}
                          className="aspect-video bg-[#3A0B73] rounded-lg flex items-center justify-center text-white shadow-[0_0_10px_rgba(123,31,162,0.2)] border border-[#7209B7]/50"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#F72585] flex items-center justify-center text-white font-bold text-sm">
                            P{id}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(247, 37, 133, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-sm bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white border-none shadow-[0_0_10px_rgba(247,37,133,0.3)]"
                      >
                        End Call
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence> */}
      </div>
    </div>
  )
}
