"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.OrderStatus = void 0;
const Order_1 = require("./Order");
Object.defineProperty(exports, "OrderStatus", { enumerable: true, get: function () { return Order_1.OrderStatus; } });
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["DELIVERY"] = "delivery";
})(UserRole || (exports.UserRole = UserRole = {}));
