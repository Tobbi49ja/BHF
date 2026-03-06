import mongoose from "mongoose";

let atlasConnection;
let localConnection;

const connectDB = async () => {
  try {
    const ATLAS_URI = process.env.MONGO_URI;
    const LOCAL_URI = process.env.MONGO_LOCAL_URI;

    if (!ATLAS_URI) throw new Error("MONGO_URI is missing from .env file");

    console.log("🌐 Connecting to Atlas...");
    atlasConnection = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log("✅ Atlas Connected");

    if (LOCAL_URI) {
      console.log("💻 Connecting to Local...");
      localConnection = await mongoose.createConnection(LOCAL_URI).asPromise();
      console.log("✅ Local Connected");
    } else {
      console.log("⚠️  No LOCAL_URI — skipping local DB");
    }

    return { atlasConnection, localConnection };
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
};

export { connectDB, atlasConnection, localConnection };