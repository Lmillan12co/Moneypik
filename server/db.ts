import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ─── MONEYPIK FEATURES ───────────────────────────────────────────────────────

import { desc, and, sql } from "drizzle-orm";
import {
  profiles,
  posts,
  likes,
  transactions,
  notifications,
  type InsertProfile,
  type InsertPost,
  type InsertTransaction,
  type InsertNotification,
} from "../drizzle/schema";

// ─── PROFILES ────────────────────────────────────────────────────────────────

export async function getProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result[0] ?? null;
}

export async function createProfile(data: InsertProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(profiles).values(data);
  return result[0].insertId;
}

export async function updateProfile(userId: number, data: Partial<InsertProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(profiles).set(data).where(eq(profiles.userId, userId));
}

export async function getOrCreateProfile(userId: number, name?: string | null) {
  const existing = await getProfile(userId);
  if (existing) return existing;
  await createProfile({ userId, username: name ?? undefined });
  return getProfile(userId);
}

// ─── POSTS ───────────────────────────────────────────────────────────────────

export async function getFeedPosts(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(posts)
    .where(eq(posts.isActive, true))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getUserPosts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(posts)
    .where(and(eq(posts.userId, userId), eq(posts.isActive, true)))
    .orderBy(desc(posts.createdAt));
}

export async function createPost(data: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(posts).values(data);
  return result[0].insertId;
}

export async function getPost(postId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  return result[0] ?? null;
}

export async function deletePost(postId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(posts).set({ isActive: false }).where(and(eq(posts.id, postId), eq(posts.userId, userId)));
}

// ─── LIKES ───────────────────────────────────────────────────────────────────

export async function hasUserLikedPost(userId: number, postId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
    .limit(1);
  return result.length > 0;
}

export async function likePost(userId: number, postId: number, postOwnerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const CREDIT_PER_LIKE = "0.01";

  await db.insert(likes).values({ userId, postId });
  await db.update(posts).set({ likesCount: sql`${posts.likesCount} + 1` }).where(eq(posts.id, postId));
  await db.update(profiles).set({
    totalLikesReceived: sql`${profiles.totalLikesReceived} + 1`,
    totalCredits: sql`${profiles.totalCredits} + ${CREDIT_PER_LIKE}`,
  }).where(eq(profiles.userId, postOwnerId));
  await db.insert(transactions).values({
    userId: postOwnerId,
    type: "credit_earned",
    amount: CREDIT_PER_LIKE,
    currency: "USD",
    status: "completed",
    description: "Crédito por like recibido",
    postId,
  });
  if (postOwnerId !== userId) {
    await db.insert(notifications).values({
      userId: postOwnerId,
      type: "new_like",
      title: "¡Nuevo like!",
      message: "Alguien le dio like a tu publicación",
      postId,
    });
  }
}

export async function unlikePost(userId: number, postId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
  await db.update(posts).set({ likesCount: sql`GREATEST(${posts.likesCount} - 1, 0)` }).where(eq(posts.id, postId));
}

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────

export async function getUserTransactions(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt)).limit(limit);
}

export async function requestWithdrawal(userId: number, amount: number, mercadoPagoEmail: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const MIN_WITHDRAWAL = 20;
  const FEE_RATE = 0.05;
  if (amount < MIN_WITHDRAWAL) throw new Error(`El monto mínimo de retiro es $${MIN_WITHDRAWAL} USD`);
  const profile = await getProfile(userId);
  if (!profile) throw new Error("Perfil no encontrado");
  const balance = parseFloat(profile.totalCredits?.toString() ?? "0");
  if (balance < amount) throw new Error("Saldo insuficiente");
  const fee = amount * FEE_RATE;
  const netAmount = amount - fee;
  await db.update(profiles).set({
    totalCredits: sql`${profiles.totalCredits} - ${amount}`,
    totalWithdrawn: sql`${profiles.totalWithdrawn} + ${netAmount}`,
  }).where(eq(profiles.userId, userId));
  const result = await db.insert(transactions).values({
    userId,
    type: "withdrawal_requested",
    amount: netAmount.toFixed(2),
    currency: "USD",
    status: "pending",
    description: `Retiro a MercadoPago: ${mercadoPagoEmail} (tarifa: $${fee.toFixed(2)})`,
  });
  await db.insert(notifications).values({
    userId,
    type: "withdrawal_processed",
    title: "Retiro solicitado",
    message: `Tu retiro de $${netAmount.toFixed(2)} USD está siendo procesado`,
  });
  return result[0].insertId;
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export async function getUserNotifications(userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
}

export async function markNotificationRead(notificationId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: true }).where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
}

export async function markAllNotificationsRead(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
}

export async function getUnreadNotificationsCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`COUNT(*)` }).from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return result[0]?.count ?? 0;
}
