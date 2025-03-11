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
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userController = __importStar(require("../controllers/userController"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Get all users - Admin only
router.get("/", auth_1.authenticate, (0, auth_1.authorize)(["admin"]), userController.getAllUsers);
// Get user by ID - Admin only
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)(["admin"]), userController.getUserById);
// Create user - Admin only
router.post("/", auth_1.authenticate, (0, auth_1.authorize)(["admin"]), (0, validation_1.validate)([
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    (0, express_validator_1.body)("name").optional(),
    (0, express_validator_1.body)("phone").optional(),
    (0, express_validator_1.body)("role").optional().isIn(["user", "admin", "delivery"]).withMessage("Invalid role"),
]), userController.createUser);
// Update user role - Admin only
router.patch("/:id/role", auth_1.authenticate, (0, auth_1.authorize)(["admin"]), (0, validation_1.validate)([(0, express_validator_1.body)("role").isIn(["user", "admin", "delivery"]).withMessage("Invalid role")]), userController.updateUserRole);
exports.default = router;
