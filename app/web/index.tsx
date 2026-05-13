import { ScrollView, View, Text, TouchableOpacity, Image, Linking, Platform } from "react-native";
import { useRouter } from "expo-router";

const FEATURES = [
  {
    icon: "❤️",
    title: "$0.01 por cada like",
    desc: "Cada like que recibes en tu contenido se convierte automáticamente en créditos reales en tu wallet.",
  },
  {
    icon: "📸",
    title: "Sube fotos y videos",
    desc: "Comparte tu mejor contenido desde la galería o directamente con la cámara de tu dispositivo.",
  },
  {
    icon: "💸",
    title: "Retiros via MercadoPago",
    desc: "Transfiere tu dinero a tu cuenta de MercadoPago cuando alcances $20 USD. Rápido y seguro.",
  },
  {
    icon: "🔔",
    title: "Notificaciones en tiempo real",
    desc: "Recibe alertas instantáneas cada vez que alguien le da like a tu contenido.",
  },
  {
    icon: "👤",
    title: "Perfil de creador",
    desc: "Personaliza tu perfil con foto, nombre de usuario y biografía para destacar en la comunidad.",
  },
  {
    icon: "📊",
    title: "Estadísticas detalladas",
    desc: "Visualiza tu saldo, historial de transacciones y el total de likes recibidos en tiempo real.",
  },
];

