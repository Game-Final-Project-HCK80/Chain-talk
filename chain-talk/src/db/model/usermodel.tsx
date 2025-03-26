import { z } from "zod";
import { hashPassword } from "@/app/helpers/bcrypt";
import { database } from "../config/config";
import { UserType } from "@/types";

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
    username: string;
    email: string;
    password: string;
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
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await this.collection().insertOne(newUser);

        return "success";
    }

    static async findByEmailOrUsername(email: string) {
        return this.collection().findOne({ email });
    }
}

export default UserModel;
