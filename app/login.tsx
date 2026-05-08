import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { startOAuthLogin } from "@/constants/oauth";
import { router } from "expo-router";

export default function LoginScreen() {
  const colors = useColors();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await startOAuthLogin();
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 20 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingBottom: 40 }}>
          {/* Logo */}
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 10,
            }}
          >
            <IconSymbol name="dollarsign.circle.fill" size={48} color="#FFF" />
          </View>

          <Text style={{ fontSize: 32, fontWeight: "800", color: colors.foreground, marginBottom: 8 }}>
            Moneypik
          </Text>
          <Text style={{ fontSize: 16, color: colors.muted, textAlign: "center", lineHeight: 24, marginBottom: 48 }}>
            Sube fotos, recibe likes y{"\n"}convierte tu contenido en dinero real
          </Text>

          {/* Features */}
          <View style={{ width: "100%", gap: 16, marginBottom: 48 }}>
            {[
              { icon: "heart.fill" as const, color: "#EF4444", title: "Likes = Créditos", desc: "Cada like que recibas vale $0.01 USD" },
              { icon: "wallet.pass.fill" as const, color: colors.primary, title: "Wallet integrado", desc: "Acumula y gestiona tus ganancias" },
              { icon: "banknote.fill" as const, color: "#10B981", title: "Retiros reales", desc: "Cobra desde $20 USD via MercadoPago" },
            ].map((feature, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: `${feature.color}20`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconSymbol name={feature.icon} size={22} color={feature.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>{feature.title}</Text>
                  <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>{feature.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Login button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: colors.primary,
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={{ color: "#FFF", fontSize: 17, fontWeight: "700" }}>
                Continuar con Manus
              </Text>
            )}
          </TouchableOpacity>

          <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center", marginTop: 16, lineHeight: 18 }}>
            Al continuar, aceptas nuestros Términos de Servicio{"\n"}y Política de Privacidad
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
