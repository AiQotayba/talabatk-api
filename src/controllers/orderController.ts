import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/orderService";
import * as cartService from "../services/cartService";
import Order, { OrderStatus } from "../models/Order";
import { NotFoundError } from "../utils/errors";

// الحصول على جميع الطلبات (للإدارة)
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, userId } = req.query;
    const filter: any = {};

    if (status) filter.status = status; // تصفية بناءً على الحالة
    if (userId) filter.user = userId; // تصفية بناءً على المستخدم

    const orders = await Order.find(filter)
      .populate("user", "-password")
      .populate("address")
      .populate({
        path: "items.product",
        model: "Product",
      });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// الحصول على طلبات المستخدم
export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user.id);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// الحصول على طلب بواسطة ID
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const order: any = await Order.findById(id)
      .populate("user", "-password")
      .populate("address")
      .populate({
        path: "items.product",
        model: "Product",
      });

    if (!order) throw new NotFoundError(`Order with ID ${id} not found`);

    // التحقق من الصلاحيات
    if (req.user.role !== "admin" && order.user.toString() !== req.user.id) {
      res.status(403).json({ success: false, error: "Not authorized to view this order" });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// إنشاء طلب جديد
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { addressId, items } = req.body;

    // حساب المبلغ الإجمالي
    const totalAmount = items.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0);

    // إنشاء الطلب
    const orderNew: any = await Order.create({
      user: req.user.id,
      address: addressId,
      items: items.map((item: any) => ({
        product: item.product_id,
        quantity: item.quantity,
        price: item.price,
        extras: item.extras,
      })),
      totalAmount,
      status: OrderStatus.PENDING,
      statusHistory: [
        {
          status: OrderStatus.PENDING,
          timestamp: new Date(),
        },
      ],
    });

    // مسح عناصر السلة
    await cartService.clearCart(req.user.id);

    const order: any = await Order.findOne({ _id: orderNew._id }, { new: true, runValidators: true })
      .populate([
        { path: "user", select: "-password" },
        { path: "address" },
        { path: "items.product", model: "Product" },
      ]);

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// تحديث حالة الطلب (للإدارة)
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, notes } = req.body;

    // التحقق من صحة الحالة
    if (!Object.values(OrderStatus).includes(status)) {
      res.status(400).json({ success: false, error: "Invalid order status" });
      return;
    }

    const order = await orderService.updateOrderStatus(req.params.id, status, notes);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// حذف طلب (للإدارة)
export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) throw new NotFoundError(`Order with ID ${req.params.id} not found`);

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};