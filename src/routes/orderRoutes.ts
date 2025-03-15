import { Router } from "express";
import { body } from "express-validator";
import * as orderController from "../controllers/orderController";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validation";

const router = Router();

// الحصول على جميع الطلبات (للإدارة)
router.get("/", authenticate, authorize(["admin"]), orderController.getAllOrders);

// الحصول على طلبات المستخدم
router.get("/my-orders", authenticate, orderController.getMyOrders);

// الحصول على طلب بواسطة ID
router.get("/:id", authenticate, orderController.getOrderById);

// إنشاء طلب جديد
router.post("/", authenticate, orderController.createOrder);

// تحديث حالة الطلب (للإدارة)
router.patch(
  "/:id/status",
  authenticate,
  authorize(["admin"]),
  validate([body("status").notEmpty().withMessage("Status is required")]),
  orderController.updateOrderStatus
);

// حذف طلب (للإدارة)
router.delete("/:id", authenticate, authorize(["admin"]), orderController.deleteOrder);

export default router;