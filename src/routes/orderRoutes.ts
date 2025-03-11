import { Router } from "express"
import { body } from "express-validator"
import * as orderController from "../controllers/orderController"
import { authenticate, authorize } from "../middleware/auth"
import { validate } from "../middleware/validation"

const router = Router()

// Get my orders
router.get("/my-orders", authenticate, orderController.getMyOrders)

// Get order by ID
// router.get("/:id", authenticate, orderController.getOrderById)

// Create order
router.post(
  "/",
  authenticate,
  validate([
    body("addressId").notEmpty().withMessage("Address ID is required"),
    body("items").isArray().withMessage("Items must be an array"),
    body("items.*.productId").notEmpty().withMessage("Product ID is required"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("items.*.price").isNumeric().withMessage("Price must be a number"),
  ]),
  orderController.createOrder,
)

// Update order status - Admin only
router.patch(
  "/:id/status",
  authenticate,
  authorize(["admin"]),
  validate([body("status").notEmpty().withMessage("Status is required")]),
  // orderController.updateOrderStatus,
)

export default router

