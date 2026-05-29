/*
  Warnings:

  - You are about to drop the column `unreadMessageCount` on the `Conversation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Contact_email_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "unreadMessageCount";
