import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: 'Bienvenido a Moneypik',
    description: 'Convierte tu contenido en dinero real. Sube fotos y videos, recibe likes y gana dinero.',
    icon: '📱',
    color: 'from-purple-600 to-purple-400',
  },
  {
    id: 2,
    title: 'Gana con cada Like',
    description: 'Cada like que recibes vale $0.01 USD. Cuanto mejor sea tu contenido, más dinero ganas.',
    icon: '❤️',
    color: 'from-pink-600 to-pink-400',
  },
  {
    id: 3,
    title: 'Retira tu Dinero',
    description: 'Cuando acumules $20 USD, retira directo a tu MercadoPago. Sin complicaciones.',
    icon: '💸',
    color: 'from-yellow-600 to-yellow-400',
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const colors = useColors();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Completar onboarding y ir a home
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const slide = SLIDES[currentSlide];

  return (
    <ScreenContainer className="flex-1 bg-background">
      <View className="flex-1 justify-between">
        {/* Slide Content */}
        <View className="flex-1 justify-center items-center px-6 py-12">
          {/* Icon */}
          <Text className="text-8xl mb-8">{slide.icon}</Text>

          {/* Title */}
          <Text className="text-3xl font-bold text-foreground text-center mb-4">
            {slide.title}
          </Text>

          {/* Description */}
          <Text className="text-lg text-muted text-center leading-relaxed">
            {slide.description}
          </Text>
        </View>

        {/* Indicators */}
        <View className="flex-row justify-center gap-2 mb-8">
          {SLIDES.map((_, index) => (
            <View
              key={index}
              className={cn(
                'h-2 rounded-full transition-all',
                index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-border'
              )}
            />
          ))}
        </View>

        {/* Buttons */}
        <View className="gap-4 px-6 pb-8">
          <Pressable
            onPress={handleNext}
            className="bg-primary rounded-full py-4 active:opacity-80"
          >
            <Text className="text-center text-white font-semibold text-lg">
              {currentSlide === SLIDES.length - 1 ? 'Empezar' : 'Siguiente'}
            </Text>
          </Pressable>

          {currentSlide < SLIDES.length - 1 && (
            <Pressable
              onPress={handleSkip}
              className="py-3 active:opacity-60"
            >
              <Text className="text-center text-muted font-medium">
                Saltar
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
