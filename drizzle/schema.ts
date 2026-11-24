/**
 * Moneypik — Esquema de base de datos (Drizzle / MySQL).
 *
 * REEMPLAZO COMPLETO de drizzle/schema.ts del repo (commit f43fce3).
 * Todo lo que ya existía está igual; al final se añadieron 3 tablas
 * nuevas para cumplir las políticas de Google Play (ver migración
 * drizzle/0002_add_moderation_and_deletion.sql):
 *   - reports: reportes de publicaciones o usuarios (moderación UGC).
 *   - userBlocks: bloqueos entre usuarios.
 *   - deletionRequests: solicitudes de borrado de cuenta desde la web.
 *
 * Después de copiar este archivo al repo, correr: pnpm db:push
 * (drizzle-kit generate && drizzle-kit migrate).
 */
import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  mysqlEnum,
  decimal,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// User profiles
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  username: varchar("username", { length: 50 }),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  totalLikesReceived: int("totalLikesReceived").default(0).notNull(),
  totalCredits: decimal("totalCredits", { precision: 10, scale: 2 }).default("0").notNull(),
  totalWithdrawn: decimal("totalWithdrawn", { precision: 10, scale: 2 }).default("0").notNull(),
  mercadoPagoEmail: varchar("mercadoPagoEmail", { length: 320 }),
  isVerified: boolean("isVerified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Posts (content uploaded by users)
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["photo", "video"]).default("photo").notNull(),
  mediaUrl: text("mediaUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  description: text("description"),
  likesCount: int("likesCount").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Likes
export const likes = mysqlTable("likes", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Transactions (credits earned, withdrawals)
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["credit_earned", "withdrawal_requested", "withdrawal_completed", "withdrawal_rejected"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "rejected"]).default("pending").notNull(),
  description: text("description"),
  postId: int("postId"),
  mercadoPagoId: varchar("mercadoPagoId", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Notifications
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["new_like", "withdrawal_processed", "withdrawal_rejected", "system"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  postId: int("postId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── NUEVO: MODERACIÓN DE CONTENIDO Y BORRADO DE CUENTA ─────────────────────

/**
 * Reportes de contenido o de usuarios (política de contenido generado
 * por usuarios de Google Play). Los revisa el equipo (solo admin).
 * status: pending → reviewed | action_taken | dismissed.
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  reporterUserId: int("reporterUserId").notNull(),
  postId: int("postId"),
  reportedUserId: int("reportedUserId"),
  reason: mysqlEnum("reason", ["spam", "contenido_sexual", "violencia", "acoso", "fraude", "otro"]).notNull(),
  details: text("details"),
  status: mysqlEnum("status", ["pending", "reviewed", "action_taken", "dismissed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Bloqueos entre usuarios: lo que un usuario bloquea no sale en su feed. */
export const userBlocks = mysqlTable("userBlocks", {
  id: int("id").autoincrement().primaryKey(),
  blockerUserId: int("blockerUserId").notNull(),
  blockedUserId: int("blockedUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Solicitudes de borrado de cuenta hechas desde la web (sin la app).
 * El equipo debe procesarlas en un máximo de 30 días.
 */
export const deletionRequests = mysqlTable("deletionRequests", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  userId: int("userId"),
  status: mysqlEnum("status", ["pending", "completed"]).default("pending").notNull(),
  requestedAt: timestamp("requestedAt").defaultNow().notNull(),
  processedAt: timestamp("processedAt"),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type UserBlock = typeof userBlocks.$inferSelect;
export type DeletionRequest = typeof deletionRequests.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type InsertPost = typeof posts.$inferInsert;
export type InsertLike = typeof likes.$inferInsert;
export type InsertTransaction = typeof transactions.$inferInsert;
export type InsertNotification = typeof notifications.$inferInsert;
export type InsertReport = typeof reports.$inferInsert;
export type InsertUserBlock = typeof userBlocks.$inferInsert;
export type InsertDeletionRequest = typeof deletionRequests.$inferInsert;
