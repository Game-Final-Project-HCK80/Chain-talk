import { errHandler } from "@/app/helpers/errHandler";
import UserModel from "../../../db/model/usermodel";
import { CustomError } from "@/types";
// import { CustomError } from "../../../../types";



export async function POST (req: Request){
    try {

        const { email, username, password } = await req.json();
        
        await UserModel.create({email, username, password});
        
        return Response.json({ message: "success" });
        
    } catch (err) {
        return errHandler(err as CustomError)
    }
}