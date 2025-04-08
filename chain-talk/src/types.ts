import { ObjectId } from "mongodb";

export type CustomError = {
    message: string;
    status: number;
}

export type UserType = {
    _id?: ObjectId;
    email: string;
    username: string;
    password: string;
    point: number;
    picture: string;
    createdAt: Date;
    updatedAt: Date;
  };