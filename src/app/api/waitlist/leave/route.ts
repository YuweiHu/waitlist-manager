import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Party from "../../../../models/Party";
import { Status } from "@/lib/type";

export async function POST(request: Request) {
  try {
    const { partyId } = await request.json();

    if (!partyId) {
      return NextResponse.json(
        { error: "Party ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const party = await Party.findById(partyId);
    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }

    if ([Status.Serving, Status.Completed].includes(party.status)) {
      return NextResponse.json(
        { error: "Cannot leave waitlist after checking in" },
        { status: 400 }
      );
    }

    await party.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
