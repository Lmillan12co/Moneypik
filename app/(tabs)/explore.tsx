import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Image } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 1, name: 'Todos', icon: 'star.fill' },
  { id: 2, name: 'Fotografía', icon: 'camera.fill' },
  { id: 3, name: 'Viajes', icon: 'map.fill' },
  { id: 4, name: 'Comida', icon: 'fork.knife' },
  { id: 5, name: 'Moda', icon: 'heart.fill' },
  { id: 6, name: 'Deportes', icon: 'figure.walk' },
];

// Mock data para posts populares
const POPULAR_POSTS = [
  {
    id: 1,
    author: 'Juan Pérez',
    avatar: '👤',
    category: 'Fotografía',
    likes: 1250,
    earnings: 12.50,
    image: '📸',
  },
  {
    id: 2,
    author: 'María García',
    avatar: '👩',
    category: 'Viajes',
    likes: 980,
    earnings: 9.80,
    image: '✈️',
  },
  {
    id: 3,
    author: 'Carlos López',
    avatar: '👨',
    category: 'Comida',
    likes: 2100,
    earnings: 21.00,
    image: '🍕',
  },
  {
    id: 4,
    author: 'Ana Martínez',
    avatar: '👩',
    category: 'Moda',
    likes: 1800,
    earnings: 18.00,
    image: '👗',
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(1);
  const colors = useColors();

  const filteredPosts = POPULAR_POSTS.filter(post =>
    post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              placeholder="Buscar creadores..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-foreground"
            />
          </View>
        </View>

        {/* Categories */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedCategory(item.id)}
              className={cn(
                'px-4 py-2 rounded-full',
                selectedCategory === item.id
                  ? 'bg-primary'
                  : 'bg-surface border border-border'
              )}
            >
              <Text
                className={cn(
                  'font-medium',
                  selectedCategory === item.id
                    ? 'text-background'
                    : 'text-foreground'
                )}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />

        {/* Posts Grid */}
        <FlatList
          data={filteredPosts}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable className="bg-surface rounded-2xl overflow-hidden active:opacity-80">
              {/* Post Image */}
              <View className="h-48 bg-gradient-to-b from-purple-600 to-purple-400 justify-center items-center">
                <Text className="text-6xl">{item.image}</Text>
              </View>

              {/* Post Info */}
              <View className="p-4 gap-3">
                {/* Author */}
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">{item.avatar}</Text>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">{item.author}</Text>
                    <Text className="text-sm text-muted">{item.category}</Text>
                  </View>
                </View>

                {/* Stats */}
                <View className="flex-row justify-between pt-2 border-t border-border">
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Likes</Text>
                    <Text className="text-lg font-bold text-foreground">
                      {item.likes.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Ganancias</Text>
                    <Text className="text-lg font-bold text-primary">
                      ${item.earnings.toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Follow Button */}
                <Pressable className="bg-primary rounded-lg py-2 active:opacity-80">
                  <Text className="text-center text-background font-semibold">
                    Seguir
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          )}
        />

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-muted">No se encontraron creadores</Text>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
