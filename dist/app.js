"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = require("express-rate-limit");
const routes_1 = __importDefault(require("./routes"));
const database_1 = require("./config/database");
// Initialize express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)()); // Enable CORS
app.use(express_1.default.json()); // Parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Rate limiting
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// Routes
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.send("API is running");
});
// Error handling middleware
// app.use(errorHandler)
// Start server
const startServer = async () => {
    try {
        // Connect to database
        await (0, database_1.setupDatabase)();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
