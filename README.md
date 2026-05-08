# Moneypik 💰

**Plataforma de monetización de contenido digital para creadores latinoamericanos.**

Moneypik permite a los creadores subir fotos y videos, recibir likes de la comunidad y convertir esas interacciones en dinero real a través de MercadoPago. Cada like recibido equivale a **$0.01 USD** en el wallet del creador.

---

## Capturas de pantalla

| Feed | Wallet | Perfil | Retiro |
|------|--------|--------|--------|
| ![Feed](https://d2xsxph8kpxj0f.cloudfront.net/310519663639924158/6Pxxi6WdRASeN2u49QBKnM/screenshot-1-feed-JzSWa3VTZxicDHbSbitCwb.png) | ![Wallet](https://d2xsxph8kpxj0f.cloudfront.net/310519663639924158/6Pxxi6WdRASeN2u49QBKnM/screenshot-2-wallet-dybdUckVwVnTvhTCfB2zi6.png) | ![Perfil](https://d2xsxph8kpxj0f.cloudfront.net/310519663639924158/6Pxxi6WdRASeN2u49QBKnM/screenshot-3-profile-NxQjsSjWzVVGTFwu9QGCxJ.png) | ![Retiro](https://d2xsxph8kpxj0f.cloudfront.net/310519663639924158/6Pxxi6WdRASeN2u49QBKnM/screenshot-4-withdraw-GWSkanHJu3oinsJgi4iyw7.png) |

---

## Características principales

- **Feed de publicaciones** con sistema de likes en tiempo real
- **Wallet integrada** con balance en USD e historial de transacciones
- **Sistema de monetización**: $0.01 USD por cada like recibido
- **Retiros via MercadoPago** (mínimo $20 USD, tarifa del 5%)
- **Perfil personalizable** con foto, username y biografía
- **Subida de contenido** desde galería o cámara
- **Notificaciones** en tiempo real de likes y retiros
- **Autenticación OAuth** segura

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Mobile | React Native + Expo SDK 54 |
| Lenguaje | TypeScript |
| Estilos | NativeWind (Tailwind CSS) |
| Navegación | Expo Router 6 |
| API | tRPC + Express |
| Base de datos | MySQL + Drizzle ORM |
| Almacenamiento | S3-compatible |
| Pagos | MercadoPago API |
| Auth | OAuth (JWT + cookies) |

---

## Estructura del proyecto

```
moneypik/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        ← Feed principal
│   │   ├── upload.tsx       ← Subir contenido
│   │   ├── wallet.tsx       ← Wallet y retiros
│   │   └── profile.tsx      ← Perfil del usuario
│   ├── login.tsx            ← Pantalla de login
│   ├── notifications.tsx    ← Notificaciones
│   └── _layout.tsx          ← Layout raíz
├── server/
│   ├── routers.ts           ← Endpoints tRPC
│   ├── db.ts                ← Funciones de base de datos
│   └── _core/               ← Auth, storage, DB core
├── drizzle/
│   └── schema.ts            ← Esquema de base de datos
├── components/              ← Componentes reutilizables
├── hooks/                   ← Custom hooks
├── playstore-assets/        ← Materiales para Play Store
└── assets/                  ← Imágenes y fuentes
```

---

## Instalación y desarrollo

### Requisitos previos

- Node.js 18+
- pnpm 9+
- Expo Go (en tu dispositivo móvil) o un emulador Android/iOS

### Configuración

```bash
# Clonar el repositorio
git clone https://github.com/Lmillan12co/Moneypik.git
cd Moneypik

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de base de datos y MercadoPago

# Aplicar migraciones de base de datos
pnpm db:push

# Iniciar el servidor de desarrollo
pnpm dev
```

### Variables de entorno requeridas

```env
# Base de datos MySQL
DATABASE_URL=mysql://usuario:contraseña@host:3306/moneypik

# MercadoPago (para retiros)
MERCADOPAGO_ACCESS_TOKEN=tu_access_token

# JWT Secret
JWT_SECRET=tu_secreto_seguro
```

---

## Sistema de monetización

El flujo de monetización funciona de la siguiente manera:

1. El creador sube una foto o video a la plataforma
2. Otros usuarios pueden dar like al contenido
3. Cada like recibido genera **$0.01 USD** en el wallet del creador
4. Cuando el saldo alcanza **$20.00 USD**, el creador puede solicitar un retiro
5. El retiro se procesa via **MercadoPago** con una tarifa de servicio del **5%**
6. El dinero llega a la cuenta de MercadoPago del creador en 1-3 días hábiles

---

## Publicación en Play Store

Todos los materiales necesarios para publicar en Google Play Store están en la carpeta `playstore-assets/`:

- `politica-de-privacidad.md` — Política de privacidad lista para publicar
- `terminos-de-uso.md` — Términos de uso completos
- `ficha-play-store.md` — Nombre, descripción, palabras clave y clasificación IARC
- `guia-publicacion-play-store.md` — Guía paso a paso de publicación

---

## Licencia

Este proyecto es privado y de uso exclusivo del propietario. Todos los derechos reservados © 2026 Moneypik.
