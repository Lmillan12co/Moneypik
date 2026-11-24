/**
 * Moneypik — Routers tRPC de políticas de Google Play.
 *
 * ARCHIVO NUEVO. No modifica server/routers.ts: se registra en él con un
 * parche de 2 líneas (ver README, sección "Parches"):
 *
 *   import { accountRouter, moderationRouter } from "./policyRouter";
 *   // dentro de appRouter:
 *   account: accountRouter,
 *   moderation: moderationRouter,
 *
 * Routers:
 *   - account: borrado de cuenta (en la app) y solicitud de borrado (web).
 *   - moderation: reportar publicación/usuario, bloquear/desbloquear y
 *     revisión de reportes (solo admin).
 */
import { z } from "zod";
import { eq } from "drizzle-orm";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import {
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  router,
} from "./_core/trpc";
import { getDb } from "./db";
import { posts } from "../drizzle/schema";
import * as moderation from "./moderation";
import { deleteAccount } from "./account";

const reportReason = z.enum([
  "spam",
  "contenido_sexual",
  "violencia",
  "acoso",
  "fraude",
  "otro",
]);

export const accountRouter = router({
  /**
   * Eliminar la cuenta desde la app. Solo el dueño de la cuenta.
   * La app pide confirmación dos veces antes de llamar aquí.
   * Borra perfil, publicaciones, likes, transacciones, notificaciones,
   * reportes y bloqueos (ver server/account.ts) y cierra la sesión.
   */
  deleteAccount: protectedProcedure
    .input(z.object({ confirm: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.confirm) {
        throw new Error("Confirma la eliminación para continuar");
      }
      await deleteAccount(ctx.user.id);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

  /**
   * Solicitud de borrado desde la web (sin la app). Pública: solo pide el
   * email con el que se registró la cuenta. La solicitud queda registrada
   * y el equipo debe procesarla en un máximo de 30 días (ver la página
   * app/web/eliminar-cuenta.tsx y el README, "Proceso de borrado web").
   * No revela si el email existe o si ya hay una solicitud pendiente.
   */
  requestDeletion: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      await moderation.createDeletionRequest(input.email);
      return { received: true } as const;
    }),
});

export const moderationRouter = router({
  /** Reportar una publicación (motivo + detalle opcional). */
  reportPost: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        reason: reportReason,
        details: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [post] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input.postId))
        .limit(1);
      if (!post) throw new Error("Publicación no encontrada");
      const reportId = await moderation.createReport({
        reporterUserId: ctx.user.id,
        postId: input.postId,
        reportedUserId: post.userId,
        reason: input.reason,
        details: input.details,
      });
      return { reportId };
    }),

  /** Reportar a un usuario (sin necesidad de una publicación). */
  reportUser: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        reason: reportReason,
        details: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) {
        throw new Error("No puedes reportarte a ti mismo");
      }
      const reportId = await moderation.createReport({
        reporterUserId: ctx.user.id,
        reportedUserId: input.userId,
        reason: input.reason,
        details: input.details,
      });
      return { reportId };
    }),

  /** Bloquear a un usuario: sus publicaciones ya no salen en tu feed. */
  blockUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await moderation.blockUser(ctx.user.id, input.userId);
      return { success: true } as const;
    }),

  /** Desbloquear a un usuario. */
  unblockUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await moderation.unblockUser(ctx.user.id, input.userId);
      return { success: true } as const;
    }),

  /** Usuarios que yo bloqueé (para la lista en Configuración). */
  myBlocks: protectedProcedure.query(async ({ ctx }) => {
    return moderation.getBlockedUsers(ctx.user.id);
  }),

  /** Cola de reportes (solo admin: Laura / el equipo). */
  listReports: adminProcedure.query(async () => {
    return moderation.listReports();
  }),

  /**
   * Revisar un reporte (solo admin).
   * - "dismiss": se descarta, no pasa nada.
   * - "hide_post": se oculta la publicación (isActive = false) y el
   *   reporte queda como "action_taken".
   */
  reviewReport: adminProcedure
    .input(
      z.object({
        reportId: z.number(),
        action: z.enum(["dismiss", "hide_post"]),
      }),
    )
    .mutation(async ({ input }) => {
      await moderation.reviewReport(input.reportId, input.action);
      return { success: true } as const;
    }),
});
