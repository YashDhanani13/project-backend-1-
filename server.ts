import 'dotenv/config'
import cookieParser from 'cookie-parser'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors' 
import helmet from 'helmet' 
import cron from 'node-cron' 
import prisma from './src/lib/prisma.js'
import { router as authRouter } from './src/auth/auth.route.js' 
import contactsRouter from './src/modules/contacts/contacts.route.js' 
import employeeRouter from './src/modules/employee/employee.route.js' 
import { rateLimit } from 'express-rate-limit'

const app = express()

app.use(helmet()) // secure the malware image  , link , png, video   etc :

app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,   // for cookie allow
    })
)

const limiter = rateLimit({   //limit  set  for 1 user 200 request in 15 min
    windowMs: 15 * 60 * 1000,
    max: 200,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many requests , try againn  later.',
        })
    },
})

app.use(cookieParser()) //  this used to  store  refresh token for thsi used

app.use(express.json()) // build in middleware
app.use(express.urlencoded({ extended: false })) // build in middleware

//which request call this throguh show in terminal

app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now()
    res.on('finish', () => {
        console.log(
            `${req.method} ${req.originalUrl} - ${res.statusCode} - ${Date.now() - start}ms`
        )   
    })
    next()
})

app.use(limiter)
//  route call

app.use('/api/auth', authRouter)
app.use('/api/contacts', contactsRouter)
app.use('/api/employee', employeeRouter)

//starting message :-

app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Welcome to the API backend! 🚀', status: 'running' })
})

// this checkk the  database health check
app.get('/health', async (_req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`
        res.json({ message: 'Database connected!', status: 'ok' })
    } catch {
        res.status(500).json({ message: 'Database connection failed' })
    }
})
//  show the error

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(`[Error] ${err.message}`)
    res.status(500).json({ message: err.message })
})

// ── Cron Jobs ───────────────

cron.schedule('*/10 * * * *', () => {
    console.log('Cron: running every 10 minutes')
})

// // ── Process Crash Handlers ────────────────
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// ── Start Server

const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        await prisma.$connect()
        console.log(' Database connected')

        //port
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        await prisma.$disconnect()
        process.exit(1)
    }
}

start()

export default app
