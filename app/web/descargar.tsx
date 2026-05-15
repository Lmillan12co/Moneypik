import React from 'react';
import { ScrollView, Text, View, Pressable, Linking } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useRouter } from 'expo-router';

export default function DescargarScreen() {
  const router = useRouter();

  const handleDownloadAPK = async () => {
    // En producción, esto debería apuntar a tu servidor o CDN
    const apkUrl = 'https://github.com/Lmillan12co/Moneypik/releases/download/v1.0.0/moneypik.apk';
    try {
      await Linking.openURL(apkUrl);
    } catch (error) {
      console.error('Error descargando APK:', error);
    }
  };

  const handleOpenPlayStore = async () => {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=space.manus.moneypik';
    try {
      await Linking.openURL(playStoreUrl);
    } catch (error) {
      console.error('Error abriendo Play Store:', error);
    }
  };

  const handleOpenAmazonAppstore = async () => {
    const amazonUrl = 'https://www.amazon.com/dp/YOUR_APP_ID';
    try {
      await Linking.openURL(amazonUrl);
    } catch (error) {
      console.error('Error abriendo Amazon Appstore:', error);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 gap-8 p-6">
          {/* Header */}
          <View className="gap-2">
            <Pressable onPress={() => router.back()} className="mb-4">
              <Text className="text-primary text-base font-semibold">← Volver</Text>
            </Pressable>
            <Text className="text-4xl font-bold text-foreground">Descargar Moneypik</Text>
            <Text className="text-base text-muted">Elige tu plataforma preferida</Text>
          </View>

          {/* Google Play Store */}
          <Pressable
            onPress={handleOpenPlayStore}
            className="bg-surface rounded-xl p-6 border border-border active:opacity-80"
          >
            <View className="gap-2">
              <Text className="text-2xl font-bold text-foreground">📱 Google Play Store</Text>
              <Text className="text-sm text-muted">
                Disponible para dispositivos Android. La forma más segura de descargar.
              </Text>
              <View className="flex-row gap-2 mt-2">
                <View className="bg-primary/20 rounded-full px-3 py-1">
                  <Text className="text-xs text-primary font-semibold">Recomendado</Text>
                </View>
                <View className="bg-success/20 rounded-full px-3 py-1">
                  <Text className="text-xs text-success font-semibold">Verificado</Text>
                </View>
              </View>
            </View>
          </Pressable>

          {/* Amazon Appstore */}
          <Pressable
            onPress={handleOpenAmazonAppstore}
            className="bg-surface rounded-xl p-6 border border-border active:opacity-80"
          >
            <View className="gap-2">
              <Text className="text-2xl font-bold text-foreground">🛒 Amazon Appstore</Text>
              <Text className="text-sm text-muted">
                Alternativa a Google Play. Disponible en dispositivos Amazon y Android.
              </Text>
              <View className="flex-row gap-2 mt-2">
                <View className="bg-warning/20 rounded-full px-3 py-1">
                  <Text className="text-xs text-warning font-semibold">Próximamente</Text>
                </View>
              </View>
            </View>
          </Pressable>

          {/* Descarga directa APK */}
          <Pressable
            onPress={handleDownloadAPK}
            className="bg-surface rounded-xl p-6 border border-border active:opacity-80"
          >
            <View className="gap-2">
              <Text className="text-2xl font-bold text-foreground">⬇️ Descarga directa APK</Text>
              <Text className="text-sm text-muted">
                Descarga el archivo APK directamente desde GitHub. Útil si tienes problemas con las tiendas.
              </Text>
              <View className="flex-row gap-2 mt-2">
                <View className="bg-border rounded-full px-3 py-1">
                  <Text className="text-xs text-muted font-semibold">Avanzado</Text>
                </View>
              </View>
            </View>
          </Pressable>

          {/* Información de requisitos */}
          <View className="bg-surface rounded-xl p-6 border border-border gap-4">
            <Text className="text-lg font-bold text-foreground">📋 Requisitos del sistema</Text>
            <View className="gap-3">
              <View className="flex-row gap-3">
                <Text className="text-primary font-bold">✓</Text>
                <Text className="text-sm text-muted flex-1">Android 7.0 o superior</Text>
              </View>
              <View className="flex-row gap-3">
                <Text className="text-primary font-bold">✓</Text>
                <Text className="text-sm text-muted flex-1">Mínimo 100 MB de espacio libre</Text>
              </View>
              <View className="flex-row gap-3">
                <Text className="text-primary font-bold">✓</Text>
                <Text className="text-sm text-muted flex-1">Conexión a internet</Text>
              </View>
              <View className="flex-row gap-3">
                <Text className="text-primary font-bold">✓</Text>
                <Text className="text-sm text-muted flex-1">Cuenta de Google para autenticación</Text>
              </View>
            </View>
          </View>

          {/* FAQ */}
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">❓ Preguntas frecuentes</Text>
            
            <View className="bg-surface rounded-xl p-4 border border-border gap-2">
              <Text className="font-semibold text-foreground">¿Es seguro descargar desde aquí?</Text>
              <Text className="text-sm text-muted">
                Sí, todas nuestras descargas están verificadas y firmadas digitalmente. Recomendamos descargar desde Google Play Store para máxima seguridad.
              </Text>
            </View>

            <View className="bg-surface rounded-xl p-4 border border-border gap-2">
              <Text className="font-semibold text-foreground">¿Cuánto espacio ocupa?</Text>
              <Text className="text-sm text-muted">
                La app ocupa aproximadamente 80-100 MB. El tamaño puede variar según tu dispositivo.
              </Text>
            </View>

            <View className="bg-surface rounded-xl p-4 border border-border gap-2">
              <Text className="font-semibold text-foreground">¿Necesito pagar para descargar?</Text>
              <Text className="text-sm text-muted">
                No, Moneypik es completamente gratis. Solo pagas una comisión del 5% cuando retiras tu dinero.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View className="border-t border-border pt-6 gap-2">
            <Text className="text-xs text-muted text-center">
              © 2026 Moneypik. Todos los derechos reservados.
            </Text>
            <Text className="text-xs text-muted text-center">
              Versión 1.0.0 • Última actualización: 15 de mayo de 2026
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
