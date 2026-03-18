/*
  Warnings:

  - You are about to drop the column `age` on the `Contact` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('VIP', 'VVIP', 'regular');

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "age",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tag" "Tag",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;
