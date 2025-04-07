import { database } from "../config/config";

export type RoomType = {
    id?: string;
    codeRoom: string;
    hostId: string;
    roomUrl: string;
    status: string;
};

export class RoomModel {
    static collection() {
        return database.collection<RoomType>("Room");
    }

    static async createRoom(payload: RoomType) {
        const room = await this.collection().findOne({ codeRoom: payload.codeRoom });

        if (room) {
            throw { message: "Room already exists", status: 400 };
        }

        const newRoom = {
            ...payload,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await this.collection().insertOne(newRoom);

        return "success";
        
    }
}