import {createServer} from "node:http"
import next from "next"
import {Server} from "socket.io"

const dev = process.env.NODE_ENV !== "production"
const hostname = process.env.HOSTNAME || "localhost"
const port = parseInt(process.env.PORT || "3000", 10)

const app = next({dev, hostname, port})
const handle = app.getRequestHandler()

export type Player = {
    userId: string;
    name: string;
    score: number;
    isHost: boolean;
    isReady?: boolean;
    isCurrentTurn?: boolean;
}

app.prepare().then(() => {

    const httpServer = createServer(handle)
    const io =  new Server(httpServer)
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("join-room", async ({room, player}) => {
            socket.join(room)
            console.log(`User ${player.username} joined room ${room}`);

            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"/api/join-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({room, player}),
            });

            const newRoom = await res.json()
            if (!res.ok) {
                socket.emit("error", newRoom.message)
                return
            }
            
            io.to(room).emit("room-joined", newRoom.room);

            socket.to(room).emit("user_joined", `${player.username} joined room `)
        })

        socket.on("leave-room", async ({room, player}) => {
            socket.leave(room)
            console.log(`User ${player.username} left room ${room}`);

            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"/api/leave-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({room, player}),
            });

            const newRoom = await res.json()
            if (!res.ok) {
                socket.emit("error", newRoom.message)
                return
            }

            io.to(room).emit("room-left", newRoom.room);
            
            socket.to(room).emit("user_left", `${player.username} left room `)
        })

        socket.on("message", ({room, message, sender}) => {
            console.log(`Message from ${sender} in room ${room}: ${message}`);
            socket.to(room).emit("message", {sender, message})
        })

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);  
        })

        socket.on("start-game", async ({ room }) => {
            console.log(`Game starting in room: ${room}`);
            
            try {
                const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"/api/start-game", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({room}),
                });

                const newRoom = await res.json()
                if (!res.ok) {
                    socket.emit("error", newRoom.message)
                    return
                }

                io.to(room).emit("game-started", { room: newRoom.room });

            } catch (error) {
                console.error("Error starting game:", error)
                socket.emit("error", "Failed to start game")
            }
        })

        socket.on("ready", async ({ room, player }) => {
            console.log(`Player ${player} is ready in room: ${room}`);

            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"/api/ready", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({room, player}),

            });
            const newRoom = await res.json()
            if (!res.ok) {
                socket.emit("error", newRoom.message)
                return
            }

            io.to(room).emit("player_ready", {players: newRoom.room});
        });


        socket.on("submit-answer", async ({ room, player, answer }) => {
            console.log(`Player ${player.id} and ${player.name} submitted answer in room: ${room}, with answer: ${answer}`);

            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"/api/submit-answer", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({room, player, answer}),

            });

            const newRoom = await res.json()
            if (!res.ok) {
                socket.emit("error", newRoom.message)
                return
            }

            console.log("newRoom", newRoom);

            io.to(room).emit("answer_submitted", {players: newRoom.data});
        })

    })

    httpServer.listen(port, () => {
        console.log(`Server running on http://${hostname}:${port}`);
        
    })
})