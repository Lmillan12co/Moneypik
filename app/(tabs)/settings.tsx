import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { cn } from '@/lib/utils';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  type: 'toggle' | 'link' | 'info';
  value?: boolean;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [privateProfile, setPrivateProfile] = useState(false);

  const settings: SettingItem[] = [
    {
      id: 'account',
      title: 'Cuenta',
      description: 'Editar perfil, email, contraseña',
      icon: 'person.fill',
      type: 'link',
      onPress: () => console.log('Edit account'),
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Recibir alertas de likes y retiros',
      icon: 'bell.fill',
      type: 'toggle',
      value: notifications,
      onPress: () => setNotifications(!notifications),
    },
    {
      id: 'privacy',
      title: 'Perfil Privado',
      description: 'Solo seguidores pueden ver tu contenido',
      icon: 'lock.fill',
      type: 'toggle',
      value: privateProfile,
      onPress: () => setPrivateProfile(!privateProfile),
    },
    {
      id: 'darkmode',
      title: 'Modo Oscuro',
      description: 'Cambiar tema de la app',
      icon: 'moon.fill',
      type: 'toggle',
      value: darkMode,
      onPress: () => setDarkMode(!darkMode),
    },
    {
      id: 'payment',
      title: 'Método de Pago',
      description: 'Configurar MercadoPago',
      icon: 'creditcard.fill',
      type: 'link',
      onPress: () => console.log('Edit payment method'),
    },
    {
      id: 'privacy-policy',
      title: 'Política de Privacidad',
      description: 'Ver términos y condiciones',
      icon: 'doc.fill',
      type: 'link',
      onPress: () => console.log('View privacy policy'),
    },
    {
      id: 'about',
      title: 'Acerca de Moneypik',
      description: 'Versión 1.0.0',
      icon: 'info.circle.fill',
      type: 'info',
    },
  ];

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-3xl font-bold text-foreground">Configuración</Text>
        </View>

        {/* Settings List */}
        <View className="px-4 gap-2">
          {settings.map((setting, index) => (
            <Pressable
              key={setting.id}
              onPress={setting.onPress}
              className={cn(
                'flex-row items-center justify-between px-4 py-4 rounded-xl',
                'bg-surface active:opacity-80'
              )}
            >
              {/* Left Content */}
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-lg bg-primary/20 justify-center items-center">
                  <IconSymbol
                    name={setting.icon as any}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">
                    {setting.title}
                  </Text>
                  {setting.description && (
                    <Text className="text-xs text-muted mt-1">
                      {setting.description}
                    </Text>
                  )}
                </View>
              </View>

              {/* Right Content */}
              {setting.type === 'toggle' && (
                <Switch
                  value={setting.value || false}
                  onValueChange={setting.onPress}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              )}
              {setting.type === 'link' && (
                <IconSymbol
                  name="chevron.right"
                  size={20}
                  color={colors.muted}
                />
              )}
            </Pressable>
          ))}
        </View>

        {/* Danger Zone */}
        <View className="px-4 mt-8 gap-2">
          <Text className="text-sm font-semibold text-muted px-2 mb-2">
            ZONA DE PELIGRO
          </Text>
          
          <Pressable className="bg-error/10 rounded-xl px-4 py-4 active:opacity-80">
            <Text className="text-error font-semibold text-center">
              Cerrar Sesión
            </Text>
          </Pressable>

          <Pressable className="bg-error/10 rounded-xl px-4 py-4 active:opacity-80">
            <Text className="text-error font-semibold text-center">
              Eliminar Cuenta
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View className="px-4 mt-12 pt-6 border-t border-border">
          <Text className="text-xs text-muted text-center">
            Moneypik v1.0.0
          </Text>
          <Text className="text-xs text-muted text-center mt-2">
            © 2026 Moneypik. Todos los derechos reservados.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
