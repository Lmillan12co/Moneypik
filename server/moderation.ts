/**
 * Moneypik — Moderación de contenido generado por usuarios (UGC) y
 * solicitudes de borrado de cuenta hechas desde la web.
 *
 * ARCHIVO NUEVO. No modifica server/db.ts ni server/routers.ts.
 * Lo usa server/policyRouter.ts (routers `moderation` y `account`).
 *
 * Tablas nuevas (ver drizzle/schema.ts y la migración 0002):
 *   - reports: reportes de publicaciones o usuarios.
 *   - userBlocks: bloqueos entre usuarios.
 *   - deletionRequests: solicitudes de borrado hechas desde la web.
 */
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "./db";
import {
  reports,
  userBlocks,
  deletionRequests,
  posts,
  profiles,
} from "../drizzle/schema";

export const REPORT_REASONS = [
  "spam",
  "contenido_sexual",
  "violencia",
  "acoso",
  "fraude",
  "otro",
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: "Spam o contenido no deseado",
  contenido_sexual: "Contenido sexual o explícito",
  violencia: "Violencia o contenido perturbador",
  acoso: "Acoso o intimidación",
  fraude: "Fraude o engaño",
  otro: "Otro motivo",
};

// ─── REPORTES ────────────────────────────────────────────────────────────────

export async function createReport(data: {
  reporterUserId: number;
  postId?: number | null;
  reportedUserId?: number | null;
  reason: ReportReason;
  details?: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (!data.postId && !data.reportedUserId) {
    throw new Error("El reporte debe ser sobre una publicación o un usuario");
  }
  const result = await db.insert(reports).values({
    reporterUserId: data.reporterUserId,
    postId: data.postId ?? null,
    reportedUserId: data.reportedUserId ?? null,
    reason: data.reason,
    details: data.details ?? null,
  });
  return result[0].insertId;
}

export async function listReports() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reports).orderBy(desc(reports.createdAt));
}

/** Revisión por el equipo (solo admin). */
export async function reviewReport(
  reportId: number,
  action: "dismiss" | "hide_post",
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (action === "hide_post") {
    const [report] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);
    if (report?.postId) {
      // Ocultar la publicación (no se borra el registro: queda para auditoría).
      await db
        .update(posts)
        .set({ isActive: false })
        .where(eq(posts.id, report.postId));
    }
    await db
      .update(reports)
      .set({ status: "action_taken" })
      .where(eq(reports.id, reportId));
  } else {
    await db
      .update(reports)
      .set({ status: "dismissed" })
      .where(eq(reports.id, reportId));
  }
}

// ─── BLOQUEOS ────────────────────────────────────────────────────────────────

export async function blockUser(
  blockerUserId: number,
  blockedUserId: number,
): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (blockerUserId === blockedUserId) {
    throw new Error("No puedes bloquearte a ti mismo");
  }
  const existing = await db
    .select()
    .from(userBlocks)
    .where(
      and(
        eq(userBlocks.blockerUserId, blockerUserId),
        eq(userBlocks.blockedUserId, blockedUserId),
      ),
    )
    .limit(1);
  if (existing.length > 0) return existing[0].id;
  const result = await db
    .insert(userBlocks)
    .values({ blockerUserId, blockedUserId });
  return result[0].insertId;
}

export async function unblockUser(
  blockerUserId: number,
  blockedUserId: number,
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .delete(userBlocks)
    .where(
      and(
        eq(userBlocks.blockerUserId, blockerUserId),
        eq(userBlocks.blockedUserId, blockedUserId),
      ),
    );
}

/** Usuarios bloqueados por alguien, con su nombre de usuario si existe. */
export async function getBlockedUsers(blockerUserId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      blockedUserId: userBlocks.blockedUserId,
      username: profiles.username,
      blockedAt: userBlocks.createdAt,
    })
    .from(userBlocks)
    .leftJoin(profiles, eq(profiles.userId, userBlocks.blockedUserId))
    .where(eq(userBlocks.blockerUserId, blockerUserId))
    .orderBy(desc(userBlocks.createdAt));
}

/** Solo los IDs bloqueados (para filtrar el feed en el cliente). */
export async function getBlockedUserIds(
  blockerUserId: number,
): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({ blockedUserId: userBlocks.blockedUserId })
    .from(userBlocks)
    .where(eq(userBlocks.blockerUserId, blockerUserId));
  return rows.map((r) => r.blockedUserId);
}

// ─── SOLICITUDES DE BORRADO DESDE LA WEB ─────────────────────────────────────

export async function createDeletionRequest(
  email: string,
  userId?: number | null,
): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db
    .select()
    .from(deletionRequests)
    .where(
      and(
        eq(deletionRequests.email, email),
        eq(deletionRequests.status, "pending"),
      ),
    )
    .limit(1);
  // No revelar si ya existe una solicitud: se devuelve el mismo resultado.
  if (existing.length > 0) return existing[0].id;
  const result = await db.insert(deletionRequests).values({
    email,
    userId: userId ?? null,
  });
  return result[0].insertId;
}

export async function listDeletionRequests() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(deletionRequests)
    .orderBy(desc(deletionRequests.requestedAt));
}

/**
 * La marca el equipo cuando procesa la solicitud: hay que borrar la cuenta
 * con deleteAccount (server/account.ts) y luego marcar la solicitud.
 * Proceso manual hasta que exista un panel de administración.
 */
export async function completeDeletionRequest(
  requestId: number,
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(deletionRequests)
    .set({ status: "completed", processedAt: new Date() })
    .where(eq(deletionRequests.id, requestId));
}
