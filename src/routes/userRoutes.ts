import { Router } from "express"
import { body } from "express-validator"
import * as userController from "../controllers/userController"
import { authenticate, authorize } from "../middleware/auth"
import { validate } from "../middleware/validation"

const router = Router()

// Get all users - Admin only
router.get("/", authenticate, authorize(["admin"]), userController.getAllUsers)

// Get user by ID - Admin only
router.get("/:id", authenticate, authorize(["admin"]), userController.getUserById)

// Create user - Admin only
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  validate([
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("name").optional(),
    body("phone").optional(),
    body("role").optional().isIn(["user", "admin", "delivery"]).withMessage("Invalid role"),
  ]),
  userController.createUser,
)

// Update user role - Admin only
router.patch(
  "/:id/role",
  authenticate,
  authorize(["admin"]),
  validate([body("role").isIn(["user", "admin", "delivery"]).withMessage("Invalid role")]),
  userController.updateUserRole,
)

export default router

