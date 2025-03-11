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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProductsByCategory = exports.getAllProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const errors_1 = require("../utils/errors");
const categoryService = __importStar(require("./categoryService"));
const getAllProducts = async () => {
    return Product_1.default.find().sort({ name: 1 }).populate("category");
};
exports.getAllProducts = getAllProducts;
const getProductsByCategory = async (categoryId) => {
    return Product_1.default.find({ category: categoryId }).sort({ name: 1 }).populate("category");
};
exports.getProductsByCategory = getProductsByCategory;
const getProductById = async (id) => {
    const product = await Product_1.default.findById(id).populate("category");
    if (!product) {
        throw new errors_1.NotFoundError(`Product with ID ${id} not found`);
    }
    return product;
};
exports.getProductById = getProductById;
const createProduct = async (productData) => {
    const { name, description, price, image, category } = productData;
    const product = new Product_1.default({
        name,
        description,
        price,
        image,
        category,
    });
    const savedProduct = await product.save();
    // Update category options count
    await categoryService.incrementCategoryOptionsCount(category);
    return savedProduct.populate("category");
};
exports.createProduct = createProduct;
const updateProduct = async (id, productData) => {
    const { name, description, price, image, category } = productData;
    // Check if product exists and get current category
    const currentProduct = await (0, exports.getProductById)(id);
    const product = await Product_1.default.findByIdAndUpdate(id, { name, description, price, image, category }, { new: true, runValidators: true }).populate("category");
    if (!product) {
        throw new errors_1.NotFoundError(`Product with ID ${id} not found`);
    }
    // If category changed, update counts
    if (category && currentProduct.category.toString() !== category.toString()) {
        await categoryService.decrementCategoryOptionsCount(currentProduct.category.toString());
        await categoryService.incrementCategoryOptionsCount(category);
    }
    return product;
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    // Check if product exists and get current category
    const product = await (0, exports.getProductById)(id);
    await Product_1.default.findByIdAndDelete(id);
    // Update category options count
    await categoryService.decrementCategoryOptionsCount(product.category.toString());
};
exports.deleteProduct = deleteProduct;
