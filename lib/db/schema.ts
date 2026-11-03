import type { InferSelectModel } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import type { AppUsage } from "../usage";

export const user = sqliteTable("User", {
  id: text("id").primaryKey().notNull(),
  email: text("email", { length: 64 }).notNull().unique(),
  password: text("password", { length: 64 }),
});
export type User = InferSelectModel<typeof user>;

export const chat = sqliteTable("Chat", {
  id: text("id").primaryKey().notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  title: text("title").notNull(),
  userId: text("userId").notNull().references(() => user.id),
  visibility: text("visibility", { enum: ["public", "private"] }).notNull().default("private"),
  lastContext: text("lastContext", { mode: "json" }).$type<AppUsage | null>(),
}, (table) => [index("Chat_userId_createdAt_idx").on(table.userId, table.createdAt)]);
export type Chat = InferSelectModel<typeof chat>;

export const messageDeprecated = sqliteTable("Message", {
  id: text("id").primaryKey().notNull(),
  chatId: text("chatId").notNull().references(() => chat.id),
  role: text("role").notNull(),
  content: text("content", { mode: "json" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});
export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

export const message = sqliteTable("Message_v2", {
  id: text("id").primaryKey().notNull(),
  chatId: text("chatId").notNull().references(() => chat.id),
  role: text("role").notNull(),
  parts: text("parts", { mode: "json" }).notNull(),
  attachments: text("attachments", { mode: "json" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
}, (table) => [index("Message_v2_chatId_createdAt_idx").on(table.chatId, table.createdAt)]);
export type DBMessage = InferSelectModel<typeof message>;

export const voteDeprecated = sqliteTable("Vote", {
  chatId: text("chatId").notNull().references(() => chat.id),
  messageId: text("messageId").notNull().references(() => messageDeprecated.id),
  isUpvoted: integer("isUpvoted", { mode: "boolean" }).notNull(),
}, (table) => [primaryKey({ columns: [table.chatId, table.messageId] })]);
export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>;

export const vote = sqliteTable("Vote_v2", {
  chatId: text("chatId").notNull().references(() => chat.id),
  messageId: text("messageId").notNull().references(() => message.id),
  isUpvoted: integer("isUpvoted", { mode: "boolean" }).notNull(),
}, (table) => [primaryKey({ columns: [table.chatId, table.messageId] })]);
export type Vote = InferSelectModel<typeof vote>;

export const document = sqliteTable("Document", {
  id: text("id").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  title: text("title").notNull(),
  content: text("content"),
  kind: text("kind", { enum: ["text", "code", "image", "sheet"] }).notNull().default("text"),
  userId: text("userId").notNull().references(() => user.id),
}, (table) => [primaryKey({ columns: [table.id, table.createdAt] })]);
export type Document = InferSelectModel<typeof document>;

export const suggestion = sqliteTable("Suggestion", {
  id: text("id").primaryKey().notNull(),
  documentId: text("documentId").notNull(),
  documentCreatedAt: integer("documentCreatedAt", { mode: "timestamp" }).notNull(),
  originalText: text("originalText").notNull(),
  suggestedText: text("suggestedText").notNull(),
  description: text("description"),
  isResolved: integer("isResolved", { mode: "boolean" }).notNull().default(false),
  userId: text("userId").notNull().references(() => user.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
}, (table) => [foreignKey({ columns: [table.documentId, table.documentCreatedAt], foreignColumns: [document.id, document.createdAt] })]);
export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = sqliteTable("Stream", {
  id: text("id").primaryKey().notNull(),
  chatId: text("chatId").notNull().references(() => chat.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});
export type Stream = InferSelectModel<typeof stream>;
