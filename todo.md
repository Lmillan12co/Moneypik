# Moneypik - TODO

## Diseño y Configuración
- [x] Crear design.md con plan de interfaz
- [x] Generar logo e icono de la app
- [x] Configurar paleta de colores (tema violeta #7C3AED / dorado #F59E0B)
- [x] Configurar navegación por tabs (4 tabs: Inicio, Subir, Wallet, Perfil)
- [x] Configurar íconos en icon-symbol.tsx

## Autenticación y Perfil
- [x] Pantalla de login con OAuth (Manus)
- [x] Pantalla de perfil de usuario con estadísticas
- [x] Pantalla de editar perfil (username, bio, email MercadoPago)
- [x] Subida de avatar desde galería
- [ ] Pantalla de onboarding (3 slides) - pendiente
- [ ] Pantalla de registro separada - no requerida (OAuth)

## Feed y Contenido
- [x] Pantalla de feed principal (Home) con FlatList
- [x] PostCard: card de foto con like button
- [x] Pantalla de subir contenido (foto desde galería o cámara)
- [ ] Pantalla de detalle de publicación - pendiente
- [ ] Pantalla de explorar/descubrir - pendiente

## Monetización
- [x] Pantalla de Wallet con balance, estadísticas y retiros
- [x] Sistema de likes → créditos ($0.01 USD por like)
- [x] Flujo de retiro con MercadoPago (mínimo $20 USD, tarifa 5%)
- [x] Historial de transacciones
- [x] Modal de retiro con resumen de comisiones

## Notificaciones y Ajustes
- [x] Pantalla de notificaciones con tipos (like, retiro, sistema)
- [x] Badge de notificaciones no leídas en tab de Perfil
- [x] Marcar notificaciones como leídas
- [ ] Pantalla de configuración general - pendiente

## Backend / Base de Datos
- [x] Esquema de base de datos (users, profiles, posts, likes, transactions, notifications)
- [x] Migraciones aplicadas correctamente
- [x] API tRPC: perfil (get, update, uploadAvatar)
- [x] API tRPC: posts (feed, myPosts, create, delete, like)
- [x] API tRPC: wallet (balance, transactions, withdraw)
- [x] API tRPC: notifications (list, unreadCount, markRead, markAllRead)

## Branding
- [x] Logo generado y configurado
- [x] Splash screen actualizado
- [x] app.config.ts actualizado con nombre "Moneypik" y logo

## Publicación en Google Play Store
- [ ] Política de privacidad
- [ ] Términos de uso
- [ ] Ficha de tienda (descripción corta, larga, categoría, palabras clave)
- [ ] Capturas de pantalla para Play Store (1080x1920px)
- [ ] Gráfico de función (Feature Graphic 1024x500px)
- [ ] Guía paso a paso de publicación
