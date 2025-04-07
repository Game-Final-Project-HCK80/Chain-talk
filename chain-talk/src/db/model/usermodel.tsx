import { z } from "zod";
import { hashPassword } from "@/app/helpers/bcrypt";
import { database } from "../config/config";
import { UserType } from "@/types";
import { ObjectId } from "mongodb";

const UserSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must contain at least 3 character(s)" }),
    email: z.string().email(),
    password: z
        .string()
        .min(6, { message: "Password must contain at least 6 character(s)" }),
});

type NewUser = {
    id?: string;
    username: string;
    email: string;
    password: string;
    picture?: string;
};

class UserModel {
    static collection() {
        return database.collection<UserType>("users");
    }

    static async create(payload: NewUser) {
        UserSchema.parse(payload);

        const user = await this.collection().findOne({
            $or: [
                { email: payload.email },
                { username: payload.username },
            ],
        });

        if (user) {
            throw { message: "email/username already exist", status: 400 };
        }

        const newUser = {
            ...payload,
            password: hashPassword(payload.password),
            point: 0,
            picture: payload.picture || "https://api.dicebear.com/7.x/avataaars/svg",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await this.collection().insertOne(newUser);

        return "success";
    }

    static async getAll() {
        const users = await this.collection().find({}).toArray();

        return users.map((user) => {
            const { ...rest } = user;
            return rest;
        });
    }


    static async findByEmail(email: string) {
        return this.collection().findOne({ email });
    }

    static async findByUsername(username: string) {
        return this.collection().findOne({ username });
    }

    static async findById(_id: string) {
        return this.collection().findOne({ _id: new ObjectId(_id) });
    }

    static async updateProfile(_id: string, updateData: Partial<NewUser>) {
        await this.collection().updateOne(
            { _id: new ObjectId(_id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );

        const updatedUser = await this.collection().findOne({ _id: new ObjectId(_id) });

        if (!updatedUser) {
            throw { message: "User not found", status: 404 };
        }

        return updatedUser;
    }
}

export default UserModel;




