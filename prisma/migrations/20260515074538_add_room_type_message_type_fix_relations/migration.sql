/*
  Warnings:

  - You are about to drop the column `unreadMessageCount` on the `Room` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('DIRECT', 'GROUP');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'TEXT';

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "unreadMessageCount",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "type" "RoomType" NOT NULL DEFAULT 'DIRECT';

-- AlterTable
ALTER TABLE "UserRoom" ADD COLUMN     "unreadMessageCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
