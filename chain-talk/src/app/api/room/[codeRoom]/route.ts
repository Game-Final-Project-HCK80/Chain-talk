import { errHandler } from "@/app/helpers/errHandler";
import { RoomModel } from "@/db/model/roomModel";
import { CustomError } from "@/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ codeRoom: string }> }) {
    try {
        const { codeRoom } = await params;

        const room = await RoomModel.getRoomByCode(codeRoom);

        return Response.json({ message: "success", data: room });
    } catch (error) {
        return errHandler(error as CustomError);
    }
}