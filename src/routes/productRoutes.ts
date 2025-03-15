import { Router } from "express"
import { body } from "express-validator"
import * as productController from "../controllers/productController"
import { authenticate, authorize } from "../middleware/auth"
import { validate } from "../middleware/validation"

const router = Router()

// Get all products
router.get("/", productController.getAllProducts)

// Get products by category
router.get("/category/:categoryId", productController.getProductsByCategory)

// Get product by ID
router.get("/:id", productController.getProductById)

// Create product - Admin only
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  productController.createProduct,
)

// Update product - Admin only
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]), 
  productController.updateProduct,
)

// Delete product - Admin only
router.delete("/:id", authenticate, authorize(["admin"]), productController.deleteProduct)

export default router

