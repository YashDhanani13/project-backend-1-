import { PrismaClient } from "@prisma/client";
import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding... 🌱");

  // 1. SEED ORGANIZATIONS / USERS
  const userData = [
    { organizationName: "vokswagon", email: "prince@gmail.com", password: "prince123" },
    { organizationName: "charuset", email: "ishan@gmail.com", password: "ishan123" },
    { organizationName: "birala", email: "ridham@gmail.com", password: "ridham123" },
  ];

  for (const user of userData) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email }, // Email must be unique in your schema
      update: {},
      create: {
        email: user.email,
        password: hashedPassword,
        organizationName: user.organizationName,
      },
    });
  }
  console.log("Users/Orgs Seeded ");

  // 2. SEED CONTACT DATA
  const contactData = [

    { name: "jayveer", email: "jayverr23@gmail.com", password: "jayveer@123", age: 22, phoneNumber: 9903949393, address: "nana varacha surat" },
    { name: "ishan", email: "ishan43@gmail.com", password: "ishan@123", age: 52, phoneNumber: 9904913583, address: "bhavnagar kaliyabid" },
    { name: "priyam", email: "priyam22@gmail.com", password: "priyam@123", age: 62, phoneNumber: 9904955583, address: "new mumbai" },
    { name: "akshar", email: "akshar100@gmail.com", password: "akshar@123", age: 72, phoneNumber: 990487883, address: "near sardar colony hyderabad" },
    { name: "riyansh", email: "riyansh22@gmail.com", password: "riyansh@123", age: 52, phoneNumber: 990498583, address: "shubhash nagar rajasthan" },
    { name: "rinku", email: "rinku@gmail.com", password: "rinku@123", age: 80, phoneNumber: 990495236, address: "dabholi gaytri soc surat" },
    { name: "harsh", email: "harsh.v@gmail.com", password: "harsh@123", age: 25, phoneNumber: 9825012345, address: "vesu main road surat" },
    { name: "darshan", email: "darshan88@gmail.com", password: "darshan@123", age: 30, phoneNumber: 9712345678, address: "katargam darwaja surat" },
    { name: "meet", email: "meet_patel@gmail.com", password: "meet@123", age: 28, phoneNumber: 9099887766, address: "adajan patiya surat" },
    { name: "yashvi", email: "yashvi_99@gmail.com", password: "yashvi@123", age: 21, phoneNumber: 8866554433, address: "piplod lake garden surat" },
    { name: "karan", email: "karan.dev@gmail.com", password: "karan@123", age: 35, phoneNumber: 7755443322, address: "iskcon mandir road ahmedabad" },
    { name: "manav", email: "manav_p@gmail.com", password: "manav@123", age: 40, phoneNumber: 9900112233, address: "race course rajkot" },
    { name: "sneha", email: "sneha_shah@gmail.com", password: "sneh@123", age: 24, phoneNumber: 9122334455, address: "m.g. road vadodara" },
    { name: "vivek", email: "vivek.surat@gmail.com", password: "vivek@123", age: 27, phoneNumber: 9555667788, address: "yogichowk varacha surat" },

    // ... add others here
  ];

  for (const contact of contactData) {
    await prisma.contact.upsert({
      where: { email: contact.email },
      update: {},
      create: contact,
    });
  }
  console.log("Contacts Seeded ");

  // 3. SEED EMPLOYEE DATA
  const employeeData = [
    { name: "Jayveer", email: "jayverr23@gmail.com", role: "Admin", phoneNumber: "9903949393", status: "Active" },
    { name: "Ishan", email: "ishan43@gmail.com", role: "Employee", phoneNumber: "9904913583", status: "Inactive" },
    { name: "Priyam", email: "priyam22@gmail.com", role: "Employee", phoneNumber: "9904955583", status: "Active" },
    { name: "Akshar", email: "akshar100@gmail.com", role: "Admin", phoneNumber: "990487883", status: "Active" },
    { name: "Riyansh", email: "riyansh22@gmail.com", role: "Employee", phoneNumber: "990498583", status: "Inactive" },
    { name: "Rinku", email: "rinku@gmail.com", role: "Employee", phoneNumber: "990495236", status: "Active" },
    { name: "Harsh", email: "harsh.v@gmail.com", role: "Admin", phoneNumber: "9825012345", status: "Inactive" },
    { name: "Darshan", email: "darshan88@gmail.com", role: "Employee", phoneNumber: "9712345678", status: "Active" },
    { name: "Meet", email: "meet_patel@gmail.com", role: "Admin", phoneNumber: "9099887766", status: "Active" },
    { name: "Yashvi", email: "yashvi_99@gmail.com", role: "Employee", phoneNumber: "8866554433", status: "Inactive" },
    { name: "Karan", email: "karan.dev@gmail.com", role: "Employee", phoneNumber: "7755443322", status: "Active" },
    { name: "Manav", email: "manav_p@gmail.com", role: "Admin", phoneNumber: "9900112233", status: "Active" },
    { name: "Sneha", email: "sneha_shah@gmail.com", role: "Employee", phoneNumber: "9122334455", status: "Inactive" },
    { name: "Vivek", role: "Employee", email: "vivek.surat@gmail.com", phoneNumber: "9555667788", status: "Active" },
    { name: "Anita", email: "anita_b@gmail.com", role: "Admin", phoneNumber: "9444332211", status: "Inactive" }
    // ... add others here
  ];

  for (const emp of employeeData) {
    await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: emp,
    });
  }
  console.log("Employees Seeded");

  console.log("Seeding complete! 🚀");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });