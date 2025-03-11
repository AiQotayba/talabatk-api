"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCartItems = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const errors_1 = require("../utils/errors");
const getCartItems = async (userId) => {
    return Cart_1.default.find({ user: userId }).sort({ createdAt: 1 }).populate("product");
};
exports.getCartItems = getCartItems;
const addToCart = async (userId, productId, name, price, quantity, image, extras, size) => {
    // Check if item already exists in cart
    const existingItem = await Cart_1.default.findOne({
        user: userId,
        product: productId,
        extras: extras || {},
        size: size || {},
    });
    if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
        return existingItem.save();
    }
    else {
        // Add new item
        const cartItem = new Cart_1.default({
            user: userId,
            product: productId,
            name,
            price,
            image,
            quantity,
            extras: extras || {},
            size: size || {},
        });
        return cartItem.save();
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (id, userId, quantity) => {
    // Check if item exists
    const cartItem = await Cart_1.default.findOne({ _id: id, user: userId });
    if (!cartItem) {
        throw new errors_1.NotFoundError(`Cart item with ID ${id} not found`);
    }
    if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await Cart_1.default.findByIdAndDelete(id);
        return { ...cartItem.toObject(), quantity: 0 };
    }
    else {
        // Update quantity
        cartItem.quantity = quantity;
        return cartItem.save();
    }
};
exports.updateCartItem = updateCartItem;
const removeFromCart = async (id, userId) => {
    // Check if item exists
    const cartItem = await Cart_1.default.findOne({ _id: id, user: userId });
    if (!cartItem) {
        throw new errors_1.NotFoundError(`Cart item with ID ${id} not found`);
    }
    await Cart_1.default.findByIdAndDelete(id);
};
exports.removeFromCart = removeFromCart;
const clearCart = async (userId) => {
    await Cart_1.default.deleteMany({ user: userId });
};
exports.clearCart = clearCart;
