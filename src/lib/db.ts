import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already connected");
    return;
  }
  if (connectionState === 2) {
    console.log("Connecting ...");
  }
  try {
    mongoose.connect(MONGO_URL!);
    console.log("connected");
  } catch (error: any) {
    console.log("Error:", error);
    throw new Error("Error:", error);
  }
};

export default connect;
