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
exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getAddressById = exports.getMyAddresses = void 0;
const addressService = __importStar(require("../services/addressService"));
const getMyAddresses = async (req, res, next) => {
    try {
        const addresses = await addressService.getAddressesByUser(req.user.id);
        res.status(200).json({ success: true, data: addresses });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyAddresses = getMyAddresses;
const getAddressById = async (req, res, next) => {
    try {
        const address = await addressService.getAddressById(req.params.id, req.user.id);
        res.status(200).json({ success: true, data: address });
    }
    catch (error) {
        next(error);
    }
};
exports.getAddressById = getAddressById;
const createAddress = async (req, res, next) => {
    try {
        const { address, phone, is_default } = req.body;
        const newAddress = await addressService.createAddress(req.user.id, address, phone, is_default);
        res.status(201).json({ success: true, data: newAddress });
    }
    catch (error) {
        next(error);
    }
};
exports.createAddress = createAddress;
const updateAddress = async (req, res, next) => {
    try {
        const address = await addressService.updateAddress(req.params.id, req.user.id, req.body);
        res.status(200).json({ success: true, data: address });
    }
    catch (error) {
        next(error);
    }
};
exports.updateAddress = updateAddress;
const deleteAddress = async (req, res, next) => {
    try {
        await addressService.deleteAddress(req.params.id, req.user.id);
        res.status(200).json({ success: true, data: {} });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAddress = deleteAddress;
