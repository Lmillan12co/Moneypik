import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function UploadScreen() {
  const colors = useColors();
  const { user, isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const utils = trpc.useUtils();
  const createPost = trpc.posts.create.useMutation({
    onSuccess: () => {
      utils.posts.feed.invalidate();
      utils.posts.myPosts.invalidate();
      setSelectedImage(null);
      setDescription("");
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert("¡Publicado!", "Tu contenido ya está en el feed. ¡Empieza a recibir likes!", [
        { text: "Ver feed", onPress: () => router.push("/(tabs)") },
        { text: "Subir más", style: "cancel" },
      ]);
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "No se pudo publicar el contenido");
    },
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería para subir fotos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu cámara.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePublish = async () => {
    if (!isAuthenticated) {
      Alert.alert("Inicia sesión", "Debes iniciar sesión para publicar contenido.");
      return;
    }
    if (!selectedImage) {
      Alert.alert("Selecciona una imagen", "Elige una foto para publicar.");
      return;
    }
    setIsUploading(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(selectedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await createPost.mutateAsync({
        type: "photo",
        base64,
        mimeType: "image/jpeg",
        description: description.trim() || undefined,
      });
    } catch (err) {
      // Error handled in onError
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>
          Subir contenido
        </Text>
        {selectedImage && (
          <TouchableOpacity
            onPress={handlePublish}
            disabled={isUploading}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 18,
              paddingVertical: 8,
              borderRadius: 20,
              opacity: isUploading ? 0.6 : 1,
            }}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 14 }}>Publicar</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* Image picker area */}
        {selectedImage ? (
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", aspectRatio: 1, borderRadius: 16, backgroundColor: colors.border }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "rgba(0,0,0,0.6)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol name="xmark" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, marginBottom: 12 }}>
              Selecciona tu foto
            </Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.surface,
                  gap: 8,
                }}
              >
                <IconSymbol name="photo.fill" size={32} color={colors.primary} />
                <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 13 }}>Galería</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={takePhoto}
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: colors.secondary,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.surface,
                  gap: 8,
                }}
              >
                <IconSymbol name="camera.fill" size={32} color={colors.secondary} />
                <Text style={{ color: colors.secondary, fontWeight: "600", fontSize: 13 }}>Cámara</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Description */}
        <View>
          <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
            Descripción (opcional)
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Escribe algo sobre tu foto..."
            placeholderTextColor={colors.muted}
            multiline
            maxLength={200}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 14,
              color: colors.foreground,
              fontSize: 15,
              minHeight: 100,
              textAlignVertical: "top",
            }}
          />
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, textAlign: "right" }}>
            {description.length}/200
          </Text>
        </View>

        {/* Info card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#FEF3C7",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol name="dollarsign.circle.fill" size={20} color={colors.secondary} />
            </View>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>
              ¿Cómo gano dinero?
            </Text>
          </View>
          <View style={{ gap: 8 }}>
            {[
              { icon: "heart.fill" as const, color: "#EF4444", text: "Cada like que recibas = $0.01 USD" },
              { icon: "wallet.pass.fill" as const, color: colors.primary, text: "Acumula créditos en tu wallet" },
              { icon: "banknote.fill" as const, color: "#10B981", text: "Retira desde $20 USD a MercadoPago" },
            ].map((item, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <IconSymbol name={item.icon} size={16} color={item.color} />
                <Text style={{ color: colors.muted, fontSize: 13, flex: 1 }}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Login prompt */}
        {!isAuthenticated && (
          <View
            style={{
              backgroundColor: "#EDE9FE",
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              gap: 10,
            }}
          >
            <IconSymbol name="lock.fill" size={24} color={colors.primary} />
            <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 15, textAlign: "center" }}>
              Inicia sesión para publicar
            </Text>
            <Text style={{ color: colors.muted, fontSize: 13, textAlign: "center" }}>
              Crea una cuenta gratuita y empieza a monetizar tu contenido
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/login" as any)}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "700" }}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
