import UserModel from "@/db/model/usermodel";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const users = await UserModel.getAll();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Failed to get leaderboard:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
