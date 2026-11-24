/**
 * Moneypik — Página web para solicitar el borrado de la cuenta.
 *
 * ARCHIVO NUEVO (app/web/eliminar-cuenta.tsx).
 * Esta es la URL que Google Play exige registrar en Play Console como
 * enlace web de borrado de cuenta (además del borrado dentro de la app,
 * en Configuración → Eliminar Cuenta).
 *
 * La página debe publicarse con URL pública. Opciones (ver README):
 *   - La misma web de la app (Expo web, salida estática) en el hosting
 *     que se elija para la política de privacidad.
 *   - Si la política queda en https://lmillan12co.github.io/Moneypik/privacidad/, esta
 *     página queda en https://lmillan12co.github.io/Moneypik/eliminar-cuenta/.
 *
 * Cómo funciona: el usuario escribe el email con el que se registró.
 * La solicitud queda registrada (tabla deletionRequests) y el equipo
 * debe procesarla en un máximo de 30 días. La página no revela si el
 * email existe o si ya hay una solicitud pendiente.
 * La vía rápida sigue siendo borrar desde la app (es inmediata, salvo
 * que haya un retiro pendiente de pago).
 */
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";

export default function EliminarCuentaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const requestDeletion = trpc.account.requestDeletion.useMutation({
    onSuccess: () => setSent(true),
  });

  const handleSubmit = () => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) return;
    requestDeletion.mutate({ email: clean });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0f0520" }}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* NAV */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 32,
          paddingVertical: 20,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(124,58,237,0.2)",
        }}
      >
        <TouchableOpacity onPress={() => router.push("/web" as any)}>
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>
            Money<Text style={{ color: "#F59E0B" }}>pik</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/web" as any)}>
          <Text style={{ color: "#A78BFA", fontSize: 14 }}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>

      {/* HEADER */}
      <View style={{ paddingHorizontal: 32, paddingTop: 48, paddingBottom: 16 }}>
        <Text
          style={{ fontSize: 28, fontWeight: "800", color: "#fff", marginBottom: 8 }}
        >
          Eliminar tu cuenta de Moneypik
        </Text>
        <Text style={{ fontSize: 15, color: "#C4B5FD", lineHeight: 22 }}>
          Puedes borrar tu cuenta y todos tus datos en cualquier momento.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 32, gap: 16 }}>
        {/* Qué se borra */}
        <View
          style={{
            backgroundColor: "rgba(124,58,237,0.12)",
            borderWidth: 1,
            borderColor: "rgba(124,58,237,0.3)",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16, marginBottom: 8 }}>
            Qué se elimina
          </Text>
          <Text style={{ color: "#E9D5FF", fontSize: 14, lineHeight: 21 }}>
            Tu perfil, tus publicaciones, tus likes, tu saldo, tu historial
            de transacciones y tus notificaciones. Los reportes que otros
            hayan hecho sobre tu contenido se conservan sin identificarte.
          </Text>
          <Text style={{ color: "#E9D5FF", fontSize: 14, lineHeight: 21, marginTop: 8 }}>
            Si tienes un retiro pendiente de pago, primero debe resolverse:
            escríbenos a soporte@moneypik.app.
          </Text>
        </View>

        {/* Vía rápida */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <Text style={{ color: "#1c2433", fontWeight: "700", fontSize: 16, marginBottom: 6 }}>
            La vía rápida: desde la app
          </Text>
          <Text style={{ color: "#5b6b82", fontSize: 14, lineHeight: 21 }}>
            Abre Moneypik → Configuración → Eliminar Cuenta y confirma dos
            veces. El borrado es inmediato.
          </Text>
        </View>

        {/* Formulario web */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <Text style={{ color: "#1c2433", fontWeight: "700", fontSize: 16, marginBottom: 6 }}>
            O pide el borrado desde aquí
          </Text>
          <Text style={{ color: "#5b6b82", fontSize: 14, lineHeight: 21, marginBottom: 12 }}>
            Si ya no tienes la app instalada, deja el email con el que te
            registraste. Procesaremos tu solicitud en un máximo de 30 días.
          </Text>

          {sent ? (
            <View
              style={{
                backgroundColor: "#dcfce7",
                borderRadius: 10,
                padding: 14,
              }}
            >
              <Text style={{ color: "#14532d", fontSize: 14, lineHeight: 20 }}>
                Solicitud registrada. Si el email corresponde a una cuenta de
                Moneypik, la eliminaremos en un máximo de 30 días.
              </Text>
            </View>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#1c2433",
                  marginBottom: 8,
                }}
              >
                Email de tu cuenta
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  borderWidth: 1,
                  borderColor: "#e3e8f0",
                  borderRadius: 9,
                  padding: 12,
                  fontSize: 15,
                  color: "#1c2433",
                  marginBottom: 12,
                }}
              />
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={
                  !email.trim().includes("@") || requestDeletion.isPending
                }
                style={{
                  backgroundColor: "#dc2626",
                  borderRadius: 9,
                  paddingVertical: 14,
                  alignItems: "center",
                  opacity:
                    !email.trim().includes("@") || requestDeletion.isPending
                      ? 0.5
                      : 1,
                }}
              >
                {requestDeletion.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                    Solicitar la eliminación de mi cuenta
                  </Text>
                )}
              </TouchableOpacity>
              {requestDeletion.isError && (
                <Text style={{ color: "#dc2626", fontSize: 13, marginTop: 10 }}>
                  No se pudo registrar la solicitud. Revisa el email e
                  inténtalo de nuevo.
                </Text>
              )}
            </>
          )}
        </View>

        <Text style={{ color: "#A78BFA", fontSize: 13, lineHeight: 19 }}>
          ¿Dudas? Escríbenos a privacidad@moneypik.app. Esta página es el
          enlace oficial de borrado de cuenta de Moneypik para Google Play.
        </Text>
      </View>
    </ScrollView>
  );
}
