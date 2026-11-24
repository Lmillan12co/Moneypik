/**
 * Moneypik — Modal para reportar una publicación o un usuario.
 *
 * ARCHIVO NUEVO (components/report-modal.tsx).
 * Lo usa components/post-actions.tsx. No modifica ningún archivo del repo.
 *
 * El usuario elige un motivo y puede añadir un detalle opcional.
 * Al enviar, llama a la función onSubmit que le pasa el componente padre
 * (que ejecuta la mutación tRPC reportPost o reportUser).
 */
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

// Los motivos deben coincidir con REPORT_REASONS de server/moderation.ts.
// Se duplican aquí a propósito: el cliente no debe importar archivos
// del servidor (drizzle, getDb). Si se añade un motivo, hay que añadirlo
// en los dos lados.
export type ReportReason =
  | "spam"
  | "contenido_sexual"
  | "violencia"
  | "acoso"
  | "fraude"
  | "otro";

export const REPORT_REASON_OPTIONS: { value: ReportReason; label: string }[] = [
  { value: "spam", label: "Spam o contenido no deseado" },
  { value: "contenido_sexual", label: "Contenido sexual o explícito" },
  { value: "violencia", label: "Violencia o contenido perturbador" },
  { value: "acoso", label: "Acoso o intimidación" },
  { value: "fraude", label: "Fraude o engaño" },
  { value: "otro", label: "Otro motivo" },
];

export function ReportModal({
  visible,
  title,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (reason: ReportReason, details?: string) => void;
  isSubmitting: boolean;
}) {
  const colors = useColors();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");

  const handleSubmit = () => {
    if (!reason) return;
    onSubmit(reason, details.trim() || undefined);
  };

  const handleClose = () => {
    setReason(null);
    setDetails("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>
            {title}
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <IconSymbol name="xmark.circle.fill" size={28} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
          <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 20 }}>
            El equipo de Moneypik revisa todos los reportes. No le avisamos
            a la otra persona quién lo reportó.
          </Text>

          {REPORT_REASON_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setReason(option.value)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor:
                  reason === option.value ? colors.primary : colors.border,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor:
                    reason === option.value ? colors.primary : colors.muted,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {reason === option.value && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: colors.primary,
                    }}
                  />
                )}
              </View>
              <Text
                style={{ fontSize: 15, color: colors.foreground, fontWeight: "600" }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}

          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.foreground,
              marginTop: 8,
            }}
          >
            Detalle (opcional)
          </Text>
          <TextInput
            value={details}
            onChangeText={setDetails}
            placeholder="Cuéntanos qué pasó..."
            placeholderTextColor={colors.muted}
            multiline
            maxLength={500}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 14,
              color: colors.foreground,
              fontSize: 15,
              minHeight: 80,
              textAlignVertical: "top",
            }}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!reason || isSubmitting}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              opacity: !reason || isSubmitting ? 0.5 : 1,
              marginTop: 8,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "700" }}>
                Enviar reporte
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
