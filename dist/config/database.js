"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/talabatk";
// Setup database connection
const setupDatabase = async () => {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log("Connected to MongoDB database");
    }
    catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
};
exports.setupDatabase = setupDatabase;
// Handle connection events
mongoose_1.default.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});
mongoose_1.default.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});
// Handle application termination
process.on("SIGINT", async () => {
    await mongoose_1.default.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
});
exports.default = mongoose_1.default;
