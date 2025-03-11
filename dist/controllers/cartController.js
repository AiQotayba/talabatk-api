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
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const cartService = __importStar(require("../services/cartService"));
const productService = __importStar(require("../services/productService"));
const errors_1 = require("../utils/errors");
const getCart = async (req, res, next) => {
    try {
        const cartItems = await cartService.getCartItems(req.user.id);
        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        res.status(200).json({
            success: true,
            data: {
                items: cartItems,
                total,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCart = getCart;
const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity, extras, size } = req.body;
        if (!productId || !quantity || quantity <= 0) {
            throw new errors_1.BadRequestError("Product ID and quantity are required");
        }
        // Get product details
        const product = await productService.getProductById(productId);
        const cartItem = await cartService.addToCart(req.user.id, productId, product.name, product.price, quantity, product.image, extras, size);
        res.status(201).json({ success: true, data: cartItem });
    }
    catch (error) {
        next(error);
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        if (quantity === undefined) {
            throw new errors_1.BadRequestError("Quantity is required");
        }
        const cartItem = await cartService.updateCartItem(req.params.id, req.user.id, quantity);
        res.status(200).json({ success: true, data: cartItem });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCartItem = updateCartItem;
const removeFromCart = async (req, res, next) => {
    try {
        await cartService.removeFromCart(req.params.id, req.user.id);
        res.status(200).json({ success: true, data: {} });
    }
    catch (error) {
        next(error);
    }
};
exports.removeFromCart = removeFromCart;
const clearCart = async (req, res, next) => {
    try {
        await cartService.clearCart(req.user.id);
        res.status(200).json({ success: true, data: {} });
    }
    catch (error) {
        next(error);
    }
};
exports.clearCart = clearCart;
