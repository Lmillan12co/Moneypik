import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { router } from "expo-router";

type NotificationType = "new_like" | "withdrawal_processed" | "withdrawal_rejected" | "system";

const NOTIFICATION_ICONS: Record<NotificationType, { icon: any; color: string; bg: string }> = {
  new_like: { icon: "heart.fill", color: "#EF4444", bg: "#FEE2E2" },
  withdrawal_processed: { icon: "banknote.fill", color: "#10B981", bg: "#D1FAE5" },
  withdrawal_rejected: { icon: "exclamationmark.circle.fill", color: "#EF4444", bg: "#FEE2E2" },
  system: { icon: "info.circle.fill", color: "#7C3AED", bg: "#EDE9FE" },
};

export default function NotificationsScreen() {
  const colors = useColors();
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: notifications, isLoading } = trpc.notifications.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const markAllRead = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => utils.notifications.list.invalidate(),
  });

  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => utils.notifications.list.invalidate(),
  });

  if (!isAuthenticated) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border, backgroundColor: colors.surface }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>Notificaciones</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <IconSymbol name="bell.fill" size={48} color={colors.muted} />
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginTop: 16, marginBottom: 8 }}>Inicia sesión</Text>
          <Text style={{ color: colors.muted, textAlign: "center" }}>Para ver tus notificaciones, inicia sesión en tu cuenta</Text>
          <TouchableOpacity
            onPress={() => router.push("/login" as any)}
            style={{ marginTop: 24, backgroundColor: colors.primary, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 }}
          >
            <Text style={{ color: "#FFF", fontWeight: "700" }}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>Notificaciones</Text>
        </View>
        {notifications && notifications.some((n) => !n.isRead) && (
          <TouchableOpacity onPress={() => markAllRead.mutate()}>
            <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "600" }}>Marcar todo leído</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications ?? []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const config = NOTIFICATION_ICONS[item.type as NotificationType] ?? NOTIFICATION_ICONS.system;
            return (
              <TouchableOpacity
                onPress={() => !item.isRead && markRead.mutate({ notificationId: item.id })}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: 16,
                  backgroundColor: item.isRead ? colors.background : colors.surface,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: config.bg,
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconSymbol name={config.icon} size={22} color={config.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 15, fontWeight: item.isRead ? "500" : "700", color: colors.foreground, flex: 1 }}>
                      {item.title}
                    </Text>
                    {!item.isRead && (
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: 8 }} />
                    )}
                  </View>
                  <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4, lineHeight: 18 }}>
                    {item.message}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.muted, marginTop: 6 }}>
                    {new Date(item.createdAt).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 80, paddingHorizontal: 32 }}>
              <IconSymbol name="bell.fill" size={48} color={colors.muted} />
              <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginTop: 16, marginBottom: 8 }}>
                Sin notificaciones
              </Text>
              <Text style={{ color: colors.muted, textAlign: "center", lineHeight: 22 }}>
                Aquí verás tus likes, retiros y mensajes del sistema
              </Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}
