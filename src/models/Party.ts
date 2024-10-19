import mongoose, { Schema, Document } from "mongoose";

export interface IParty extends Document {
  name: string;
  partySize: number;
  status: "waiting" | "ready" | "serving" | "completed";
  joinedAt: Date;
  serviceEndTime?: Date;
}

const PartySchema: Schema = new Schema({
  name: { type: String, required: true },
  partySize: { type: Number, required: true },
  status: {
    type: String,
    enum: ["waiting", "ready", "serving", "completed"],
    default: "waiting",
  },
  joinedAt: { type: Date, default: Date.now },
  serviceEndTime: { type: Date },
});

export default mongoose.models.Party ||
  mongoose.model<IParty>("Party", PartySchema);
