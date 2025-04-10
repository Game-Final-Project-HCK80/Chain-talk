import { RoomModel } from "@/db/model/roomModel";

export async function PUT(request: Request) {
    const { room, player, answer } = await request.json();

    const updatedAnswer = await RoomModel.updateAnswer(room, player, answer);

    return Response.json({data: updatedAnswer});
}