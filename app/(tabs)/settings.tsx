/**
 * Moneypik — Pantalla de Configuración.
 *
 * REEMPLAZO COMPLETO de app/(tabs)/settings.tsx del repo (commit f43fce3).
 *
 * Qué cambia respecto a la versión del repo (que tenía 5 botones muertos
 * y 3 interruptores falsos):
 *   - "Cuenta": abre el modal de edición de perfil (el mismo de Perfil).
 *   - "Método de Pago": abre el mismo modal (ahí está el campo del
 *     email de MercadoPago).
 *   - "Política de Privacidad": abre la página de privacidad dentro
 *     de la app (/web/privacidad).
 *   - "Notificaciones": interruptor que se guarda en el dispositivo
 *     (AsyncStorage). La pantalla de notificaciones debe leerlo con
 *     getNotificationsEnabled() (ver README). OJO: el repo no tiene
 *     envío de notificaciones push (expo-notifications está instalado
 *     pero no se usa en ningún archivo), así que este interruptor
 *     controla los avisos dentro de la app, no un push que no existe.
 *   - "Modo Oscuro": cambia el tema de verdad con el ThemeContext y
 *     se guarda (lib/theme-provider.tsx ahora persiste la preferencia).
 *   - "Perfil Privado": SE QUITÓ. No hay sistema de seguidores en la
 *     app, así que un perfil privado no se puede hacer cumplir: dejar
 *     el interruptor sería un adorno engañoso. Si algún día hay
 *     seguidores, se vuelve a añadir con su lógica en el backend.
 *   - "Cerrar Sesión": usa el mismo cierre de sesión de Perfil.
 *   - "Eliminar Cuenta": borrado real con doble confirmación
 *     (trpc account.deleteAccount). Borra perfil, publicaciones,
 *     likes, transacciones, notificaciones y reportes, y cierra la
 *     sesión. Si hay un retiro pendiente, el servidor lo rechaza.
 *   - Nueva sección "Usuarios bloqueados": lista con botón para
 *     desbloquear (trpc moderation.myBlocks / unblockUser).
 *
 * Requiere un parche de 1 línea en app/(tabs)/profile.tsx (ver README):
 *   function EditProfileModal  →  export function EditProfileModal
 */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { EditProfileModal } from "./profile";
