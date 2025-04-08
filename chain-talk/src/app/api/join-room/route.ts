import { RoomModel } from "@/db/model/roomModel";

export async function POST(req: Request) {
    try {
        const { room, player } = await req.json();
        
        const newRoom = await RoomModel.joinRoom(room, player);
        if (!newRoom) {
            return Response.json({ message: "Room not found" }, { status: 404 });
        }

        return Response.json({ room: newRoom }, { status: 200 });

    } catch (error) {
        return Response.json({ message: (error as Error).message }, { status: 500 });
    }
}