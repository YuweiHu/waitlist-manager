import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Party from "../../../../models/Party";
import { TOTAL_SEATS } from "@/lib/constant";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const partyId = searchParams.get("partyId");

    if (!partyId) {
      return NextResponse.json(
        { error: "Party ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Update any completed services
    const now = new Date();
    await Party.updateMany(
      { status: "serving", serviceEndTime: { $lte: now } },
      { $set: { status: "completed" } }
    );

    // Calculate available seats
    const servingParties = await Party.find({ status: "serving" });
    const occupiedSeats = servingParties.reduce(
      (sum, p) => sum + p.partySize,
      0
    );
    let availableSeats = TOTAL_SEATS - occupiedSeats;

    // Check for parties that can be moved to 'ready'
    const waitingParties = await Party.find({ status: "waiting" }).sort({
      joinedAt: 1,
    });

    for (const party of waitingParties) {
      if (party.partySize <= availableSeats) {
        await Party.findByIdAndUpdate(party._id, { status: "ready" });
        availableSeats -= party.partySize;
      }
    }

    // Get party status
    const party = await Party.findById(partyId);

    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }

    // Calculate position in queue
    const partiesAhead = await Party.countDocuments({
      status: "waiting",
      joinedAt: { $lt: party.joinedAt },
    });

    return NextResponse.json({
      status: party.status,
      positionInQueue: partiesAhead + 1,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
