import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { errHandler } from "@/app/helpers/errHandler";
import { verifyWithJose } from "@/app/helpers/jwt";
import { CustomError } from "./types";

export async function middleware(request: NextRequest) {

    const cookieStore = await cookies();
    const auth = cookieStore.get("Authorization")?.value;

    console.log(auth, "tokennnn masuk/belum");

    if (request.nextUrl.pathname.startsWith("/api/play-game") ||
        request.nextUrl.pathname.startsWith("/api/profile")||
        request.nextUrl.pathname.startsWith("/api/lobby") ||
        request.nextUrl.pathname.startsWith("/api/room") 
        ) {
        try {
            if (!auth) {
                throw { message: "please login first", status: 401 };
            }

            const [type, token] = auth?.split(" ");
            if (type !== "Bearer") {
                throw { message: "invalid token", status: 401 };
            }

            const decoded = await verifyWithJose<{ _id: string }>(token);
            console.log(decoded, 'dapat gak');

            const requestHeaders = new Headers(request.headers);
            requestHeaders.set("x-user-id", decoded._id);

            const response = NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
            return response;
        } catch (err) {
            return errHandler(err as CustomError);
        }
    }
}

export const config = {
    matcher: ["/api/play-game/:path*",
        "/api/profile/:path*",
        "/api/lobby/:path*",
        "/api/room/:path*",
    ],
};
 