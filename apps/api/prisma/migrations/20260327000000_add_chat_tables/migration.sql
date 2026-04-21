-- CreateTable: ChatRoom
CREATE TABLE "chat_rooms" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "userName" TEXT,
    "adminId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastMessage" TEXT,
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ChatMessage
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "senderId" TEXT,
    "senderType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: chat_rooms indexes
CREATE INDEX "chat_rooms_userId_idx" ON "chat_rooms"("userId");
CREATE INDEX "chat_rooms_adminId_idx" ON "chat_rooms"("adminId");
CREATE INDEX "chat_rooms_status_idx" ON "chat_rooms"("status");

-- CreateIndex: chat_messages indexes
CREATE INDEX "chat_messages_roomId_idx" ON "chat_messages"("roomId");
CREATE INDEX "chat_messages_senderId_idx" ON "chat_messages"("senderId");
CREATE INDEX "chat_messages_createdAt_idx" ON "chat_messages"("createdAt");

-- AddForeignKey: chat_rooms.userId -> users.id
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: chat_rooms.adminId -> users.id
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_adminId_fkey"
    FOREIGN KEY ("adminId") REFERENCES "users"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: chat_messages.roomId -> chat_rooms.id
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_roomId_fkey"
    FOREIGN KEY ("roomId") REFERENCES "chat_rooms"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
