import { errHandler } from "@/app/helpers/errHandler";
import { RoomModel } from "@/db/model/roomModel";
import { CustomError } from "@/types";

export async function POST(req: Request) {
    try {
        const userId = req.headers.get("x-user-id") as string;
    
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        await RoomModel.createRoom({
            codeRoom: code,
            hostId: userId,
            roomUrl: "",
            status: "Waiting"
        });

        return Response.json({ message: "success", codeRoom: code });
        
    } catch (error) {
        return errHandler(error as CustomError)
    }



}