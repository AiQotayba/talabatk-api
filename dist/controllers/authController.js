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
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const userService = __importStar(require("../services/userService"));
const errors_1 = require("../utils/errors");
const register = async (req, res, next) => {
    try {
        const { email, password, name, phone } = req.body;
        if (!email || !password) {
            throw new errors_1.BadRequestError("Email and password are required");
        }
        // Create user
        const user = await userService.createUser(email, password, name, phone);
        // Generate token
        const token = userService.generateToken({ ...user, password: "" });
        res.status(201).json({
            success: true,
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new errors_1.BadRequestError("Email and password are required");
        }
        // Validate credentials
        const user = await userService.validateCredentials(email, password);
        // Generate token
        const token = userService.generateToken(user);
        // Return user without password
        const { password: _, ...userResponse } = user;
        res.status(200).json({
            success: true,
            data: {
                user: userResponse,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getProfile = async (req, res, next) => {
    try {
        const user = await userService.findUserById(req.user.id);
        // Return user without password
        const { password: _, ...userResponse } = user;
        res.status(200).json({
            success: true,
            data: userResponse,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const { name, phone } = req.body;
        const updatedUser = await userService.updateUserProfile(req.user.id, { name, phone });
        res.status(200).json({
            success: true,
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            throw new errors_1.BadRequestError("Current password and new password are required");
        }
        await userService.changePassword(req.user.id, currentPassword, newPassword);
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
