CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT
);
CREATE TABLE IF NOT EXISTS "Chat" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "createdAt" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "visibility" TEXT NOT NULL DEFAULT 'private' CHECK ("visibility" IN ('public','private')),
  "lastContext" TEXT
);
CREATE INDEX IF NOT EXISTS "Chat_userId_createdAt_idx" ON "Chat" ("userId","createdAt");
CREATE TABLE IF NOT EXISTS "Message" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "chatId" TEXT NOT NULL REFERENCES "Chat"("id"),
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "Message_v2" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "chatId" TEXT NOT NULL REFERENCES "Chat"("id"),
  "role" TEXT NOT NULL,
  "parts" TEXT NOT NULL,
  "attachments" TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS "Message_v2_chatId_createdAt_idx" ON "Message_v2" ("chatId","createdAt");
CREATE TABLE IF NOT EXISTS "Vote" (
  "chatId" TEXT NOT NULL REFERENCES "Chat"("id"),
  "messageId" TEXT NOT NULL REFERENCES "Message"("id"),
  "isUpvoted" INTEGER NOT NULL,
  PRIMARY KEY ("chatId","messageId")
);
CREATE TABLE IF NOT EXISTS "Vote_v2" (
  "chatId" TEXT NOT NULL REFERENCES "Chat"("id"),
  "messageId" TEXT NOT NULL REFERENCES "Message_v2"("id"),
  "isUpvoted" INTEGER NOT NULL,
  PRIMARY KEY ("chatId","messageId")
);
CREATE TABLE IF NOT EXISTS "Document" (
  "id" TEXT NOT NULL,
  "createdAt" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT,
  "kind" TEXT NOT NULL DEFAULT 'text' CHECK ("kind" IN ('text','code','image','sheet')),
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  PRIMARY KEY ("id","createdAt")
);
CREATE TABLE IF NOT EXISTS "Suggestion" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "documentId" TEXT NOT NULL,
  "documentCreatedAt" INTEGER NOT NULL,
  "originalText" TEXT NOT NULL,
  "suggestedText" TEXT NOT NULL,
  "description" TEXT,
  "isResolved" INTEGER NOT NULL DEFAULT 0,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" INTEGER NOT NULL,
  FOREIGN KEY ("documentId","documentCreatedAt") REFERENCES "Document"("id","createdAt")
);
CREATE TABLE IF NOT EXISTS "Stream" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "chatId" TEXT NOT NULL REFERENCES "Chat"("id"),
  "createdAt" INTEGER NOT NULL
);
