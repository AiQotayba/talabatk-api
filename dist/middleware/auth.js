"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new errors_1.UnauthorizedError("No token provided");
        }
        const token = authHeader.split(" ")[1];
        if (!token)
            throw new errors_1.UnauthorizedError("No token provided");
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        // Check if user exists
        const user = await User_1.default.findOne({ email: decoded.email }).select("-password");
        if (!user)
            throw new errors_1.UnauthorizedError("User not found");
        // Add user from payload to request
        req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new errors_1.UnauthorizedError("Invalid token"));
        }
        else {
            next(error);
        }
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errors_1.UnauthorizedError("Not authenticated"));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errors_1.UnauthorizedError("Not authorized to access this resource"));
        }
        next();
    };
};
exports.authorize = authorize;
