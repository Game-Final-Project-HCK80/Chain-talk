import { sign, verify } from "jsonwebtoken";
import * as jose from "jose";

const SECRET = process.env.JWT_SECRET as string;

export const signToken = (payload: { email: string; _id: string }) => {
    return sign(payload, SECRET);
};

export const verifyToken = (token: string) => {
    return verify(token, SECRET);
};

export const verifyWithJose = async <T>(token: string) => {
    const secret = new TextEncoder().encode(SECRET);

    const { payload } = await jose.jwtVerify<T>(token, secret);
    return payload;
};
