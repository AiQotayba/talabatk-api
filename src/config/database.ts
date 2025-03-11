import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/talabatk"

// Setup database connection
export const setupDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB database")
  } catch (error) {
    console.error("Database connection error:", error)
    throw error
  }
}

// Handle connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err)
})

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected")
})

// Handle application termination
process.on("SIGINT", async () => {
  await mongoose.connection.close()
  console.log("MongoDB connection closed")
  process.exit(0)
})

export default mongoose

