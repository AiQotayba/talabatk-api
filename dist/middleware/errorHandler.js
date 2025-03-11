"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../utils/errors");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof errors_1.CustomError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            errors: err.errors,
        });
    }
    return res.status(500).json({
        success: false,
        error: "Server Error",
    });
};
exports.default = errorHandler;
