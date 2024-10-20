import mongoose, { Connection } from "mongoose";

const MONGODB_URI: string = "mongodb://localhost:27017/local";

let cachedConnection: Connection | null = null;

export default async function dbConnect() {
  if (cachedConnection) {
    console.log("Using cached db connection");
    return cachedConnection;
  }

  try {
    const cnx = await mongoose.connect(MONGODB_URI);
    cachedConnection = cnx.connection;
    console.log("New mongodb connection established");
    return cachedConnection;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
