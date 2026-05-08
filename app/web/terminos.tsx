import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const SECTIONS = [
  {
    title: "1. Aceptación de los términos",
    content: `Al descargar, instalar o utilizar la aplicación móvil Moneypik ("la Aplicación"), usted acepta quedar vinculado por estos Términos de Uso. Si no acepta estos Términos en su totalidad, no debe usar la Aplicación. Moneypik se reserva el derecho de modificar estos Términos en cualquier momento, notificando a los usuarios a través de la Aplicación.`,
  },
  {
    title: "2. Descripción del servicio",
    content: `Moneypik es una plataforma de monetización de contenido digital que permite a los usuarios:\n\n• Crear una cuenta y un perfil público de creador de contenido.\n• Subir fotos y videos a la plataforma para que otros usuarios los vean.\n• Recibir "likes" de otros usuarios en su contenido publicado.\n• Acumular créditos en USD a razón de $0.01 USD por cada like recibido.\n• Solicitar retiros del saldo acumulado a través de MercadoPago, sujeto a un mínimo de $20.00 USD y una tarifa de servicio del 5%.`,
  },
  {
    title: "3. Elegibilidad y registro",
    content: `Para usar Moneypik debe tener al menos 18 años de edad. Al crear una cuenta, usted declara y garantiza que cumple con este requisito. La Aplicación utiliza autenticación OAuth a través de proveedores de identidad de terceros. Usted es responsable de mantener la confidencialidad de su cuenta y de todas las actividades que ocurran bajo ella.`,
  },
  {
    title: "4. Contenido permitido y prohibido",
    content: `Puede subir fotos y videos originales de su autoría que cumplan con estas directrices.\n\nEstá estrictamente prohibido subir contenido que:\n\n• Sea de naturaleza sexual explícita o pornográfica.\n• Muestre o promueva violencia, abuso, acoso o discriminación.\n• Infrinja derechos de autor o propiedad intelectual de terceros.\n• Contenga información personal de terceros sin su consentimiento.\n• Promueva actividades ilegales, fraude o engaño.\n• Sea spam o contenido generado de forma automatizada con fines manipuladores.\n\nMoneypik se reserva el derecho de eliminar cualquier contenido que viole estas directrices y de suspender o cancelar las cuentas de los infractores.`,
  },
  {
    title: "5. Sistema de monetización",
    content: `Los créditos se acumulan a razón de $0.01 USD por cada like legítimo recibido. Moneypik se reserva el derecho de anular créditos obtenidos mediante actividades fraudulentas.\n\nCondiciones de retiro:\n• Saldo mínimo: $20.00 USD\n• Tarifa de servicio: 5% sobre el monto solicitado\n• Método de pago: MercadoPago (requiere cuenta activa)\n• Tiempo de procesamiento: 1 a 3 días hábiles\n\nEl usuario es el único responsable de declarar y pagar los impuestos aplicables sobre los ingresos obtenidos a través de Moneypik.`,
  },
  {
    title: "6. Conducta del usuario",
    content: `Al usar Moneypik, usted se compromete a no:\n\n• Usar la Aplicación para fines ilegales o no autorizados.\n• Intentar acceder a cuentas o sistemas de Moneypik sin autorización.\n• Usar bots, scripts u otros medios automatizados para interactuar con la plataforma.\n• Acosar, intimidar o amenazar a otros usuarios.\n• Crear múltiples cuentas con el propósito de manipular el sistema de monetización.\n• Intentar eludir las medidas de seguridad o los controles antifraude.`,
  },
  {
    title: "7. Propiedad intelectual",
    content: `Todos los derechos sobre la Aplicación, incluyendo su diseño, código fuente, marca, logotipos y funcionalidades, son propiedad exclusiva de Moneypik o sus licenciantes. Al subir contenido, usted otorga a Moneypik una licencia mundial, no exclusiva, libre de regalías para mostrar y distribuir dicho contenido dentro de la plataforma. Usted conserva la titularidad de sus derechos de autor.`,
  },
  {
    title: "8. Limitación de responsabilidad",
    content: `En la máxima medida permitida por la ley aplicable, Moneypik no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo pérdida de ganancias o datos, derivados del uso o la imposibilidad de usar la Aplicación. La responsabilidad total de Moneypik hacia usted no excederá el monto que usted haya pagado a Moneypik en los últimos 12 meses.`,
  },
  {
    title: "9. Suspensión y cancelación",
    content: `Moneypik puede suspender o cancelar su cuenta en cualquier momento si determina que usted ha violado estos Términos. En caso de cancelación por fraude o abuso, los créditos acumulados serán anulados. Usted puede cancelar su cuenta en cualquier momento contactándonos en legal@moneypik.app`,
  },
  {
    title: "10. Ley aplicable y contacto",
    content: `Estos Términos se rigen por las leyes de la República Mexicana. Cualquier disputa se someterá a la jurisdicción de los tribunales competentes de la Ciudad de México.\n\nPara preguntas sobre estos Términos:\n• Email: legal@moneypik.app\n• Sitio web: https://moneypik.app`,
  },
];

