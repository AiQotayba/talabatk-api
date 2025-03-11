import { Router } from "express"
import { body } from "express-validator"
import * as categoryController from "../controllers/categoryController"
import { authenticate, authorize } from "../middleware/auth"
import { validate } from "../middleware/validation"

const router = Router()

// Get all categories
router.get("/", categoryController.getAllCategories)

// Get category by ID
router.get("/:id", categoryController.getCategoryById)

// Create category - Admin only
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("image").optional().isURL().withMessage("Image must be a valid URL"),
  ]),
  categoryController.createCategory,
)

// Update category - Admin only
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("image").optional().isURL().withMessage("Image must be a valid URL"),
  ]),
  categoryController.updateCategory,
)

// Delete category - Admin only
router.delete("/:id", authenticate, authorize(["admin"]), categoryController.deleteCategory)

export default router

