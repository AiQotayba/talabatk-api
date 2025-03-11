import { Router } from "express"
import { body } from "express-validator"
import * as cartController from "../controllers/cartController"
import { authenticate } from "../middleware/auth"
import { validate } from "../middleware/validation"

const router = Router()

// Get cart
router.get("/", authenticate, cartController.getCart)

// Add to cart
router.post(
  "/",
  authenticate,
  validate([
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  ]),
  cartController.addToCart,
)

// Update cart item
router.patch(
  "/:id",
  authenticate,
  validate([body("quantity").isInt({ min: 0 }).withMessage("Quantity must be at least 0")]),
  cartController.updateCartItem,
)

// Remove from cart
router.delete("/:id", authenticate, cartController.removeFromCart)

// Clear cart
router.delete("/", authenticate, cartController.clearCart)

export default router

