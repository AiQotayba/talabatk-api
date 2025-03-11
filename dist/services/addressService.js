"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getAddressById = exports.getAddressesByUser = void 0;
const Address_1 = __importDefault(require("../models/Address"));
const errors_1 = require("../utils/errors");
const getAddressesByUser = async (userId) => {
    return Address_1.default.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
};
exports.getAddressesByUser = getAddressesByUser;
const getAddressById = async (id, userId) => {
    const address = await Address_1.default.findOne({ _id: id, user: userId });
    if (!address) {
        throw new errors_1.NotFoundError(`Address with ID ${id} not found`);
    }
    return address;
};
exports.getAddressById = getAddressById;
const createAddress = async (userId, addressText, phone, isDefault = false) => {
    // If this is the default address, unset any existing default
    if (isDefault) {
        await Address_1.default.updateMany({ user: userId, isDefault: true }, { isDefault: false });
    }
    // Create new address
    const address = new Address_1.default({
        user: userId,
        address: addressText,
        phone,
        isDefault,
    });
    return address.save();
};
exports.createAddress = createAddress;
const updateAddress = async (id, userId, addressData) => {
    const { address, phone, isDefault } = addressData;
    // Check if address exists
    await (0, exports.getAddressById)(id, userId);
    // If setting as default, unset any existing default
    if (isDefault) {
        await Address_1.default.updateMany({ user: userId, isDefault: true }, { isDefault: false });
    }
    // Update address
    const updatedAddress = await Address_1.default.findOneAndUpdate({ _id: id, user: userId }, { address, phone, isDefault }, { new: true, runValidators: true });
    if (!updatedAddress) {
        throw new errors_1.NotFoundError(`Address with ID ${id} not found`);
    }
    return updatedAddress;
};
exports.updateAddress = updateAddress;
const deleteAddress = async (id, userId) => {
    // Check if address exists
    const address = await (0, exports.getAddressById)(id, userId);
    // Delete address
    await Address_1.default.findByIdAndDelete(id);
    // If this was the default address, set another address as default
    if (address.isDefault) {
        const addresses = await (0, exports.getAddressesByUser)(userId);
        if (addresses.length > 0) {
            await Address_1.default.findByIdAndUpdate(addresses[0]._id, { isDefault: true });
        }
    }
};
exports.deleteAddress = deleteAddress;
