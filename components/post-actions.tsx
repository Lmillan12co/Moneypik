/**
 * Moneypik — Menú de acciones sobre una publicación (reportar / bloquear).
 *
 * ARCHIVO NUEVO (components/post-actions.tsx).
 * Se engancha en app/(tabs)/index.tsx (PostCard) con el parche del README:
 *
 *   import { PostActions } from "@/components/post-actions";
 *   // dentro de PostCard, junto al botón de like:
 *   {!isOwnPost && (
 *     <PostActions postId={post.id} postOwnerId={post.userId} />
 *   )}
 *
 * Qué hace:
 *   - "Reportar publicación": abre el modal de motivos (ReportModal) y
 *     llama a moderation.reportPost.
 *   - "Reportar usuario": mismo modal, llama a moderation.reportUser.
 *   - "Bloquear usuario": pide confirmación y llama a
 *     moderation.blockUser; después las publicaciones de ese usuario
 *     ya no salen en el feed (el parche de index.tsx filtra con
 *     moderation.myBlocks).
 * En las publicaciones propias no se muestra (no se reporta ni se
 * bloquea a uno mismo).
 */
import React, { useState } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { ReportModal, type ReportReason } from "./report-modal";

type ReportTarget =
  | { kind: "post"; postId: number }
  | { kind: "user"; userId: number }
  | null;

export function PostActions({
  postId,
  postOwnerId,
}: {
  postId: number;
  postOwnerId: number;
}) {
  const colors = useColors();
  const [reportTarget, setReportTarget] = useState<ReportTarget>(null);

  const utils = trpc.useUtils();

  const reportPost = trpc.moderation.reportPost.useMutation({
    onSuccess: () => {
      setReportTarget(null);
      Alert.alert(
        "Reporte enviado",
        "Gracias. El equipo de Moneypik lo revisará.",
      );
    },
    onError: (err) => Alert.alert("Error", err.message),
  });

  const reportUser = trpc.moderation.reportUser.useMutation({
    onSuccess: () => {
      setReportTarget(null);
      Alert.alert(
        "Reporte enviado",
        "Gracias. El equipo de Moneypik lo revisará.",
      );
    },
    onError: (err) => Alert.alert("Error", err.message),
  });

  const blockUser = trpc.moderation.blockUser.useMutation({
    onSuccess: () => {
      utils.moderation.myBlocks.invalidate();
      utils.posts.feed.invalidate();
      Alert.alert(
        "Usuario bloqueado",
        "Ya no verás sus publicaciones en tu feed. Puedes desbloquearlo en Configuración.",
      );
    },
    onError: (err) => Alert.alert("Error", err.message),
  });

  const openMenu = () => {
    Alert.alert("Opciones", undefined, [
      {
        text: "Reportar publicación",
        onPress: () => setReportTarget({ kind: "post", postId }),
      },
      {
        text: "Reportar usuario",
        onPress: () => setReportTarget({ kind: "user", userId: postOwnerId }),
      },
      {
        text: "Bloquear usuario",
        style: "destructive",
        onPress: () =>
          Alert.alert(
            "Bloquear usuario",
            "Ya no verás sus publicaciones en tu feed. Puedes desbloquearlo en Configuración.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Bloquear",
                style: "destructive",
                onPress: () => blockUser.mutate({ userId: postOwnerId }),
              },
            ],
          ),
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const handleReportSubmit = (reason: ReportReason, details?: string) => {
    if (!reportTarget) return;
    if (reportTarget.kind === "post") {
      reportPost.mutate({ postId: reportTarget.postId, reason, details });
    } else {
      reportUser.mutate({ userId: reportTarget.userId, reason, details });
    }
  };

  const isSubmitting = reportPost.isPending || reportUser.isPending;

  return (
    <>
      <TouchableOpacity
        onPress={openMenu}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{ padding: 6 }}
      >
        <IconSymbol name="ellipsis" size={20} color={colors.muted} />
      </TouchableOpacity>

      <ReportModal
        visible={reportTarget !== null}
        title={
          reportTarget?.kind === "user"
            ? "Reportar usuario"
            : "Reportar publicación"
        }
        onClose={() => setReportTarget(null)}
        onSubmit={handleReportSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
