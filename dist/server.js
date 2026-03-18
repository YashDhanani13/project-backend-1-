"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // ✅ MUST be first line — no duplicate dotenv below
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_js_1 = __importDefault(require("./src/lib/prisma.js"));
const auth_route_js_1 = require("./src/Auth/auth.route.js");
const contacts_route_js_1 = __importDefault(require("./src/modules/contacts/contacts.route.js"));
const employee_route_js_1 = __importDefault(require("./src/modules/employee/employee.route.js"));
const app = (0, express_1.default)();
// ── Middleware ──────────────────────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(helmet_1.default.contentSecurityPolicy({
    directives: { defaultSrc: ["'self'"] },
}));
// Request logger
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${Date.now() - start}ms`);
    });
    next();
});
// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", auth_route_js_1.router);
app.use("/api/contacts", contacts_route_js_1.default);
app.use("/api/employee", employee_route_js_1.default);
app.get("/health", async (_req, res) => {
    try {
        await prisma_js_1.default.$queryRaw `SELECT 1`;
        res.json({ message: "Database connected!", status: "ok" });
    }
    catch {
        res.status(500).json({ message: "Database connection failed" });
    }
});
// ── Global Error Handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error(`[Error] ${err.message}`);
    res.status(500).json({ message: err.message });
});
// ── Cron Jobs ───────────────────────────────────────────────────────────────
node_cron_1.default.schedule("*/10 * * * *", () => {
    console.log("Cron: running every 10 minutes");
});
// ── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const start = async () => {
    try {
        await prisma_js_1.default.$connect();
        console.log("Database connected");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        await prisma_js_1.default.$disconnect();
        process.exit(1);
    }
};
start();
