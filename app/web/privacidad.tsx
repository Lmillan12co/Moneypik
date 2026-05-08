import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const SECTIONS = [
  {
    title: "1. Introducción",
    content: `Moneypik ("nosotros", "nuestro" o "la aplicación") es una plataforma de monetización de contenido digital que permite a los creadores subir fotos y videos, recibir likes de otros usuarios y convertir esos likes en créditos que pueden retirarse como dinero real.\n\nEsta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos la información personal de los usuarios de la aplicación móvil Moneypik. Al usar Moneypik, usted acepta las prácticas descritas en esta política.`,
  },
  {
    title: "2. Información que recopilamos",
    content: `Al crear una cuenta o usar la aplicación, podemos recopilar:\n\n• Información de cuenta: nombre de usuario, dirección de correo electrónico y foto de perfil, obtenidos a través del proveedor de autenticación OAuth.\n• Información de perfil: biografía, nombre de usuario personalizado y dirección de correo electrónico de MercadoPago para procesar retiros.\n• Contenido subido: fotos y videos que usted carga voluntariamente, junto con las descripciones que les asigna.\n• Información financiera: dirección de correo electrónico de MercadoPago para procesar solicitudes de retiro.\n• Datos de actividad: likes otorgados y recibidos, publicaciones creadas e historial de transacciones.\n• Datos técnicos: tipo de dispositivo, versión del sistema operativo y datos de diagnóstico de errores.`,
  },
  {
    title: "3. Permisos del dispositivo",
    content: `La aplicación solicita los siguientes permisos:\n\n• Acceso a la galería de fotos: para seleccionar imágenes para subir como contenido.\n• Acceso a la cámara: para tomar fotos directamente desde la app.\n• Notificaciones push: para informar sobre nuevos likes, retiros procesados y actualizaciones del sistema.\n\nTodos los permisos son opcionales. Puede revocarlos en cualquier momento desde la configuración de su dispositivo.`,
  },
  {
    title: "4. Cómo usamos su información",
    content: `Utilizamos la información recopilada para:\n\n• Operación del servicio: crear y gestionar su cuenta, procesar likes y créditos, calcular y ejecutar retiros a través de MercadoPago.\n• Comunicaciones: enviar notificaciones sobre actividad en su cuenta.\n• Seguridad y prevención de fraude: detectar y prevenir actividades fraudulentas en el sistema de monetización.\n• Mejora del servicio: analizar patrones de uso agregados y anónimos para mejorar la experiencia de usuario.`,
  },
  {
    title: "5. Cómo compartimos su información",
    content: `Moneypik NO vende su información personal a terceros. Podemos compartir información en las siguientes circunstancias:\n\n• Procesadores de pago: compartimos su email de MercadoPago con MercadoPago S.A. para procesar retiros.\n• Proveedores de servicios técnicos: para almacenar datos y archivos multimedia en la nube.\n• Cumplimiento legal: cuando sea requerido por ley, orden judicial o autoridad gubernamental.`,
  },
  {
    title: "6. Almacenamiento y seguridad",
    content: `Su información se almacena en servidores seguros con cifrado en tránsito (TLS/HTTPS) y en reposo. Los datos de la cuenta se conservan mientras su cuenta esté activa. Si elimina su cuenta, procederemos a eliminar su información personal en un plazo de 30 días, excepto cuando la retención sea requerida por obligaciones legales.`,
  },
  {
    title: "7. Sus derechos",
    content: `Usted tiene los siguientes derechos respecto a su información personal:\n\n• Acceso: solicitar una copia de los datos que tenemos sobre usted.\n• Rectificación: corregir información inexacta desde la sección "Editar perfil".\n• Eliminación: solicitar la eliminación de su cuenta y datos personales.\n• Portabilidad: solicitar una exportación de sus datos en formato legible por máquina.\n\nPara ejercer estos derechos, contáctenos en privacidad@moneypik.app`,
  },
  {
    title: "8. Privacidad de menores",
    content: `Moneypik no está dirigida a personas menores de 18 años. No recopilamos conscientemente información personal de menores. Si descubrimos que hemos recopilado información de un menor, la eliminaremos de inmediato.`,
  },
  {
    title: "9. Cambios a esta política",
    content: `Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos a través de una notificación en la aplicación o por correo electrónico. El uso continuado de la aplicación después de la publicación de cambios constituye su aceptación de la política actualizada.`,
  },
  {
    title: "10. Contacto",
    content: `Si tiene preguntas sobre esta Política de Privacidad:\n\n• Email: privacidad@moneypik.app\n• Sitio web: https://moneypik.app`,
  },
];

export default function PrivacidadPage() {
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
          backgroundColor: "rgba(124,58,237,0.15)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6,
          borderWidth: 1, borderColor: "rgba(124,58,237,0.3)", alignSelf: "flex-start", marginBottom: 20,
        }}>
          <Text style={{ color: "#A78BFA", fontSize: 12, fontWeight: "600" }}>Última actualización: 8 de mayo de 2026</Text>
        </View>
        <Text style={{ fontSize: 40, fontWeight: "900", color: "#fff", marginBottom: 16 }}>
          Política de{"\n"}
          <Text style={{ color: "#7C3AED" }}>Privacidad</Text>
        </Text>
        <Text style={{ fontSize: 16, color: "#9CA3AF", lineHeight: 26, maxWidth: 600 }}>
          En Moneypik nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política describe
          de forma transparente cómo manejamos tu información personal.
        </Text>
      </View>

      {/* CONTENT */}
      <View style={{ paddingHorizontal: 32, maxWidth: 800, alignSelf: "center", width: "100%" }}>
        {SECTIONS.map((section, i) => (
          <View key={i} style={{
            backgroundColor: "rgba(124,58,237,0.06)", borderRadius: 16, padding: 28,
            borderWidth: 1, borderColor: "rgba(124,58,237,0.15)", marginBottom: 16,
          }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#A78BFA", marginBottom: 14 }}>
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
            <Text style={{ color: "#7C3AED", fontSize: 14, fontWeight: "600" }}>Política de Privacidad</Text>
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
