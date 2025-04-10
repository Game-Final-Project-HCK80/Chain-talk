import { UserType } from "@/types";
import { database } from "../config/config";
import { ObjectId } from "mongodb";
import UserModel from "./usermodel";

export type Player = {
    userId: ObjectId;
    name: string;
    score: number; //total score
    isHost: boolean;
    isReady?: boolean;
    isPlayed?: boolean;
}

export type RoomType = {
    id?: string;
    codeRoom: string;
    hostId: ObjectId;
    roomUrl: string;
    status: string;
    players: Player[];
    answer: HistoriesAnswerType[];
    messages: { player: Player; message: string }[];
    currentTurn?: CurrentTurn;
    round?: number;
    updatedAt?: Date;
    startDate?: Date;
};

export type HistoriesAnswerType = {
    player: CurrentTurn;
    answer: string;
    meaning: string;
    isValid: boolean;
    message: string;
    score: number;
}

export type CurrentTurn = {
    id: ObjectId;
    name: string;
}

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

    static async leaveRoom(codeRoom: string, playerId: string) {
        const room = await this.getRoomByCode(codeRoom);

        if (!room) {
            throw { message: "Room not found", status: 404 };
        }

        const updatedPlayers = room.players.filter((p) => p.userId.toString() !== playerId);
        
        await this.collection().updateOne(
            { codeRoom },
            { $set: { players: updatedPlayers, updatedAt: new Date() } }
        );

        return updatedPlayers;
    }

    static async updateReadyStatus(codeRoom: string, playerId: string, isReady: boolean) {
        const room = await this.getRoomByCode(codeRoom);
        
        if (!room) {
            throw { message: "Room not found", status: 404 };
        }

        const player = room.players.find((p) => p.userId.toString() === playerId);

        if (!player) {
            throw { message: "Player not found", status: 404 };
        }

        player.isReady = isReady;

        await this.collection().updateOne(
            { codeRoom },
            { $set: { players: room.players, updatedAt: new Date() } }
        );

        return room;
    }

    static async startGame(codeRoom: string) {
        const room = await this.getRoomByCode(codeRoom);
        if (!room) {
            throw { message: "Room not found", status: 404 };
        }

        const currentTurn = {
            id: room.players[Math.floor(Math.random() * room.players.length)].userId,
            name: room.players[Math.floor(Math.random() * room.players.length)].name
        }
        console.log("currentTurn", currentTurn);

        await this.collection().updateOne(
            { codeRoom },
            { $set: { status: "Playing", currentTurn, updatedAt: new Date(), startDate: new Date() } }
        );

        return room
    }

    static async updateAnswer(codeRoom: string, player: CurrentTurn, answer: string) {
        console.log("codeRoom:", codeRoom, "player:", player.id+" - "+ player.name, "answer:", answer);
        
        const room = await this.getRoomByCode(codeRoom);
        
        if (!room) {
            throw { message: "Room not found", status: 404 };
        }

        console.log("room:", room);

        const isAlreadyAnswered = room.answer.find((el) => el.answer === answer);
        if (isAlreadyAnswered) {
            room.answer.push({
                player: {
                    id: new ObjectId(player.id),
                    name: player.name
                },
                answer,
                meaning: "",
                isValid: false,
                message: "Already answered",
                score: 0
            })
        } else {
            let isValidStartWith = true;
            let lastAnswerCharacter = "";

            if (room.answer.length !== 0) {
                const lastAnswer = room.answer[room.answer.length - 1];
                lastAnswerCharacter = lastAnswer.answer.charAt(lastAnswer.answer.length - 1);
                
                isValidStartWith = answer.startsWith(lastAnswerCharacter.toUpperCase()) || answer.startsWith(lastAnswerCharacter.toLowerCase());
            }

            if (!isValidStartWith) {
                room.answer.push({
                    player: {
                        id: new ObjectId(player.id),
                        name: player.name
                    },
                    answer,
                    meaning: "",
                    isValid: false,
                    message: `Answer must start with ${lastAnswerCharacter}`,
                    score: 0
                });
                
            } else {
                if (answer.length === 0) answer = "-"

                const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${answer}`)
                const correctAnswer = await res.json()
        
                if (res.ok) {
                    const meaning = correctAnswer[0].meanings[0].definitions[0].definition
                    console.log("meaning:", meaning);
                    room.answer.push({
                        player: {
                            id: new ObjectId(player.id),
                            name: player.name
                        },
                        answer,
                        meaning,
                        isValid: true,
                        message: "Correct answer",
                        score: answer.length
                    });

                    room.players.forEach((p, idx) => {
                        if (p.userId.toString() === player.id.toString()) {
                            room.players[idx].score += answer.length
                        }
                    });
        
                    const saveValidAnswer = room.answer.map((el) => {
                        if (el.isValid === true) {
                            return el
                        }
                    });
    
                    this.collection().updateOne(
                        { codeRoom },
                        { $set: { answer: (saveValidAnswer as Array<HistoriesAnswerType>), updatedAt: new Date() } }
                    );
    
                } else {
                    room.answer.push({
                        player: {
                            id: new ObjectId(player.id),
                            name: player.name
                        },
                        answer,
                        meaning: "",
                        isValid: false,
                        message: "Invalid answer", 
                        score: 0
                    });
                }
            }
            
        }

        room.players.forEach((p) => {
            if (p.userId.toString() === player.id.toString()) {
                p.isPlayed = true;
            }
        });

        const isAllPlayed = room.players.every((p) => p.isPlayed === true);
        if (isAllPlayed) {
            room.players.forEach((p) => {
                p.isPlayed = false;
            });

            room.round = room.round ? room.round + 1 : 1;
        }
        
        // startDate add 10sec
        const startDate = room.startDate ? new Date(room.startDate) : new Date();
        startDate.setSeconds(startDate.getSeconds() + 10);

        const updateRoom = { players: room.players, round: room.round, updatedAt: new Date(), status: room.status, startDate };

        if (room.round === 5) {
            if (room.status != "Finished") {
                const winner = room.players.reduce((prev, current) => (prev.score > current.score) ? prev : current);

                await UserModel.updatePoint(winner.userId)
            }

            room.status = "Finished";
            updateRoom.status = room.status;
        }

        await this.collection().updateOne(
            { codeRoom },
            { $set:  updateRoom }
        );

        const currentIndex = room.players.findIndex((p) => p.userId.toString() === player.id.toString());
        // console.log("currentIndex:", currentIndex);

        const nextIndexTurn = (currentIndex + 1) % room.players.length;
        // console.log("nextIndexTurn:", nextIndexTurn);

        room.currentTurn = {
            id: new ObjectId(room.players[nextIndexTurn].userId),
            name: room.players[nextIndexTurn].name
        }
        // console.log("room.players[nextIndexTurn]:", room.players[nextIndexTurn]);

        await this.collection().updateOne(
            { codeRoom },
            { $set: { currentTurn: room.currentTurn, updatedAt: new Date() } }
        );
        
        return room;
        

        // if (room.status !== "Playing") {
        //     throw { message: "Game is not started", status: 400 };
        // }

        // const currentIndex = room.players.findIndex((p) => p.userId.toString() === player.id.toString());
        // console.log("currentIndex:", currentIndex);

        // const nextIndexTurn = (currentIndex + 1) % room.players.length;
        // console.log("nextIndexTurn:", nextIndexTurn);

        // console.log("room.players[nextIndexTurn]:", room.players[nextIndexTurn]);
        
        

        // const isAlreadyAnswered = room.answer.find((a) => a.answer === answer);
        // if (isAlreadyAnswered) {
        //     throw { message: "Already answered", status: 400 };
        // }

        // const lastAnswer = room.answer[room.answer.length - 1];
        // const lastAnswerCharacter = lastAnswer.answer.charAt(lastAnswer.answer.length - 1);
        
        // const isValidStartWith = answer.startsWith(lastAnswerCharacter.toUpperCase()) || answer.startsWith(lastAnswerCharacter.toLowerCase());
        // if (!isValidStartWith) {
        //     throw { message: `Answer must start with ${lastAnswerCharacter}`, status: 400 };
        // }






        // const player = room.players.find((p) => p.userId.toString() === playerId);

        // if (!player) {
        //     throw { message: "Player not found", status: 404 };
        // }

        // const newAnswer = {
        //     player,
        //     answer,
        // };

        // room.answer.push(newAnswer);

        // await this.collection().updateOne(
        //     { codeRoom },
        //     { $set: { answer: room.answer, updatedAt: new Date() } }
        // );

        // console.log("ini roomm model:", room.answer);
        

        // return room;
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