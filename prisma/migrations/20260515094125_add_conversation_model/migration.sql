-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "contactId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "lastMessage" TEXT,
    "lastMessageAt" TIMESTAMP(3),
    "lastMessageType" "MessageType",
    "unreadMessageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_contactId_key" ON "Conversation"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_roomId_key" ON "Conversation"("roomId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
