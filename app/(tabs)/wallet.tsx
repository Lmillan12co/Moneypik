import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const MIN_WITHDRAWAL = 20;
const FEE_RATE = 0.05;

function StatCard({ icon, iconColor, iconBg, label, value, subtitle }: {
  icon: any; iconColor: string; iconBg: string;
  label: string; value: string; subtitle?: string;
}) {
  const colors = useColors();
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: iconBg, alignItems: "center", justifyContent: "center" }}>
        <IconSymbol name={icon} size={18} color={iconColor} />
      </View>
      <Text style={{ fontSize: 20, fontWeight: "800", color: colors.foreground }}>{value}</Text>
      <Text style={{ fontSize: 12, color: colors.muted, fontWeight: "600" }}>{label}</Text>
      {subtitle && <Text style={{ fontSize: 11, color: colors.muted }}>{subtitle}</Text>}
    </View>
  );
}

function WithdrawModal({ visible, onClose, balance, mercadoPagoEmail, onSuccess }: {
  visible: boolean; onClose: () => void;
  balance: number; mercadoPagoEmail: string | null;
  onSuccess: () => void;
}) {
  const colors = useColors();
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState(mercadoPagoEmail ?? "");

  const utils = trpc.useUtils();
  const withdraw = trpc.wallet.withdraw.useMutation({
    onSuccess: () => {
      utils.wallet.balance.invalidate();
      utils.wallet.transactions.invalidate();
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onSuccess();
      onClose();
      setAmount("");
    },
    onError: (err) => {
      Alert.alert("Error", err.message);
    },
  });

  const numAmount = parseFloat(amount) || 0;
  const fee = numAmount * FEE_RATE;
  const netAmount = numAmount - fee;
  const canWithdraw = numAmount >= MIN_WITHDRAWAL && numAmount <= balance && email.includes("@");

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>Retirar fondos</Text>
          <TouchableOpacity onPress={onClose}>
            <IconSymbol name="xmark.circle.fill" size={28} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
          {/* Balance disponible */}
          <View style={{ backgroundColor: "#EDE9FE", borderRadius: 16, padding: 16, alignItems: "center" }}>
            <Text style={{ fontSize: 13, color: colors.primary, fontWeight: "600", marginBottom: 4 }}>Saldo disponible</Text>
            <Text style={{ fontSize: 32, fontWeight: "800", color: colors.primary }}>${balance.toFixed(2)} USD</Text>
          </View>

          {/* Monto */}
          <View>
            <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>Monto a retirar (USD)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder={`Mínimo $${MIN_WITHDRAWAL}`}
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 14,
                fontSize: 18,
                fontWeight: "700",
                color: colors.foreground,
              }}
            />
          </View>

          {/* Email MercadoPago */}
          <View>
            <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>Email de MercadoPago</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 14,
                fontSize: 15,
                color: colors.foreground,
              }}
            />
          </View>

          {/* Resumen */}
          {numAmount > 0 && (
            <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>Resumen del retiro</Text>
              {[
                { label: "Monto solicitado", value: `$${numAmount.toFixed(2)} USD` },
                { label: `Tarifa (${(FEE_RATE * 100).toFixed(0)}%)`, value: `-$${fee.toFixed(2)} USD`, color: colors.error },
                { label: "Recibirás", value: `$${netAmount.toFixed(2)} USD`, color: "#10B981", bold: true },
              ].map((row, i) => (
                <View key={i} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: colors.muted, fontSize: 14 }}>{row.label}</Text>
                  <Text style={{ color: row.color ?? colors.foreground, fontSize: 14, fontWeight: row.bold ? "700" : "500" }}>{row.value}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Botón */}
          <TouchableOpacity
            onPress={() => withdraw.mutate({ amount: numAmount, mercadoPagoEmail: email })}
            disabled={!canWithdraw || withdraw.isPending}
            style={{
              backgroundColor: canWithdraw ? colors.primary : colors.border,
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              opacity: withdraw.isPending ? 0.7 : 1,
            }}
          >
            {withdraw.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={{ color: canWithdraw ? "#FFF" : colors.muted, fontSize: 16, fontWeight: "700" }}>
                {numAmount < MIN_WITHDRAWAL ? `Mínimo $${MIN_WITHDRAWAL} USD` : "Confirmar retiro"}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center", lineHeight: 18 }}>
            Los retiros se procesan en 1-3 días hábiles.{"\n"}Se aplica una tarifa del 5% sobre el monto retirado.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function WalletScreen() {
  const colors = useColors();
  const { isAuthenticated } = useAuth();
  const [showWithdraw, setShowWithdraw] = useState(false);

  const { data: balance, isLoading: balanceLoading, refetch: refetchBalance } = trpc.wallet.balance.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: transactions, isLoading: txLoading, refetch: refetchTx } = trpc.wallet.transactions.useQuery({ limit: 20 }, {
    enabled: isAuthenticated,
  });

  const TX_ICONS: Record<string, { icon: any; color: string; bg: string }> = {
    credit_earned: { icon: "heart.fill", color: "#EF4444", bg: "#FEE2E2" },
    withdrawal_requested: { icon: "arrow.up.right.circle", color: colors.primary, bg: "#EDE9FE" },
    withdrawal_completed: { icon: "checkmark.circle.fill", color: "#10B981", bg: "#D1FAE5" },
    withdrawal_rejected: { icon: "exclamationmark.circle.fill", color: "#EF4444", bg: "#FEE2E2" },
  };

  if (!isAuthenticated) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border, backgroundColor: colors.surface }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>Wallet</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <IconSymbol name="wallet.pass.fill" size={56} color={colors.muted} />
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, marginTop: 16, marginBottom: 8 }}>Tu Wallet</Text>
          <Text style={{ color: colors.muted, textAlign: "center", lineHeight: 22 }}>
            Inicia sesión para ver tu balance, historial de ganancias y retirar dinero
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/login" as any)}
            style={{ marginTop: 24, backgroundColor: colors.primary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 24 }}
          >
            <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 16 }}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border, backgroundColor: colors.surface }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>Wallet</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* Balance principal */}
        <View
          style={{
            borderRadius: 24,
            padding: 24,
            backgroundColor: colors.primary,
            alignItems: "center",
            gap: 8,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: "600" }}>Balance disponible</Text>
          {balanceLoading ? (
            <ActivityIndicator color="#FFF" size="large" />
          ) : (
            <>
              <Text style={{ color: "#FFF", fontSize: 44, fontWeight: "800" }}>
                ${(balance?.totalCredits ?? 0).toFixed(2)}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>USD</Text>
            </>
          )}
          <TouchableOpacity
            onPress={() => setShowWithdraw(true)}
            style={{
              marginTop: 12,
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.4)",
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 15 }}>
              💸 Retirar fondos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <StatCard
            icon="heart.fill"
            iconColor="#EF4444"
            iconBg="#FEE2E2"
            label="Likes recibidos"
            value={(balance?.totalLikesReceived ?? 0).toString()}
            subtitle="Total histórico"
          />
          <StatCard
            icon="banknote.fill"
            iconColor="#10B981"
            iconBg="#D1FAE5"
            label="Total retirado"
            value={`$${(balance?.totalWithdrawn ?? 0).toFixed(2)}`}
            subtitle="USD acumulado"
          />
        </View>

        {/* Info retiro */}
        {(balance?.totalCredits ?? 0) < MIN_WITHDRAWAL && (
          <View style={{ backgroundColor: "#FEF3C7", borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <IconSymbol name="info.circle.fill" size={20} color="#F59E0B" />
            <Text style={{ flex: 1, color: "#92400E", fontSize: 13, lineHeight: 18 }}>
              Necesitas al menos ${MIN_WITHDRAWAL} USD para retirar. Te faltan ${(MIN_WITHDRAWAL - (balance?.totalCredits ?? 0)).toFixed(2)} USD.
            </Text>
          </View>
        )}

        {/* Historial de transacciones */}
        <View>
          <Text style={{ fontSize: 17, fontWeight: "700", color: colors.foreground, marginBottom: 12 }}>
            Historial de transacciones
          </Text>
          {txLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : transactions && transactions.length > 0 ? (
            <View style={{ gap: 8 }}>
              {transactions.map((tx) => {
                const config = TX_ICONS[tx.type] ?? TX_ICONS.credit_earned;
                const isCredit = tx.type === "credit_earned";
                return (
                  <View
                    key={tx.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      backgroundColor: colors.surface,
                      borderRadius: 14,
                      padding: 14,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: config.bg, alignItems: "center", justifyContent: "center" }}>
                      <IconSymbol name={config.icon} size={20} color={config.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }} numberOfLines={1}>
                        {tx.description ?? tx.type}
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                        {new Date(tx.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: isCredit ? "#10B981" : colors.primary }}>
                      {isCredit ? "+" : "-"}${parseFloat(tx.amount?.toString() ?? "0").toFixed(2)}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={{ alignItems: "center", padding: 32, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
              <IconSymbol name="clock.fill" size={32} color={colors.muted} />
              <Text style={{ color: colors.muted, marginTop: 12, textAlign: "center" }}>
                Aún no tienes transacciones.{"\n"}¡Sube contenido y empieza a ganar!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <WithdrawModal
        visible={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        balance={balance?.totalCredits ?? 0}
        mercadoPagoEmail={balance?.mercadoPagoEmail ?? null}
        onSuccess={() => {
          refetchBalance();
          refetchTx();
        }}
      />
    </ScreenContainer>
  );
}
