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
 
  categoryController.createCategory,
)

// Update category - Admin only
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]), 
  categoryController.updateCategory,
)

// Delete category - Admin only
router.delete("/:id", authenticate, authorize(["admin"]), categoryController.deleteCategory)

export default router

