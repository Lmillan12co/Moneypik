import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';

// Filtros por tipo de contenido real (la app no tiene categorías).
const TYPE_FILTERS = [
  { id: 'all', name: 'Todos' },
  { id: 'photo', name: 'Fotos' },
  { id: 'video', name: 'Videos' },
] as const;

const CREDIT_PER_LIKE = 0.01;

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<(typeof TYPE_FILTERS)[number]['id']>('all');
  const colors = useColors();

  // Datos reales del feed: nada de publicaciones de muestra.
  const { data: posts, isLoading } = trpc.posts.feed.useQuery({ limit: 50, offset: 0 });

  const query = searchQuery.trim().toLowerCase();
  const filteredPosts = (posts ?? []).filter((post) => {
    if (selectedType !== 'all' && post.type !== selectedType) return false;
    if (!query) return true;
    return (post.description ?? '').toLowerCase().includes(query);
  });

  return (
    <ScreenContainer className="flex-1">
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 gap-4">
          <Text className="text-3xl font-bold text-foreground">Explorar</Text>

          {/* Search Bar */}
          <View className="flex-row items-center bg-surface rounded-full px-4 py-3 gap-2">
            <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            <TextInput
              placeholder="Buscar publicaciones..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-foreground"
            />
          </View>
        </View>

        {/* Type filter */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TYPE_FILTERS}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedType(item.id)}
              className={cn(
                'px-4 py-2 rounded-full',
                selectedType === item.id
                  ? 'bg-primary'
                  : 'bg-surface border border-border'
              )}
            >
              <Text
                className={cn(
                  'font-medium',
                  selectedType === item.id
                    ? 'text-background'
                    : 'text-foreground'
                )}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />

        {/* Posts Grid (datos reales) */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-muted mt-3">Cargando publicaciones...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View className="bg-surface rounded-2xl overflow-hidden">
                {/* Post Image */}
                <Image
                  source={{ uri: item.thumbnailUrl ?? item.mediaUrl }}
                  style={{ width: '100%', height: 192, backgroundColor: colors.border }}
                  resizeMode="cover"
                />
                {item.type === 'video' ? (
                  <View className="absolute top-3 right-3 bg-black/60 rounded-full px-3 py-1">
                    <Text className="text-white text-xs font-semibold">Video</Text>
                  </View>
                ) : null}

                {/* Post Info */}
                <View className="p-4 gap-3">
                  {item.description ? (
                    <Text className="text-foreground" numberOfLines={2}>{item.description}</Text>
                  ) : null}
                  <Text className="text-sm text-muted">
                    {new Date(item.createdAt).toLocaleDateString('es-MX')}
                  </Text>

                  {/* Stats (reales: likes del post, ganancias = likes x $0.01) */}
                  <View className="flex-row justify-between pt-2 border-t border-border">
                    <View className="flex-1">
                      <Text className="text-xs text-muted">Likes</Text>
                      <Text className="text-lg font-bold text-foreground">
                        {item.likesCount.toLocaleString()}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-muted">Ganancias</Text>
                      <Text className="text-lg font-bold text-primary">
                        ${(item.likesCount * CREDIT_PER_LIKE).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-16">
                <Text className="text-lg text-muted text-center">
                  {query || selectedType !== 'all'
                    ? 'No se encontraron publicaciones'
                    : 'Aún no hay publicaciones para explorar'}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}
