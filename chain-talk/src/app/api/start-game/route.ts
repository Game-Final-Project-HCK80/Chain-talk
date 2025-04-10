import { RoomModel } from "@/db/model/roomModel";

export async function PUT(request: Request) {
    const { room } = await request.json();

    const roomData = await RoomModel.startGame(room);
    if (!roomData) {
        return Response.json({ message: "Room not found" }, { status: 404 });
    }

    return Response.json({ message: "Game started", room: roomData });
    
}