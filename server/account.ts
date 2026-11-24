/**
 * Moneypik — Borrado de cuenta y de todos los datos del usuario.
 *
 * ARCHIVO NUEVO. No modifica server/db.ts ni server/routers.ts.
 * Lo usa server/policyRouter.ts (router `account`, procedimiento
 * `deleteAccount`, protegido: solo el dueño de la cuenta puede borrarla).
 *
 * Qué borra (en una sola transacción: todo o nada):
 *   - Los likes que el usuario dio: se restan del contador de cada
 *     publicación y de los créditos del dueño ($0.01 por like), para que
 *     las cuentas no queden infladas con likes de una cuenta borrada.
 *   - Sus publicaciones, sus likes recibidos, sus transacciones,
 *     sus notificaciones, sus reportes y sus bloqueos.
 *   - Su perfil y su fila de usuario.
 *   - Los reportes que otros hicieron sobre él se anonimizan
 *     (reportedUserId pasa a null): el registro de moderación se conserva
 *     sin identificar a la persona.
 *
 * Qué NO borra (hay que hacerlo aparte — ver README):
 *   - Los archivos multimedia (fotos/videos y avatar) guardados en el
 *     almacenamiento de archivos: no hay una función de borrado en
 *     server/storage.ts que se haya visto. Manus debe comprobar si existe
 *     y, si no, añadirla y borrar los archivos del usuario (mejor
 *     esfuerzo: si el borrado de archivos falla, el borrado de la cuenta
 *     no debe fallar; hay que registrarlo y reintentarlo).
 *   - Los registros de transacciones que la ley obligue a conservar:
 *     si Laura necesita guardar comprobantes de retiros por motivos
 *     fiscales o contables, hay que guardar una copia anonimizada
 *     ANTES de borrar (ver README). Por defecto se borran.
 *
 * Regla de seguridad: si el usuario tiene un retiro pendiente de pago
 * (withdrawal_requested + pending), el borrado se rechaza. El dinero
 * debe resolverse antes de borrar la cuenta.
 */
import { eq, and, sql, inArray } from "drizzle-orm";
import { getDb } from "./db";
import {
  users,
  profiles,
  posts,
  likes,
  transactions,
  notifications,
  reports,
  userBlocks,
  deletionRequests,
} from "../drizzle/schema";

const CREDIT_PER_LIKE = "0.01";

export async function deleteAccount(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // 0. No borrar con un retiro pendiente: el dinero va primero.
  const pendingWithdrawal = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.type, "withdrawal_requested"),
        eq(transactions.status, "pending"),
      ),
    )
    .limit(1);
  if (pendingWithdrawal.length > 0) {
    throw new Error(
      "Tienes un retiro pendiente de pago. Espera a que se complete o escribe a soporte@moneypik.app antes de eliminar tu cuenta.",
    );
  }

  await db.transaction(async (tx) => {
    // 1. Devolver los créditos de los likes que este usuario dio a otros.
    const givenLikes = await tx
      .select({ postId: likes.postId })
      .from(likes)
      .where(eq(likes.userId, userId));
    for (const like of givenLikes) {
      const [post] = await tx
        .select()
        .from(posts)
        .where(eq(posts.id, like.postId))
        .limit(1);
      if (!post) continue;
      await tx
        .update(posts)
        .set({ likesCount: sql`GREATEST(${posts.likesCount} - 1, 0)` })
        .where(eq(posts.id, post.id));
      await tx
        .update(profiles)
        .set({
          totalLikesReceived: sql`GREATEST(${profiles.totalLikesReceived} - 1, 0)`,
          totalCredits: sql`GREATEST(${profiles.totalCredits} - ${CREDIT_PER_LIKE}, 0)`,
        })
        .where(eq(profiles.userId, post.userId));
    }

    // 2. Borrar likes: los que dio y los recibidos en sus publicaciones.
    const ownPosts = await tx
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.userId, userId));
    const ownPostIds = ownPosts.map((p) => p.id);
    await tx.delete(likes).where(eq(likes.userId, userId));
    if (ownPostIds.length > 0) {
      await tx.delete(likes).where(inArray(likes.postId, ownPostIds));
    }

    // 3. Borrar sus publicaciones, transacciones y notificaciones.
    await tx.delete(posts).where(eq(posts.userId, userId));
    await tx.delete(transactions).where(eq(transactions.userId, userId));
    await tx.delete(notifications).where(eq(notifications.userId, userId));

    // 4. Moderación: borrar los reportes que hizo; anonimizar los que
    //    otros hicieron sobre él; borrar sus bloqueos en ambos sentidos.
    await tx.delete(reports).where(eq(reports.reporterUserId, userId));
    await tx
      .update(reports)
      .set({ reportedUserId: null })
      .where(eq(reports.reportedUserId, userId));
    await tx.delete(userBlocks).where(eq(userBlocks.blockerUserId, userId));
    await tx.delete(userBlocks).where(eq(userBlocks.blockedUserId, userId));
    await tx
      .delete(deletionRequests)
      .where(eq(deletionRequests.userId, userId));

    // 5. Borrar perfil y cuenta.
    await tx.delete(profiles).where(eq(profiles.userId, userId));
    await tx.delete(users).where(eq(users.id, userId));
  });
}
