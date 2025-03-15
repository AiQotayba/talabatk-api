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
exports.getAllOrders = exports.updateOrderStatus = exports.createOrder = exports.getOrderById = exports.getOrdersByUser = void 0;
const Order_1 = __importStar(require("../models/Order"));
const errors_1 = require("../utils/errors");
const cartService = __importStar(require("./cartService"));
const getOrdersByUser = async (userId) => {
    return Order_1.default.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user", "-password")
        .populate("address")
        .populate({
        path: "items.product",
        model: "Product",
    });
};
exports.getOrdersByUser = getOrdersByUser;
const getOrderById = async (id) => {
    const order = await Order_1.default.findById(id).populate("user", "-password").populate("address").populate({
        path: "items.product",
        model: "Product",
    });
    if (!order) {
        throw new errors_1.NotFoundError(`Order with ID ${id} not found`);
    }
    return order;
};
exports.getOrderById = getOrderById;
const createOrder = async (userId, addressId, items) => {
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Create order
    const orderNew = Order_1.default.create({
        user: userId,
        address: addressId,
        items: items.map((item) => ({
            product: item.productId,
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
    // Clear cart items
    await cartService.clearCart(userId);
    const order = await Order_1.default.findOne({ _id: orderNew._id }, { new: true, runValidators: true })
        .populate([{ path: "user", select: "-password" }, { path: "address" }, { path: "items.product", model: "Product" }]);
    return order;
};
exports.createOrder = createOrder;
const updateOrderStatus = async (orderId, status, notes) => {
    // Check if order exists
    const order = await (0, exports.getOrderById)(orderId);
    // Update order status
    order.status = status;
    // Add to status history
    order.statusHistory.push({
        status,
        notes,
        timestamp: new Date(),
    });
    await order.save();
    return order;
};
exports.updateOrderStatus = updateOrderStatus;
const getAllOrders = async () => {
    return Order_1.default.find().sort({ createdAt: -1 }).populate("user", "-password").populate("address").populate({
        path: "items.product",
        model: "Product",
    });
};
exports.getAllOrders = getAllOrders;
