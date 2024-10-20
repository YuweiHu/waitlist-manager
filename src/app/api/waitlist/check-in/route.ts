import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Party from "../../../../models/Party";
import { PERSON_SERVICE_TIME_MS } from "@/lib/constant";
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

    if (party.status !== Status.Ready) {
      return NextResponse.json(
        { error: "Party is not ready to check-in" },
        { status: 400 }
      );
    }

    // Start service
    const serviceTime = party.partySize * PERSON_SERVICE_TIME_MS;
    const serviceEndTime = new Date(Date.now() + serviceTime);

    party.status = Status.Serving;
    party.serviceEndTime = serviceEndTime;
    await party.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
