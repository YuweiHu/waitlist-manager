import { Status } from "@/lib/type";
import mongoose, { Schema, Document } from "mongoose";

export interface IParty extends Document {
  name: string;
  partySize: number;
  status: Status;
  joinedAt: Date;
  serviceEndTime?: Date;
}

const PartySchema: Schema = new Schema({
  name: { type: String, required: true },
  partySize: { type: Number, required: true },
  status: {
    type: String,
    enum: [Status.Waiting, Status.Serving, Status.Ready, Status.Completed],
    default: Status.Waiting,
  },
  joinedAt: { type: Date, default: Date.now },
  serviceEndTime: { type: Date },
});

export default mongoose.models.Party ||
  mongoose.model<IParty>("Party", PartySchema);
