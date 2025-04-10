import { RoomModel } from "@/db/model/roomModel";

export async function PUT(request: Request) {
    const { room, player } = await request.json();
    // const playerId = player.userId;
    const isReady = true;

    const newRoom = await RoomModel.updateReadyStatus(room, player, isReady);

    return Response.json({ message: "ready", room: newRoom });
}