import "dotenv/config";
import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cron from "node-cron";
import prisma from "./src/lib/prisma.js";
import { router as authRouter } from "./src/auth/auth.route.js";
import contactsRouter from "./src/modules/contacts/contacts.route.js";
import employeeRouter from "./src/modules/employee/employee.route.js";



const app = express();


app.use(cookieParser());


//first call this helmet
app.use(helmet());

//second call this cors :- 

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, //cookie for 
  }),
);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Request Logger ─────────

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${Date.now() - start}ms`,
    );
  });
  next();
});

// ── Routes ───────────────────

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/employee", employeeRouter);


app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to the API backend! 🚀", status: "running" });
});


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

// ── Cron Jobs ───────────────

cron.schedule("*/10 * * * *", () => {
  console.log("Cron: running every 10 minutes");
});

// ── Process Crash Handlers ────────────────
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// ── Start Server 

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await prisma.$connect();
    console.log(" Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();

export default app;
