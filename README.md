# Backend API

This is the backend API for the application, built using **Node.js, Express, TypeScript, and Prisma**, with a **PostgreSQL** database. The project is designed for serverless deployment on **Vercel**.

## 🚀 Tech Stack

- **Framework:** Express.js + TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (NeonDB / Local PostgreSQL)
- **Validation:** Zod
- **Authentication:** JWT (JSON Web Tokens) & bcrypt
- **Security:** Helmet, CORS
- **Deployment:** Vercel

---

## 📂 Project Structure

```bash
📦 backend
├── 📂 prisma              # Prisma schema, migrations, and seed data
│   ├── schema.prisma   # Database schema definition
│   └── seed.js         # Database seeder script
├── 📂 src                 # Application source code
│   ├── 📂 Auth            # Authentication module (Routes, Controller, Service)
│   ├── 📂 lib             # Shared utilities (e.g., Prisma client setup)
│   ├── 📂 modules         # Domain-specific modules
│   │   ├── 📂 contacts    # Contact management (CRUD)
│   │   └── 📂 employee    # Employee management (CRUD)
│   └── server.ts       # Application entry point
├── .env                # Environment variables
├── vercel.json         # Vercel deployment configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

---

## 🛡️ Environment Variables

Create a `.env` file in the root directory based on the following variables:

```env
PORT=3000

# Prisma Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"

# JWT Secret for Authentication
JWT_SECRET="your_jwt_secret_here"

# Frontend URL for CORS (optional)
# FRONTEND_URL="http://localhost:3000"
```

---

## 💻 Getting Started

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Database Setup

Generate the Prisma client and push the schema to the database:

```bash
npx prisma generate
npx prisma db push
```

*(Optional)* If you want to seed initial data:

```bash
node prisma/seed.js
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or `PORT` from `.env`).

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `nodemon src/server.ts` | Start the development server with live reload |
| `npm run build` | `tsc` | Compile TypeScript into JavaScript |
| `npm start` | `node dist/server.js` | Run the compiled production server |
| `npm run postinstall`| `prisma generate` | Auto-generate Prisma client after install |

---

## 🔗 API Endpoints

### 🩺 Health & Root
- `GET /` — API root, returns basic welcome message.
- `GET /health` — Verifies database connection.

### 🔐 Authentication (`/api/auth`)
- Responsible for User and Organization registration & login.

### 📞 Contacts (`/api/contacts`)
- Manage contacts (Create, Read, Update, Delete).

### 👥 Employees (`/api/employee`)
- Manage employee records and tracking.

---

## ☁️ Deployment

This project is configured for deployment on **Vercel**. 

To deploy:
1. Push your code to GitHub.
2. Link the repository to your Vercel account.
3. Configure the **Environment Variables** (`DATABASE_URL`, `JWT_SECRET`) in Vercel settings.
4. Deploy. (The `vercel.json` and `postinstall` script will handle the build and Prisma client generation automatically.)

---
