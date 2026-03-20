// // prisma/seed.js

// // const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// async function main() {
//   console.log("starting now ");
// //----------------------------------------------
//   const user1 = await prisma.user.upsert({
//     data: {
//       email: "prince@gmail.com",
//       password: "prince123",
//     }
//   });
//   console.log("User created:", user1.id);
// //--------------------------------------------------
//   const user2 = await prisma.user.upsert({
//     data: {
//       email: "ishan@gmail.com",
//       password: "ishan123",
//     }
//   });
//   console.log("User created:", user2.id);
// // ---------------------------------------------------
//   const user3 = await prisma.user.upsert({
//     data: {
//       email: "ridham@gmail.com",
//       password: "ridham123",
//     }
//   });
//   console.log("User created:", user3.id);

// //----------------------------------------------------
//   const user4 = await prisma.user.upsert({
//     data: {
//       email: "vrushabh@gmail.com",
//       password: "vrusbhabh123",
//     }
//   });
//   console.log("User created:", user4.id);
//   //--------------------------------------------
//     const user5 = await prisma.user.upsert({
//     data: {
//       email: "jeel@gmail.com",
//       password: "jeel123",
//     }
//   });
//   console.log("User created:", user5.id);

//   console.log("this are  compleet ");

// }


// main()
//   .catch((e) => {
//     console.error(" Seed error:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });