"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrementCategoryOptionsCount = exports.incrementCategoryOptionsCount = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const errors_1 = require("../utils/errors");
const getAllCategories = async () => {
    return Category_1.default.find().sort({ name: 1 });
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (id) => {
    const category = await Category_1.default.findById(id);
    if (!category) {
        throw new errors_1.NotFoundError(`Category with ID ${id} not found`);
    }
    return category;
};
exports.getCategoryById = getCategoryById;
const createCategory = async (categoryData) => {
    const { name, image } = categoryData;
    const category = new Category_1.default({
        name,
        image,
        optionsCount: 0,
    });
    return category.save();
};
exports.createCategory = createCategory;
const updateCategory = async (id, categoryData) => {
    const { name, image } = categoryData;
    // Check if category exists
    await (0, exports.getCategoryById)(id);
    const category = await Category_1.default.findByIdAndUpdate(id, { name, image }, { new: true, runValidators: true });
    if (!category) {
        throw new errors_1.NotFoundError(`Category with ID ${id} not found`);
    }
    return category;
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    // Check if category exists
    await (0, exports.getCategoryById)(id);
    await Category_1.default.findByIdAndDelete(id);
};
exports.deleteCategory = deleteCategory;
const incrementCategoryOptionsCount = async (id) => {
    await Category_1.default.findByIdAndUpdate(id, { $inc: { optionsCount: 1 } });
};
exports.incrementCategoryOptionsCount = incrementCategoryOptionsCount;
const decrementCategoryOptionsCount = async (id) => {
    await Category_1.default.findByIdAndUpdate(id, { $inc: { optionsCount: -1 } });
};
exports.decrementCategoryOptionsCount = decrementCategoryOptionsCount;
