import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── PROFILES ──────────────────────────────────────────────────────────────
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getOrCreateProfile(ctx.user.id, ctx.user.name);
    }),

    update: protectedProcedure
      .input(z.object({
        username: z.string().min(3).max(50).optional(),
        bio: z.string().max(300).optional(),
        avatarUrl: z.string().url().optional(),
        mercadoPagoEmail: z.string().email().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.getOrCreateProfile(ctx.user.id, ctx.user.name);
        await db.updateProfile(ctx.user.id, input);
        return db.getProfile(ctx.user.id);
      }),

    uploadAvatar: protectedProcedure
      .input(z.object({
        base64: z.string(),
        mimeType: z.string().default("image/jpeg"),
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.base64, "base64");
        const filename = `avatars/${ctx.user.id}_${Date.now()}.jpg`;
        const { url } = await storagePut(filename, buffer, input.mimeType);
        await db.updateProfile(ctx.user.id, { avatarUrl: url });
        return { url };
      }),
  }),

  // ─── POSTS ─────────────────────────────────────────────────────────────────
  posts: router({
    feed: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return db.getFeedPosts(input.limit, input.offset);
      }),

    myPosts: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserPosts(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        type: z.enum(["photo", "video"]).default("photo"),
        base64: z.string(),
        mimeType: z.string().default("image/jpeg"),
        description: z.string().max(200).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.getOrCreateProfile(ctx.user.id, ctx.user.name);
        const buffer = Buffer.from(input.base64, "base64");
        const ext = input.type === "video" ? "mp4" : "jpg";
        const filename = `posts/${ctx.user.id}_${Date.now()}.${ext}`;
        const { url: mediaUrl } = await storagePut(filename, buffer, input.mimeType);
        const postId = await db.createPost({
          userId: ctx.user.id,
          type: input.type,
          mediaUrl,
          description: input.description,
        });
        return { postId, mediaUrl };
      }),

    delete: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deletePost(input.postId, ctx.user.id);
      }),

    checkLiked: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ ctx, input }) => {
        return { liked: await db.hasUserLikedPost(ctx.user.id, input.postId) };
      }),

    like: protectedProcedure
      .input(z.object({ postId: z.number(), postOwnerId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const alreadyLiked = await db.hasUserLikedPost(ctx.user.id, input.postId);
        if (alreadyLiked) {
          await db.unlikePost(ctx.user.id, input.postId);
          return { liked: false };
        }
        await db.likePost(ctx.user.id, input.postId, input.postOwnerId);
        return { liked: true };
      }),
  }),

  // ─── WALLET ────────────────────────────────────────────────────────────────
  wallet: router({
    balance: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getOrCreateProfile(ctx.user.id, ctx.user.name);
      return {
        totalCredits: parseFloat(profile?.totalCredits?.toString() ?? "0"),
        totalLikesReceived: profile?.totalLikesReceived ?? 0,
        totalWithdrawn: parseFloat(profile?.totalWithdrawn?.toString() ?? "0"),
        mercadoPagoEmail: profile?.mercadoPagoEmail ?? null,
      };
    }),

    transactions: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ ctx, input }) => {
        return db.getUserTransactions(ctx.user.id, input.limit);
      }),

    withdraw: protectedProcedure
      .input(z.object({
        amount: z.number().min(20),
        mercadoPagoEmail: z.string().email(),
      }))
      .mutation(async ({ ctx, input }) => {
        const transactionId = await db.requestWithdrawal(ctx.user.id, input.amount, input.mercadoPagoEmail);
        return { transactionId, success: true };
      }),
  }),

  // ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserNotifications(ctx.user.id);
    }),

    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      const count = await db.getUnreadNotificationsCount(ctx.user.id);
      return { count };
    }),

    markRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.markNotificationRead(input.notificationId, ctx.user.id);
      }),

    markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
      await db.markAllNotificationsRead(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
