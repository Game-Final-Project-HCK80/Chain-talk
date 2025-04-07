import { errHandler } from "@/app/helpers/errHandler";
import { Player, RoomModel } from "@/db/model/roomModel";
import UserModel from "@/db/model/usermodel";
import { CustomError } from "@/types";

export async function POST(req: Request) {
    try {
        const userId = req.headers.get("x-user-id") as string;
        
        const user = await UserModel.findById(userId);
        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const player: Player = {
            id: userId,
            name: user.username,
            score: 0,
            isHost: true,
        }

        await RoomModel.createRoom({
            codeRoom: code,
            hostId: userId,
            roomUrl: "",
            status: "Waiting",
            players: [player],
            answer: [],
        });

        return Response.json({ message: "success", codeRoom: code });
        
    } catch (error) {
        return errHandler(error as CustomError)
    }



}