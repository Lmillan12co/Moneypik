# Moneypik — Diseño de Interfaz Móvil

## Concepto
Plataforma de monetización de contenido digital: los usuarios suben fotos y videos, reciben likes de otros usuarios, y convierten esos likes en créditos que pueden retirar como dinero real a través de MercadoPago.

---

## Paleta de Colores

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| `primary` | `#7C3AED` | `#A78BFA` | Botones principales, acentos |
| `secondary` | `#F59E0B` | `#FBBF24` | Créditos, monedas, ganancias |
| `background` | `#FAFAFA` | `#0F0F0F` | Fondo principal |
| `surface` | `#FFFFFF` | `#1A1A1A` | Cards, modales |
| `foreground` | `#111827` | `#F9FAFB` | Texto principal |
| `muted` | `#6B7280` | `#9CA3AF` | Texto secundario |
| `border` | `#E5E7EB` | `#2D2D2D` | Bordes |
| `success` | `#10B981` | `#34D399` | Confirmaciones, retiros exitosos |
| `error` | `#EF4444` | `#F87171` | Errores, rechazos |

---

## Pantallas

### 1. Splash / Onboarding
- Logo animado Moneypik
- 3 slides de onboarding: "Sube tu contenido", "Recibe likes", "Gana dinero"
- Botón "Comenzar" → Registro

### 2. Autenticación
- **Login**: email + contraseña, botón "Entrar", link "¿No tienes cuenta?"
- **Registro**: nombre, email, contraseña, confirmación, teléfono
- **Recuperar contraseña**: email para reset

### 3. Home / Feed (Tab 1)
- Header con logo + saldo de créditos del usuario
- Feed vertical de fotos/videos con scroll infinito
- Cada card: imagen/video, nombre del creador, contador de likes, botón ❤️ like
- FAB (botón flotante) para subir contenido
- Pull-to-refresh

### 4. Subir Contenido
- Seleccionar foto o video desde galería o cámara
- Vista previa del contenido
- Campo de descripción (máx 200 chars)
- Botón "Publicar"

### 5. Mis Ganancias / Wallet (Tab 2)
- Balance total en créditos y equivalente en USD/MXN
- Tarjeta de resumen: likes recibidos hoy, esta semana, total
- Botón "Retirar" → flujo de retiro
- Historial de transacciones (lista)

### 6. Flujo de Retiro
- Monto mínimo: 20 USD
- Seleccionar método: MercadoPago (cuenta o CBU)
- Resumen: monto, tarifa (5%), monto neto
- Confirmar retiro
- Pantalla de éxito/error

### 7. Perfil (Tab 3)
- Avatar, nombre, bio
- Estadísticas: contenidos subidos, likes totales, seguidores
- Grid de contenidos propios
- Botón "Editar perfil"
- Configuración de cuenta

### 8. Explorar / Descubrir (Tab 4)
- Búsqueda de creadores y contenido
- Categorías: Trending, Nuevo, Más likes
- Grid de contenidos populares

### 9. Notificaciones (Tab 5)
- Lista de notificaciones: nuevos likes, retiros procesados, mensajes del sistema
- Badge con contador no leídos

### 10. Configuración
- Datos personales
- Seguridad (cambiar contraseña)
- Métodos de pago vinculados
- Privacidad y moderación
- Cerrar sesión

---

## Flujos de Usuario Principales

### Flujo de Monetización
1. Usuario sube foto/video → aparece en el feed global
2. Otros usuarios dan like → creador recibe 1 crédito por like
3. Creador va a Wallet → ve balance acumulado
4. Solicita retiro (mín. 20 USD) → selecciona MercadoPago
5. Sistema deduce 5% de tarifa → procesa pago
6. Creador recibe dinero en su cuenta MercadoPago

### Flujo de Like
1. Usuario navega el feed
2. Toca ❤️ en una publicación
3. Animación de like + haptic feedback
4. Creador recibe notificación + crédito

### Flujo de Registro
1. Usuario abre app → Onboarding
2. Toca "Comenzar" → pantalla de registro
3. Completa formulario → verificación de email
4. Accede al feed principal

---

## Iconografía (SF Symbols / Material Icons)

| Pantalla | Icono SF | Material |
|----------|----------|----------|
| Home/Feed | `house.fill` | `home` |
| Wallet | `wallet.pass.fill` | `account-balance-wallet` |
| Subir | `plus.circle.fill` | `add-circle` |
| Perfil | `person.fill` | `person` |
| Notificaciones | `bell.fill` | `notifications` |
| Like | `heart.fill` | `favorite` |
| Retiro | `arrow.up.right.circle` | `arrow-upward` |
| Créditos | `dollarsign.circle.fill` | `monetization-on` |

---

## Componentes Clave

- **ContentCard**: Card de contenido con imagen/video, like button, contador
- **CreditBadge**: Muestra créditos/balance con ícono de moneda
- **WithdrawSheet**: Bottom sheet para flujo de retiro
- **TransactionItem**: Fila de historial de transacciones
- **StatCard**: Tarjeta de estadística (likes, créditos, ganancias)
- **AvatarWithBadge**: Avatar del usuario con badge de verificación
