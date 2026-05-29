/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,contactId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversation_organizationId_contactId_key" ON "Conversation"("organizationId", "contactId");
