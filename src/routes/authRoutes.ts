import { Router } from "express"
import { body } from "express-validator"
import * as authController from "../controllers/authController"
import { authenticate } from "../middleware/auth"
import { validate } from "../middleware/validation"

const router = Router()

// Register
router.post(
  "/register",
  validate([
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("name").optional(),
    body("phone").optional(),
  ]),
  authController.register,
)

// Login
router.post(
  "/login",
  validate([
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  authController.login,
)

// Get profile
router.get("/profile", authenticate, authController.getProfile)

// Update profile
router.put(
  "/profile",
  authenticate,
  validate([body("name").optional(), body("phone").optional()]),
  authController.updateProfile,
)

// Change password
router.post(
  "/change-password",
  authenticate,
  validate([
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ]),
  authController.changePassword,
)

export default router

