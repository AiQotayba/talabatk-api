"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.updateUserRole = exports.changePassword = exports.updateUserProfile = exports.generateToken = exports.validateCredentials = exports.createUser = exports.findUserById = exports.findUserByEmail = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importStar(require("../models/User"));
const errors_1 = require("../utils/errors");
const findUserByEmail = async (email) => {
    return User_1.default.findOne({ email });
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    const user = await User_1.default.findById(id);
    if (!user) {
        throw new errors_1.NotFoundError(`User with ID ${id} not found`);
    }
    return user;
};
exports.findUserById = findUserById;
const createUser = async (email, password, name, phone, role = User_1.UserRole.USER) => {
    // Check if user already exists
    const existingUser = await (0, exports.findUserByEmail)(email);
    if (existingUser) {
        throw new errors_1.BadRequestError("Email already in use");
    }
    // Create user
    const user = new User_1.default({
        email,
        password, // Will be hashed by the pre-save hook
        name,
        phone,
        role,
    });
    await user.save();
    // Return user without password
    return {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.createUser = createUser;
const validateCredentials = async (email, password) => {
    const user = await (0, exports.findUserByEmail)(email);
    if (!user) {
        throw new errors_1.UnauthorizedError("Invalid credentials");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new errors_1.UnauthorizedError("Invalid credentials");
    }
    return user;
};
exports.validateCredentials = validateCredentials;
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user._id,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: process.env.JWT_EXPIRES_IN || "30d" });
};
exports.generateToken = generateToken;
const updateUserProfile = async (userId, updates) => {
    const user = await (0, exports.findUserById)(userId);
    // Update user
    const { name, phone } = updates;
    if (name)
        user.name = name;
    if (phone)
        user.phone = phone;
    await user.save();
    // Return user without password
    return {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.updateUserProfile = updateUserProfile;
const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await (0, exports.findUserById)(userId);
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
        throw new errors_1.UnauthorizedError("Current password is incorrect");
    }
    // Update password
    user.password = newPassword; // Will be hashed by the pre-save hook
    await user.save();
};
exports.changePassword = changePassword;
const updateUserRole = async (userId, role) => {
    const user = await (0, exports.findUserById)(userId);
    // Update role
    user.role = role;
    await user.save();
    // Return user without password
    return {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.updateUserRole = updateUserRole;
const getAllUsers = async () => {
    const users = await User_1.default.find().sort({ createdAt: -1 });
    // Remove passwords from results
    return users.map((user) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }));
};
exports.getAllUsers = getAllUsers;
