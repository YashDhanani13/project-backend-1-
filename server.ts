import "dotenv/config"; // ✅ MUST be first line — no duplicate dotenv below

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cron from "node-cron";
import prisma from "./src/lib/prisma.js";
import { router as authRouter } from "./src/Auth/auth.route.js";
import contactsRouter from "./src/modules/contacts/contacts.route.js";
import employeeRouter from "./src/modules/employee/employee.route.js";

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet.contentSecurityPolicy({
  directives: { defaultSrc: ["'self'"] },
}));

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
});

// ── Routes ──────────────────────────────────────────────────────────────────

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/employee", employeeRouter);

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ message: "Database connected!", status: "ok" });
  } catch {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// ── Global Error Handler ────────────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[Error] ${err.message}`);
  res.status(500).json({ message: err.message });
});

// ── Cron Jobs ───────────────────────────────────────────────────────────────

cron.schedule("*/10 * * * *", () => {
  console.log("Cron: running every 10 minutes");
});

// ── Start Server ────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await prisma.$connect(); 
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1); 
  }
};

// Vercel serverless functions shouldn't call app.listen() directly. 
// Export the app for Vercel, but start it normally locally.
if (!process.env.VERCEL) {
  start();
}

export default app;