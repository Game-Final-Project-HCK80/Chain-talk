import { CustomError } from "@/types";
import { ZodError } from "zod";

export const errHandler = (err: CustomError | ZodError) => {
    let message = err.message;
    let status = 500;

    if (err instanceof ZodError) {
        message = err.issues.map((el) => el.message).join(", ");
        status = 400;
    } else if (err.status) {
        status = err.status;
    }

    return Response.json(
        {
            message,
        },
        {
            status,
        }
    );
};
