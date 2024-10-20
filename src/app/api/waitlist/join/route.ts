import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Party from "../../../../models/Party";
import { Status } from "@/lib/type";

export async function POST(request: Request) {
  try {
    const { name, partySize } = await request.json();

    if (!name || !partySize) {
      return NextResponse.json(
        { error: "Name and party size are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const newParty = new Party({ name, partySize, status: Status.Waiting });
    await newParty.save();

    return NextResponse.json({ success: true, partyId: newParty._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
