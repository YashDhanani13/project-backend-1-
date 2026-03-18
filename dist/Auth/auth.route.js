"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_controller_js_1 = require("./auth.controller.js");
const auth_validation_js_1 = require("./auth.validation.js");
exports.router = (0, express_1.Router)();
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.issues,
        });
        return;
    }
    req.body = result.data;
    next();
};
exports.router.post("/signup", validate(auth_validation_js_1.signupSchema), auth_controller_js_1.signup);
exports.router.post("/login", auth_controller_js_1.login);
