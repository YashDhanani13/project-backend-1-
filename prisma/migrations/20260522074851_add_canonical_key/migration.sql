/*
  Warnings:

  - A unique constraint covering the columns `[canonicalKey]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "canonicalKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Room_canonicalKey_key" ON "Room"("canonicalKey");