export default function TerminosPage() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0f0520" }} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* NAV */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 32, paddingVertical: 20,
        borderBottomWidth: 1, borderBottomColor: "rgba(124,58,237,0.2)",
      }}>
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
      <View style={{ paddingHorizontal: 32, paddingTop: 48, paddingBottom: 32 }}>
        <View style={{
          backgroundColor: "rgba(245,158,11,0.15)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6,
          borderWidth: 1, borderColor: "rgba(245,158,11,0.3)", alignSelf: "flex-start", marginBottom: 20,
        }}>
          <Text style={{ color: "#F59E0B", fontSize: 12, fontWeight: "600" }}>Última actualización: 8 de mayo de 2026</Text>
        </View>
        <Text style={{ fontSize: 40, fontWeight: "900", color: "#fff", marginBottom: 16 }}>
          Términos{"\n"}
          <Text style={{ color: "#F59E0B" }}>de Uso</Text>
        </Text>
        <Text style={{ fontSize: 16, color: "#9CA3AF", lineHeight: 26, maxWidth: 600 }}>
          Al usar Moneypik aceptas estos términos. Te recomendamos leerlos detenidamente antes de
          crear tu cuenta y comenzar a monetizar tu contenido.
        </Text>
      </View>

      {/* CONTENT */}
      <View style={{ paddingHorizontal: 32, maxWidth: 800, alignSelf: "center", width: "100%" }}>
        {SECTIONS.map((section, i) => (
          <View key={i} style={{
            backgroundColor: "rgba(245,158,11,0.04)", borderRadius: 16, padding: 28,
            borderWidth: 1, borderColor: "rgba(245,158,11,0.12)", marginBottom: 16,
          }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#F59E0B", marginBottom: 14 }}>
              {section.title}
            </Text>
            <Text style={{ fontSize: 15, color: "#D1D5DB", lineHeight: 26 }}>
              {section.content}
            </Text>
          </View>
        ))}
      </View>

      {/* FOOTER */}
      <View style={{
        borderTopWidth: 1, borderTopColor: "rgba(124,58,237,0.2)",
        paddingHorizontal: 32, paddingVertical: 32, marginTop: 40,
        flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16,
      }}>
        <TouchableOpacity onPress={() => router.push("/web" as any)}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#fff" }}>
            Money<Text style={{ color: "#F59E0B" }}>pik</Text>
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 24 }}>
          <TouchableOpacity onPress={() => router.push("/web/privacidad" as any)}>
            <Text style={{ color: "#6B7280", fontSize: 14 }}>Política de Privacidad</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/web/terminos" as any)}>
            <Text style={{ color: "#F59E0B", fontSize: 14, fontWeight: "600" }}>Términos de Uso</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: "#4B5563", fontSize: 13 }}>© 2026 Moneypik. Todos los derechos reservados.</Text>
      </View>
    </ScrollView>
  );
}
