import { UserType } from "@/types";
import { database } from "../config/config";
import { ObjectId } from "mongodb";

export type Player = {
    userId: ObjectId;
    name: string;
    score: number;
    isHost: boolean;
    isReady?: boolean;
}

export type RoomType = {
    id?: string;
    codeRoom: string;
    hostId: ObjectId;
    roomUrl: string;
    status: string;
    players: Player[];
    answer: string[];
    messages: { player: Player; message: string }[];
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

    static async joinRoom(codeRoom: string, player: UserType) {
        const room = await this.getRoomByCode(codeRoom);

        if (!room) {
            throw { message: "Room not found", status: 404 };
        }

        if (room.players.length === 4) {
            throw { message: "Room is full", status: 400 };
        }

        if (!room.players.some((p) => p.userId.toString() === player._id?.toString())) {
            room.players.push({
                userId: new ObjectId(player._id),
                name: player.username,
                score: 0,
                isHost: false,
                isReady: false,
            });
            
            await this.collection().updateOne(
                { codeRoom },
                { $set: { players: room.players, updatedAt: new Date() } }
            );
        }

        return room;
    }

    static async getAll() {
        const rooms = await this.collection().find({}).toArray();

        return rooms.map((room) => {
            const { ...rest } = room;
            return rest;
        });
    }

    static async getRoomByCode(codeRoom: string) {
        const room = await this.collection().findOne({ codeRoom });

        if (!room) {
            throw { message: "Room not found", status: 404 };
        }
        
        return room;
    }
}