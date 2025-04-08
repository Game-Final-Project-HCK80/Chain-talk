
import UserModel from "@/db/model/usermodel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id") as string;
  console.log(userId, "ini id user dari header");
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ message: "Server error", err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const userId = req.headers.get("x-user-id") as string;
  const { username, picture } = await req.json();

  console.log(userId, "ini id user dari header");

  try {
    const updatedUser = await UserModel.updateProfile(userId, { username, picture });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword); 
  } catch (err) {
    console.error("Error updating profile:", err);
    return NextResponse.json({ message: "Server error", err }, { status: 500 });
  }
}
