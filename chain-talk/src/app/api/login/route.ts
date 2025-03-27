import { comparePassword } from "@/app/helpers/bcrypt";
import { errHandler } from "@/app/helpers/errHandler";
import { signToken } from "@/app/helpers/jwt";
import { cookies } from "next/headers";
import { CustomError } from "../../../../types";
import UserModel from "../../../db/model/usermodel";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await UserModel.findByEmailOrUsername(email);
    if (!user) throw { message: "invalid email/password", status: 401 };

    const validPassword = comparePassword(password, user.password);
    if (!validPassword)
      throw { message: "invalid email/password", status: 401 };

    const accessToken = signToken({
      email: user.email,
      _id: user._id.toString(),
    });

    const cookieStore = await cookies();
    cookieStore.set("Authorization", `Bearer ${accessToken}`);

    return Response.json({ accessToken });
  } catch (err) {
    return errHandler(err as CustomError);
  }
}
