import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { router } from "expo-router";

function EditProfileModal({ visible, onClose, profile }: {
  visible: boolean; onClose: () => void;
  profile: { username?: string | null; bio?: string | null; mercadoPagoEmail?: string | null };
}) {
  const colors = useColors();
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [mpEmail, setMpEmail] = useState(profile.mercadoPagoEmail ?? "");

  const utils = trpc.useUtils();
  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => {
      utils.profile.get.invalidate();
      onClose();
    },
    onError: (err) => Alert.alert("Error", err.message),
  });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>Editar perfil</Text>
          <TouchableOpacity onPress={onClose}>
            <IconSymbol name="xmark.circle.fill" size={28} color={colors.muted} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
          {[
            { label: "Nombre de usuario", value: username, set: setUsername, placeholder: "@tuusuario", keyboard: "default" as const },
            { label: "Biografía", value: bio, set: setBio, placeholder: "Cuéntanos algo sobre ti...", keyboard: "default" as const, multiline: true },
            { label: "Email de MercadoPago", value: mpEmail, set: setMpEmail, placeholder: "tu@email.com", keyboard: "email-address" as const },
          ].map((field, i) => (
            <View key={i}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>{field.label}</Text>
              <TextInput
                value={field.value}
                onChangeText={field.set}
                placeholder={field.placeholder}
                placeholderTextColor={colors.muted}
                keyboardType={field.keyboard}
                autoCapitalize="none"
                multiline={field.multiline}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 14,
                  color: colors.foreground,
                  fontSize: 15,
                  minHeight: field.multiline ? 80 : undefined,
                  textAlignVertical: field.multiline ? "top" : undefined,
                }}
              />
            </View>
          ))}

          <TouchableOpacity
            onPress={() => updateProfile.mutate({
              username: username || undefined,
              bio: bio || undefined,
              mercadoPagoEmail: mpEmail || undefined,
            })}
            disabled={updateProfile.isPending}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              opacity: updateProfile.isPending ? 0.7 : 1,
            }}
          >
            {updateProfile.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "700" }}>Guardar cambios</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const { user, isAuthenticated, logout } = useAuth();
  const [showEdit, setShowEdit] = useState(false);

  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: myPosts, isLoading: postsLoading } = trpc.posts.myPosts.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: balance } = trpc.wallet.balance.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const utils = trpc.useUtils();
  const uploadAvatar = trpc.profile.uploadAvatar.useMutation({
    onSuccess: () => utils.profile.get.invalidate(),
    onError: (err) => Alert.alert("Error", err.message),
  });
  const deletePost = trpc.posts.delete.useMutation({
    onSuccess: () => utils.posts.myPosts.invalidate(),
    onError: (err) => Alert.alert("Error", err.message),
  });

  const handlePickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      uploadAvatar.mutate({ base64, mimeType: "image/jpeg" });
    }
  };

  const handleDeletePost = (postId: number) => {
    Alert.alert("Eliminar publicación", "¿Estás seguro de que deseas eliminar esta publicación?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deletePost.mutate({ postId }) },
    ]);
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: logout },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={{ paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border, backgroundColor: colors.surface }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>Perfil</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <IconSymbol name="person.fill" size={40} color={colors.muted} />
          </View>
          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, marginBottom: 8 }}>Tu perfil</Text>
          <Text style={{ color: colors.muted, textAlign: "center", lineHeight: 22, marginBottom: 32 }}>
            Inicia sesión para ver tu perfil, publicaciones y estadísticas de monetización
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/login" as any)}
            style={{ backgroundColor: colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 24 }}
          >
            <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 16 }}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const totalLikes = balance?.totalLikesReceived ?? 0;
  const totalCredits = balance?.totalCredits ?? 0;
  const postsCount = myPosts?.length ?? 0;

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border, backgroundColor: colors.surface }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>Perfil</Text>
        <TouchableOpacity onPress={handleLogout}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile header */}
        <View style={{ alignItems: "center", padding: 24, gap: 12 }}>
          {/* Avatar */}
          <TouchableOpacity onPress={handlePickAvatar} style={{ position: "relative" }}>
            {uploadAvatar.isPending ? (
              <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={{ width: 96, height: 96, borderRadius: 48 }} />
            ) : (
              <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 36, fontWeight: "800", color: "#FFF" }}>
                  {(user?.name ?? "U").charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.background }}>
              <IconSymbol name="camera.fill" size={13} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.foreground }}>
              {profile?.username ?? user?.name ?? "Usuario"}
            </Text>
            {profile?.bio && (
              <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 20 }}>
                {profile.bio}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowEdit(true)}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}
          >
            <IconSymbol name="pencil" size={14} color={colors.foreground} />
            <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "600" }}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: "row", borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: colors.border }}>
          {[
            { value: postsCount.toString(), label: "Publicaciones" },
            { value: totalLikes.toString(), label: "Likes recibidos" },
            { value: `$${totalCredits.toFixed(2)}`, label: "Créditos USD" },
          ].map((stat, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 16,
                borderRightWidth: i < 2 ? 0.5 : 0,
                borderColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "800", color: colors.foreground }}>{stat.value}</Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Posts grid */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: 12 }}>
            Mis publicaciones
          </Text>
          {postsLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : myPosts && myPosts.length > 0 ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
              {myPosts.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  onLongPress={() => handleDeletePost(post.id)}
                  style={{ width: "32%", aspectRatio: 1, borderRadius: 8, overflow: "hidden", backgroundColor: colors.border }}
                >
                  <Image source={{ uri: post.mediaUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                  <View style={{ position: "absolute", bottom: 4, left: 4, flexDirection: "row", alignItems: "center", gap: 3 }}>
                    <IconSymbol name="heart.fill" size={12} color="#FFF" />
                    <Text style={{ color: "#FFF", fontSize: 11, fontWeight: "700" }}>{post.likesCount}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={{ alignItems: "center", padding: 32, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
              <IconSymbol name="photo.fill" size={32} color={colors.muted} />
              <Text style={{ color: colors.muted, marginTop: 12, textAlign: "center" }}>
                Aún no tienes publicaciones.{"\n"}¡Sube tu primera foto y empieza a ganar!
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/upload" as any)}
                style={{ marginTop: 16, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 }}
              >
                <Text style={{ color: "#FFF", fontWeight: "700" }}>Subir foto</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {profile && (
        <EditProfileModal
          visible={showEdit}
          onClose={() => setShowEdit(false)}
          profile={profile}
        />
      )}
    </ScreenContainer>
  );
}
