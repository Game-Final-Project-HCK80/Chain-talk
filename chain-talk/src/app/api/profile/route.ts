
import UserModel from "@/db/model/usermodel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id") as string;
  console.log(userId, "ini id user dari header");
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(user); // return seluruh user data
  } catch (err) {
    return NextResponse.json({ message: "Terjadi kesalahan server", err }, { status: 500 });
  }
}
