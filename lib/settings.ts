/**
 * Moneypik — Preferencias guardadas en el dispositivo (AsyncStorage).
 *
 * ARCHIVO NUEVO (lib/settings.ts). Lo usa Configuración y
 * lib/theme-provider.tsx. No modifica ningún archivo del repo.
 *
 * - Notificaciones: preferencia del usuario. OJO: en el repo no hay
 *   envío de notificaciones push (expo-notifications está instalado
 *   pero no se importa en ningún archivo; las notificaciones son
 *   filas en la base de datos que se muestran en la pantalla de
 *   notificaciones). Este interruptor guarda la preferencia y la
 *   pantalla de notificaciones debe leerla con
 *   getNotificationsEnabled() para no mostrar avisos cuando está
 *   apagada (ver README). No promete controlar un push que no existe.
 * - Tema: el proveedor de tema lo lee al arrancar y lo guarda al cambiar.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATIONS_KEY = "moneypik:notificationsEnabled";
const COLOR_SCHEME_KEY = "moneypik:colorScheme";

export async function getNotificationsEnabled(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    // Por defecto activadas (comportamiento actual de la app).
    return value === null ? true : value === "true";
  } catch {
    return true;
  }
}

export async function setNotificationsEnabled(
  enabled: boolean,
): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATIONS_KEY, enabled ? "true" : "false");
}

export async function getSavedColorScheme(): Promise<"light" | "dark" | null> {
  try {
    const value = await AsyncStorage.getItem(COLOR_SCHEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export async function setSavedColorScheme(
  scheme: "light" | "dark",
): Promise<void> {
  await AsyncStorage.setItem(COLOR_SCHEME_KEY, scheme);
}
