# Guía de Publicación en Google Play Store — Moneypik

**Fecha:** Mayo 2026  
**Versión de la app:** 1.0.0

---

## Resumen del proceso

Publicar una aplicación en Google Play Store requiere completar cuatro etapas principales: generar el archivo de instalación (APK/AAB), crear la cuenta de desarrollador, configurar la ficha de la tienda y enviar la app a revisión. Este proceso toma entre 3 y 7 días hábiles en total, siendo la mayor parte del tiempo la revisión de Google.

| Etapa | Tiempo estimado | Costo |
|-------|----------------|-------|
| Generar APK/AAB desde Manus | 10-30 minutos | Gratis |
| Crear cuenta de desarrollador | 15 minutos | $25 USD (único) |
| Configurar ficha en Play Console | 30-60 minutos | Gratis |
| Revisión de Google | 1-7 días hábiles | Gratis |

---

## Paso 1: Generar el APK desde Manus

El archivo de instalación de Moneypik se genera directamente desde la plataforma Manus, sin necesidad de configurar entornos de desarrollo locales.

**Cómo hacerlo:**

Abre el proyecto Moneypik en Manus y localiza el botón **"Publish"** (Publicar) en la esquina superior derecha del panel de administración. Este botón estará habilitado porque el proyecto tiene un checkpoint guardado. Al hacer clic, Manus iniciará automáticamente el proceso de compilación y generará el archivo `.apk` para Android. Una vez completado, podrás descargarlo directamente desde la interfaz.

> **Importante:** No intentes compilar el APK manualmente desde la terminal del sandbox. El proceso de compilación de React Native/Expo consume muchos recursos y puede causar errores. Siempre usa el botón Publish de Manus.

---

## Paso 2: Crear una cuenta de Google Play Developer

Si aún no tienes una cuenta de desarrollador, sigue estos pasos:

