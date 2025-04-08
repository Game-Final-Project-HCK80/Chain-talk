import {createServer} from "node:http"
import next from "next"
import {Server} from "socket.io"

const dev = process.env.NODE_ENV !== "production"
const hostname = process.env.HOSTNAME || "localhost"
const port = parseInt(process.env.PORT || "3000", 10)

const app = next({dev, hostname, port})
const handle = app.getRequestHandler()

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

        socket.on("message", ({room, message, sender}) => {
            console.log(`Message from ${sender} in room ${room}: ${message}`);
            socket.to(room).emit("message", {sender, message})
        })

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);  
        })

        socket.on("play-game", ({ room }) => {
            console.log(`Game started in room: ${room}`);
            io.to(room).emit("game_started");
        });
    })

    httpServer.listen(port, () => {
        console.log(`Server running on http://${hostname}:${port}`);
        
    })
})