import {
  getNotificationsEnabled,
  setNotificationsEnabled,
} from "@/lib/settings";

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  type: "toggle" | "link" | "info";
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();
  const { isAuthenticated, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  // Cargar la preferencia guardada de notificaciones al entrar.
  useEffect(() => {
    let cancelled = false;
    getNotificationsEnabled().then((enabled) => {
      if (!cancelled) setNotifications(enabled);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const { data: profile } = trpc.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: blockedUsers } = trpc.moderation.myBlocks.useQuery(
    undefined,
    { enabled: isAuthenticated },
  );

  const utils = trpc.useUtils();

  const unblockUser = trpc.moderation.unblockUser.useMutation({
    onSuccess: () => utils.moderation.myBlocks.invalidate(),
    onError: (err) => Alert.alert("Error", err.message),
  });

  const deleteAccount = trpc.account.deleteAccount.useMutation({
    onSuccess: () => {
      logout();
      router.replace("/login" as any);
    },
    onError: (err) => Alert.alert("No se pudo eliminar", err.message),
  });

  const handleNotificationsToggle = (value: boolean) => {
    setNotifications(value);
    setNotificationsEnabled(value).catch(() => {});
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: logout },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Eliminar cuenta",
      "Esto borra para siempre tu perfil, tus publicaciones, tus likes, tu saldo y tu historial. Si tienes un retiro pendiente de pago, primero debe resolverse. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar mi cuenta",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "¿Seguro?",
              "Tu cuenta y todos tus datos se eliminarán. ¿Confirmas?",
              [
                { text: "Volver", style: "cancel" },
                {
                  text: "Eliminar definitivamente",
                  style: "destructive",
                  onPress: () => deleteAccount.mutate({ confirm: true }),
                },
              ],
            ),
        },
      ],
    );
  };

  const settings: SettingItem[] = [
    {
      id: "account",
      title: "Cuenta",
      description: "Editar perfil, email, contraseña",
      icon: "person.fill",
      type: "link",
      onPress: () => setShowEdit(true),
    },
    {
      id: "notifications",
      title: "Notificaciones",
      description: "Recibir alertas de likes y retiros",
      icon: "bell.fill",
      type: "toggle",
      value: notifications,
      onToggle: handleNotificationsToggle,
      onPress: () => handleNotificationsToggle(!notifications),
    },
    {
      id: "darkmode",
      title: "Modo Oscuro",
      description: "Cambiar tema de la app",
      icon: "moon.fill",
      type: "toggle",
      value: colorScheme === "dark",
      onToggle: (value) => setColorScheme(value ? "dark" : "light"),
      onPress: () =>
        setColorScheme(colorScheme === "dark" ? "light" : "dark"),
    },
    {
      id: "payment",
      title: "Método de Pago",
      description: "Configurar MercadoPago",
      icon: "creditcard.fill",
      type: "link",
      onPress: () => setShowEdit(true),
    },
    {
      id: "privacy-policy",
      title: "Política de Privacidad",
      description: "Ver términos y condiciones",
      icon: "doc.fill",
      type: "link",
      onPress: () => router.push("/web/privacidad" as any),
    },
    {
      id: "about",
      title: "Acerca de Moneypik",
      description: "Versión 1.0.0",
      icon: "info.circle.fill",
      type: "info",
    },
  ];

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-3xl font-bold text-foreground">Configuración</Text>
        </View>

        {/* Settings List */}
        <View className="px-4 gap-2">
          {settings.map((setting) => (
            <Pressable
              key={setting.id}
              onPress={setting.onPress}
              className={cn(
                "flex-row items-center justify-between px-4 py-4 rounded-xl",
                "bg-surface active:opacity-80",
              )}
            >
              {/* Left Content */}
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-lg bg-primary/20 justify-center items-center">
                  <IconSymbol
                    name={setting.icon as any}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">
                    {setting.title}
                  </Text>
                  {setting.description && (
                    <Text className="text-xs text-muted mt-1">
                      {setting.description}
                    </Text>
                  )}
                </View>
              </View>

              {/* Right Content */}
              {setting.type === "toggle" && (
                <Switch
                  value={setting.value || false}
                  onValueChange={setting.onToggle}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              )}
              {setting.type === "link" && (
                <IconSymbol
                  name="chevron.right"
                  size={20}
                  color={colors.muted}
                />
              )}
            </Pressable>
          ))}
        </View>

        {/* Blocked Users */}
        {isAuthenticated && blockedUsers && blockedUsers.length > 0 && (
          <View className="px-4 mt-8 gap-2">
            <Text className="text-sm font-semibold text-muted px-2 mb-2">
              USUARIOS BLOQUEADOS
            </Text>
            {blockedUsers.map((blocked) => (
              <View
                key={blocked.blockedUserId}
                className="flex-row items-center justify-between px-4 py-3 rounded-xl bg-surface"
              >
                <Text className="font-semibold text-foreground">
                  {blocked.username
                    ? `@${blocked.username}`
                    : `Usuario ${blocked.blockedUserId}`}
                </Text>
                <Pressable
                  onPress={() =>
                    unblockUser.mutate({ userId: blocked.blockedUserId })
                  }
                  className="px-3 py-2 rounded-full border border-border active:opacity-80"
                >
                  <Text className="text-sm font-semibold text-foreground">
                    Desbloquear
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Danger Zone */}
        <View className="px-4 mt-8 gap-2">
          <Text className="text-sm font-semibold text-muted px-2 mb-2">
            ZONA DE PELIGRO
          </Text>

          <Pressable
            onPress={handleLogout}
            className="bg-error/10 rounded-xl px-4 py-4 active:opacity-80"
          >
            <Text className="text-error font-semibold text-center">
              Cerrar Sesión
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDeleteAccount}
            disabled={deleteAccount.isPending}
            className="bg-error/10 rounded-xl px-4 py-4 active:opacity-80"
          >
            {deleteAccount.isPending ? (
              <ActivityIndicator color={colors.error} />
            ) : (
              <Text className="text-error font-semibold text-center">
                Eliminar Cuenta
              </Text>
            )}
          </Pressable>
          <Text className="text-xs text-muted text-center px-4 mt-1">
            Eliminar tu cuenta borra tu perfil, publicaciones, likes, saldo
            e historial. También puedes pedir el borrado desde la web.
          </Text>
        </View>

        {/* Footer */}
        <View className="px-4 mt-12 pt-6 border-t border-border">
          <Text className="text-xs text-muted text-center">
            Moneypik v1.0.0
          </Text>
          <Text className="text-xs text-muted text-center mt-2">
            © 2026 Moneypik. Todos los derechos reservados.
          </Text>
        </View>
      </ScrollView>

      {profile && (
        <EditProfileModal
          visible={showEdit}
          onClose={() => setShowEdit(false)}
          profile={profile}
        />
      )}
    </ScreenContainer>
  );
}