const STEPS = [
  { num: "1", title: "Crea tu cuenta", desc: "Regístrate gratis en segundos con tu cuenta de Google." },
  { num: "2", title: "Sube contenido", desc: "Publica tus mejores fotos y videos para que la comunidad los vea." },
  { num: "3", title: "Recibe likes", desc: "Cada like que recibes suma $0.01 USD a tu wallet automáticamente." },
  { num: "4", title: "Retira tu dinero", desc: "Cuando acumules $20 USD, retira directo a tu MercadoPago." },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0f0520" }} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* NAV */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 32, paddingVertical: 20,
        borderBottomWidth: 1, borderBottomColor: "rgba(124,58,237,0.2)",
      }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>
          Money<Text style={{ color: "#F59E0B" }}>pik</Text>
        </Text>
        <View style={{ flexDirection: "row", gap: 24 }}>
          <TouchableOpacity onPress={() => router.push("/web/privacidad" as any)}>
            <Text style={{ color: "#9CA3AF", fontSize: 14 }}>Privacidad</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/web/terminos" as any)}>
            <Text style={{ color: "#9CA3AF", fontSize: 14 }}>Términos</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HERO */}
      <View style={{ alignItems: "center", paddingHorizontal: 24, paddingTop: 80, paddingBottom: 60 }}>
        {/* Badge */}
        <View style={{
          backgroundColor: "rgba(124,58,237,0.2)", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6,
          borderWidth: 1, borderColor: "rgba(124,58,237,0.4)", marginBottom: 28,
        }}>
          <Text style={{ color: "#A78BFA", fontSize: 13, fontWeight: "600" }}>
            🚀 Disponible en Google Play Store
          </Text>
        </View>

        <Text style={{
          fontSize: Platform.OS === "web" ? 56 : 38, fontWeight: "900", color: "#fff",
          textAlign: "center", lineHeight: Platform.OS === "web" ? 68 : 46, marginBottom: 20,
        }}>
          Convierte tu{"\n"}
          <Text style={{ color: "#7C3AED" }}>contenido</Text> en{"\n"}
          <Text style={{ color: "#F59E0B" }}>dinero real</Text>
        </Text>

        <Text style={{
          fontSize: 18, color: "#9CA3AF", textAlign: "center", lineHeight: 28,
          maxWidth: 520, marginBottom: 40,
        }}>
          Sube fotos y videos, recibe likes de la comunidad y gana{" "}
          <Text style={{ color: "#F59E0B", fontWeight: "700" }}>$0.01 USD por cada like</Text>.
          Retira tu dinero directo a MercadoPago.
        </Text>

        {/* CTA Buttons */}
        <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 60 }}>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=space.manus.moneypik")}
            style={{
              backgroundColor: "#7C3AED", paddingHorizontal: 32, paddingVertical: 16,
              borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 10,
            }}
          >
            <Text style={{ fontSize: 20 }}>▶</Text>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Disponible en</Text>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Google Play</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL("https://moneypik-6pxxi6wd.manus.space")}
            style={{
              backgroundColor: "transparent", paddingHorizontal: 32, paddingVertical: 16,
              borderRadius: 12, borderWidth: 1.5, borderColor: "#7C3AED",
            }}
          >
            <Text style={{ color: "#A78BFA", fontSize: 16, fontWeight: "600" }}>Ver demo web →</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={{
          flexDirection: "row", gap: 40, flexWrap: "wrap", justifyContent: "center",
          paddingTop: 40, borderTopWidth: 1, borderTopColor: "rgba(124,58,237,0.2)",
        }}>
          {[
            { value: "$0.01", label: "USD por like" },
            { value: "$20", label: "Retiro mínimo" },
            { value: "5%", label: "Tarifa de servicio" },
            { value: "1-3", label: "Días de procesamiento" },
          ].map((s) => (
            <View key={s.label} style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 28, fontWeight: "900", color: "#F59E0B" }}>{s.value}</Text>
              <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* SCREENSHOTS */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 60, backgroundColor: "rgba(124,58,237,0.05)" }}>
        <Text style={{ fontSize: 36, fontWeight: "800", color: "#fff", textAlign: "center", marginBottom: 12 }}>
          Diseñada para creadores
        </Text>
        <Text style={{ fontSize: 16, color: "#9CA3AF", textAlign: "center", marginBottom: 48 }}>
          Una interfaz limpia y moderna para que te enfoques en crear contenido.
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingHorizontal: 8 }}>
          {[
            { url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663639924158/6Pxxi6WdRASeN2u49QBKnM/screenshot-1-feed-JzSWa3VTZxicDHbSbitCwb.png", label: "Feed" },
            { url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663639924158/6Pxxi6WdRASeN2u49QBKnM/screenshot-2-wallet-dybdUckVwVnTvhTCfB2zi6.png", label: "Wallet" },
            { url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663639924158/6Pxxi6WdRASeN2u49QBKnM/screenshot-3-profile-NxQjsSjWzVVGTFwu9QGCxJ.png", label: "Perfil" },
            { url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663639924158/6Pxxi6WdRASeN2u49QBKnM/screenshot-4-withdraw-GWSkanHJu3oinsJgi4iyw7.png", label: "Retiro" },
          ].map((s) => (
            <View key={s.label} style={{ alignItems: "center", gap: 12 }}>
              <Image
                source={{ uri: s.url }}
                style={{ width: 200, height: 356, borderRadius: 20, backgroundColor: "#1a0533" }}
                resizeMode="cover"
              />
              <Text style={{ color: "#9CA3AF", fontSize: 13 }}>{s.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* FEATURES */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 60 }}>
        <Text style={{ fontSize: 36, fontWeight: "800", color: "#fff", textAlign: "center", marginBottom: 12 }}>
          Todo lo que necesitas
        </Text>
        <Text style={{ fontSize: 16, color: "#9CA3AF", textAlign: "center", marginBottom: 48 }}>
          Herramientas profesionales para monetizar tu contenido desde el primer día.
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          {FEATURES.map((f) => (
            <View key={f.title} style={{
              backgroundColor: "rgba(124,58,237,0.08)", borderRadius: 16, padding: 24,
              borderWidth: 1, borderColor: "rgba(124,58,237,0.2)",
              width: Platform.OS === "web" ? 300 : "100%", maxWidth: 340,
            }}>
              <Text style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</Text>
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 8 }}>{f.title}</Text>
              <Text style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 22 }}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* HOW IT WORKS */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 60, backgroundColor: "rgba(124,58,237,0.05)" }}>
        <Text style={{ fontSize: 36, fontWeight: "800", color: "#fff", textAlign: "center", marginBottom: 12 }}>
          ¿Cómo funciona?
        </Text>
        <Text style={{ fontSize: 16, color: "#9CA3AF", textAlign: "center", marginBottom: 48 }}>
          Empieza a ganar en 4 simples pasos.
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
          {STEPS.map((step) => (
            <View key={step.num} style={{ alignItems: "center", width: 200 }}>
              <View style={{
                width: 56, height: 56, borderRadius: 28,
                backgroundColor: "#7C3AED", alignItems: "center", justifyContent: "center", marginBottom: 16,
              }}>
                <Text style={{ fontSize: 22, fontWeight: "900", color: "#fff" }}>{step.num}</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff", textAlign: "center", marginBottom: 8 }}>{step.title}</Text>
              <Text style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center", lineHeight: 20 }}>{step.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA FINAL */}
      <View style={{ alignItems: "center", paddingHorizontal: 24, paddingVertical: 80 }}>
        <Text style={{ fontSize: 40, fontWeight: "900", color: "#fff", textAlign: "center", marginBottom: 16 }}>
          Empieza a ganar{"\n"}
          <Text style={{ color: "#F59E0B" }}>hoy mismo</Text>
        </Text>
        <Text style={{ fontSize: 16, color: "#9CA3AF", textAlign: "center", marginBottom: 40, maxWidth: 400 }}>
          Únete a la comunidad de creadores que ya monetizan su contenido con Moneypik. Es gratis.
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=space.manus.moneypik")}
          style={{
            backgroundColor: "#F59E0B", paddingHorizontal: 40, paddingVertical: 18,
            borderRadius: 14,
          }}
        >
          <Text style={{ color: "#0f0520", fontSize: 18, fontWeight: "800" }}>
            Descargar gratis en Play Store
          </Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <View style={{
        borderTopWidth: 1, borderTopColor: "rgba(124,58,237,0.2)",
        paddingHorizontal: 32, paddingVertical: 32,
        flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16,
      }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#fff" }}>
          Money<Text style={{ color: "#F59E0B" }}>pik</Text>
        </Text>
        <View style={{ flexDirection: "row", gap: 24 }}>
          <TouchableOpacity onPress={() => router.push("/web/privacidad" as any)}>
            <Text style={{ color: "#6B7280", fontSize: 14 }}>Política de Privacidad</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/web/terminos" as any)}>
            <Text style={{ color: "#6B7280", fontSize: 14 }}>Términos de Uso</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: "#4B5563", fontSize: 13 }}>© 2026 Moneypik. Todos los derechos reservados.</Text>
      </View>
    </ScrollView>
  );
}
