import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { router } from "expo-router";

type Post = {
  id: number;
  userId: number;
  type: "photo" | "video";
  mediaUrl: string;
  thumbnailUrl?: string | null;
  description?: string | null;
  likesCount: number;
  isActive: boolean;
  createdAt: Date;
};

function PostCard({ post, currentUserId }: { post: Post; currentUserId?: number }) {
  const colors = useColors();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const likeMutation = trpc.posts.like.useMutation({
    onSuccess: (data) => {
      setLiked(data.liked);
      setLikesCount((prev) => (data.liked ? prev + 1 : Math.max(prev - 1, 0)));
    },
    onError: () => {
      Alert.alert("Error", "No se pudo procesar el like");
    },
  });

  const handleLike = useCallback(() => {
    if (!currentUserId) {
      router.push('/login' as any);
      return;
    }
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    likeMutation.mutate({ postId: post.id, postOwnerId: post.userId });
  }, [currentUserId, post.id, post.userId]);

  const isOwnPost = currentUserId === post.userId;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Media */}
      <Image
        source={{ uri: post.mediaUrl }}
        style={{ width: "100%", aspectRatio: 1, backgroundColor: colors.border }}
        resizeMode="cover"
      />

      {/* Footer */}
      <View style={{ padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          {post.description ? (
            <Text style={{ color: colors.foreground, fontSize: 14, lineHeight: 20 }} numberOfLines={2}>
              {post.description}
            </Text>
          ) : null}
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
            {new Date(post.createdAt).toLocaleDateString("es-MX")}
          </Text>
        </View>

        {/* Like button */}
        {!isOwnPost && (
          <TouchableOpacity
            onPress={handleLike}
            disabled={likeMutation.isPending}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: liked ? "#FEE2E2" : colors.background,
              borderWidth: 1,
              borderColor: liked ? "#EF4444" : colors.border,
            }}
          >
            <IconSymbol
              name={liked ? "heart.fill" : "heart"}
              size={18}
              color={liked ? "#EF4444" : colors.muted}
            />
            <Text style={{ color: liked ? "#EF4444" : colors.muted, fontSize: 13, fontWeight: "600" }}>
              {likesCount}
            </Text>
          </TouchableOpacity>
        )}

        {isOwnPost && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <IconSymbol name="heart.fill" size={16} color="#EF4444" />
            <Text style={{ color: colors.muted, fontSize: 13, fontWeight: "600" }}>{likesCount}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const { data: posts, isLoading, refetch } = trpc.posts.feed.useQuery({ limit: 20, offset: 0 });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconSymbol name="dollarsign.circle.fill" size={18} color="#FFF" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.primary }}>
            Moneypik
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/notifications" as any)}>
          <IconSymbol name="bell.fill" size={24} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Feed */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.muted, marginTop: 12 }}>Cargando contenido...</Text>
        </View>
      ) : (
        <FlatList
          data={posts ?? []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard post={item as Post} currentUserId={user?.id} />
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 80, paddingHorizontal: 32 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <IconSymbol name="photo.fill" size={36} color={colors.muted} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 8 }}>
                Sin publicaciones aún
              </Text>
              <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 22 }}>
                Sé el primero en subir contenido y empieza a ganar créditos con cada like.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/upload" as any)}
                style={{
                  marginTop: 24,
                  backgroundColor: colors.primary,
                  paddingHorizontal: 28,
                  paddingVertical: 12,
                  borderRadius: 24,
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 15 }}>Subir contenido</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}
