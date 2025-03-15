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
exports.deleteOrder = exports.updateOrderStatus = exports.createOrder = exports.getOrderById = exports.getMyOrders = exports.getAllOrders = void 0;
const orderService = __importStar(require("../services/orderService"));
const Order_1 = __importStar(require("../models/Order"));
const cartService = __importStar(require("../services/cartService"));
const errors_1 = require("../utils/errors");
// الحصول على جميع الطلبات (للإدارة)
const getAllOrders = async (req, res, next) => {
    try {
        const { status, userId } = req.query;
        const filter = {};
        if (status)
            filter.status = status; // تصفية بناءً على الحالة
        if (userId)
            filter.user = userId; // تصفية بناءً على المستخدم
        const orders = await Order_1.default.find(filter)
            .populate("user", "-password")
            .populate("address")
            .populate({
            path: "items.product",
            model: "Product",
        });
        res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllOrders = getAllOrders;
// الحصول على طلبات المستخدم
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getOrdersByUser(req.user.id);
        res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyOrders = getMyOrders;
// الحصول على طلب بواسطة ID
const getOrderById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await Order_1.default.findById(id)
            .populate("user", "-password")
            .populate("address")
            .populate({
            path: "items.product",
            model: "Product",
        });
        if (!order)
            throw new errors_1.NotFoundError(`Order with ID ${id} not found`);
        // التحقق من الصلاحيات
        if (req.user.role !== "admin" && order.user.toString() !== req.user.id) {
            res.status(403).json({ success: false, error: "Not authorized to view this order" });
            return;
        }
        res.status(200).json({ success: true, data: order });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderById = getOrderById;
// إنشاء طلب جديد
const createOrder = async (req, res, next) => {
    try {
        const { addressId, items } = req.body;
        // حساب المبلغ الإجمالي
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // إنشاء الطلب
        const orderNew = await Order_1.default.create({
            user: req.user.id,
            address: addressId,
            items: items.map((item) => ({
                product: item.product_id,
                quantity: item.quantity,
                price: item.price,
                extras: item.extras,
            })),
            totalAmount,
            status: Order_1.OrderStatus.PENDING,
            statusHistory: [
                {
                    status: Order_1.OrderStatus.PENDING,
                    timestamp: new Date(),
                },
            ],
        });
        // مسح عناصر السلة
        await cartService.clearCart(req.user.id);
        const order = await Order_1.default.findOne({ _id: orderNew._id }, { new: true, runValidators: true })
            .populate([
            { path: "user", select: "-password" },
            { path: "address" },
            { path: "items.product", model: "Product" },
        ]);
        res.status(201).json({ success: true, data: order });
    }
    catch (error) {
        next(error);
    }
};
exports.createOrder = createOrder;
// تحديث حالة الطلب (للإدارة)
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status, notes } = req.body;
        // التحقق من صحة الحالة
        if (!Object.values(Order_1.OrderStatus).includes(status)) {
            res.status(400).json({ success: false, error: "Invalid order status" });
            return;
        }
        const order = await orderService.updateOrderStatus(req.params.id, status, notes);
        res.status(200).json({ success: true, data: order });
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrderStatus = updateOrderStatus;
// حذف طلب (للإدارة)
const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order_1.default.findByIdAndDelete(req.params.id);
        if (!order)
            throw new errors_1.NotFoundError(`Order with ID ${req.params.id} not found`);
        res.status(200).json({ success: true, message: "Order deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteOrder = deleteOrder;