Visita [play.google.com/console](https://play.google.com/console) e inicia sesión con tu cuenta de Google. Acepta el Acuerdo de Distribución del Desarrollador de Google Play y paga la tarifa de registro única de **$25 USD** con tarjeta de crédito o débito. La cuenta queda activa inmediatamente después del pago.

> **Nota:** Una sola cuenta de desarrollador puede publicar múltiples aplicaciones. Si ya tienes una cuenta, puedes saltar este paso.

---

## Paso 3: Crear la aplicación en Play Console

Una vez dentro de [play.google.com/console](https://play.google.com/console):

Haz clic en **"Crear app"** en la esquina superior derecha. Completa el formulario inicial con los siguientes datos:

| Campo | Valor |
|-------|-------|
| Nombre de la app | Moneypik - Monetiza tu Contenido |
| Idioma predeterminado | Español (Latinoamérica) — es-419 |
| Tipo de app | App (no juego) |
| Gratuita o de pago | Gratuita |

Acepta las declaraciones de política y haz clic en **"Crear app"**.

---

## Paso 4: Completar la ficha de la tienda

En el menú lateral izquierdo, navega a **"Presencia en Play Store" → "Ficha de Play Store principal"**.

### 4.1 Descripción de la app

Copia el texto del archivo `ficha-play-store.md` incluido en esta carpeta:

- **Nombre de la app:** `Moneypik - Monetiza tu Contenido`
- **Descripción corta:** `Sube fotos, recibe likes y convierte tu contenido en dinero real.`
- **Descripción larga:** Copia el texto completo de la sección correspondiente en `ficha-play-store.md`

### 4.2 Assets gráficos

Sube los siguientes archivos incluidos en esta carpeta `playstore-assets/`:

| Archivo | Tipo en Play Console | Dimensiones requeridas |
|---------|---------------------|----------------------|
| `feature-graphic.png` | Gráfico de función | 1024 × 500 px |
| `screenshot-1-feed.png` | Captura de pantalla | Mínimo 320 px de ancho |
| `screenshot-2-wallet.png` | Captura de pantalla | Mínimo 320 px de ancho |
| `screenshot-3-profile.png` | Captura de pantalla | Mínimo 320 px de ancho |
| `screenshot-4-withdraw.png` | Captura de pantalla | Mínimo 320 px de ancho |

Para el **icono de la app**, usa el archivo `assets/images/icon.png` del proyecto (512 × 512 px, fondo transparente o sólido).

### 4.3 Categorización

Navega a **"Presencia en Play Store" → "Categoría de la app"** y selecciona:

- **Categoría:** Finanzas
- **Tags:** Puedes agregar hasta 5 etiquetas. Usa: `Ganar dinero`, `Creadores de contenido`, `Monetización`, `Pagos`, `Red social`

### 4.4 Información de contacto

En la sección de detalles del desarrollador, ingresa:

- **Email:** soporte@moneypik.app
- **Sitio web:** https://moneypik.app
- **Política de privacidad:** https://moneypik.app/privacidad

> **Acción requerida:** Antes de enviar la app, debes publicar la política de privacidad en una URL pública. La forma más rápida es crear una página en [sites.google.com](https://sites.google.com) o [notion.so](https://notion.so) y copiar el contenido del archivo `politica-de-privacidad.md`.

---

## Paso 5: Configurar la seguridad de datos

En el menú lateral, navega a **"Contenido de la app" → "Seguridad de los datos"**. Este formulario es obligatorio y describe qué datos recopila la app.

Completa el formulario declarando que la app recopila: dirección de email (para autenticación y pagos), fotos y videos (contenido subido por el usuario), y datos de actividad (likes, transacciones). Indica que los datos se cifran en tránsito y que el usuario puede solicitar la eliminación de sus datos contactando a privacidad@moneypik.app.

---

## Paso 6: Clasificación de contenido (IARC)

Navega a **"Contenido de la app" → "Clasificación de contenido"** y completa el cuestionario IARC. Responde las preguntas según las indicaciones del archivo `ficha-play-store.md`. La clasificación resultante será probablemente **+18** por las funcionalidades financieras.

---

## Paso 7: Configurar el precio y distribución

Navega a **"Distribución" → "Países y regiones"**. Selecciona los países donde deseas distribuir la app. Para comenzar, se recomienda seleccionar todos los países de Latinoamérica donde MercadoPago opera: México, Argentina, Colombia, Chile, Perú, Uruguay, Bolivia, Paraguay y Ecuador.

En **"Monetización" → "Precios"**, confirma que la app es **gratuita**.

---

## Paso 8: Subir el APK/AAB

Navega a **"Versiones" → "Producción"** (o "Prueba interna" si deseas probar primero con un grupo reducido).

Haz clic en **"Crear nueva versión"** y sube el archivo `.apk` o `.aab` descargado desde Manus en el Paso 1. Completa las notas de la versión:

```
Versión 1.0.0 — Lanzamiento inicial

• Feed de publicaciones con sistema de likes
• Wallet con balance en USD y retiros via MercadoPago
• Perfil de creador personalizable
• Notificaciones en tiempo real
• Sistema de monetización: $0.01 USD por like recibido
```

Haz clic en **"Guardar"** y luego en **"Revisar versión"**.

---

## Paso 9: Enviar a revisión

Una vez completados todos los pasos anteriores, el botón **"Enviar a revisión"** estará activo. Haz clic en él para enviar Moneypik a Google para su revisión.

Google revisará la app en un plazo de **1 a 7 días hábiles**. Recibirás un email de confirmación cuando la app sea aprobada y esté disponible en la tienda.

---

## Posibles rechazos y cómo evitarlos

Google puede rechazar la app por las siguientes razones comunes. Aquí se describe cómo prevenirlas:

| Motivo de rechazo | Cómo prevenirlo |
|-------------------|----------------|
| Política de privacidad no disponible | Publicar la política en una URL pública antes de enviar |
| Declaración de seguridad de datos incompleta | Completar todos los campos del formulario IARC |
| Permisos no justificados | La app solo solicita cámara y galería, que están justificados por la función de subida de contenido |
| Contenido financiero sin declaración | Declarar en el formulario que la app procesa transacciones financieras reales |
| Contenido generado por usuarios sin moderación | Mencionar en la descripción que los usuarios pueden reportar contenido inapropiado |

---

## Después de la publicación

Una vez aprobada la app, se recomienda:

Monitorear las reseñas y calificaciones en Play Console y responder a los comentarios de los usuarios. Configurar alertas de crashes en **Android Vitals** para detectar errores técnicos rápidamente. Publicar actualizaciones periódicas con mejoras y nuevas funcionalidades para mantener un buen posicionamiento en la tienda.

---

## Recursos útiles

- [Google Play Console](https://play.google.com/console) — Panel de administración de la tienda
- [Políticas del programa para desarrolladores de Google Play](https://play.google.com/about/developer-content-policy/) — Reglas que debe cumplir la app
- [Centro de ayuda de Google Play](https://support.google.com/googleplay/android-developer) — Soporte oficial
- [Documentación de Expo sobre publicación en Play Store](https://docs.expo.dev/distribution/app-stores/) — Guía técnica de Expo
