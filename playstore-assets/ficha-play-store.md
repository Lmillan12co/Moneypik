# Ficha de Google Play Store — Moneypik

Este documento contiene todo el texto listo para copiar y pegar en la consola de Google Play al crear la ficha de la aplicación.

> **Corrección del 24 nov 2026:** se quitaron dos afirmaciones engañosas de la versión anterior: el supuesto "cifrado de extremo a extremo" (la app usa TLS; no hay cifrado de extremo a extremo) y los retiros "con solo unos toques" (los retiros son manuales y tardan 1 a 3 días hábiles). La nota de moderación ahora describe el mecanismo real (reportar y bloquear dentro de la app). No copiar la versión anterior de este archivo.

---

## Información básica de la app

| Campo | Valor |
|-------|-------|
| **Nombre de la app** | Moneypik |
| **Categoría** | Finanzas |
| **Subcategoría** | Herramientas financieras personales |
| **Clasificación de contenido** | Para mayores de 18 años |
| **Precio** | Gratis |
| **Países de distribución** | México, Argentina, Colombia, Chile, Perú, Uruguay, Bolivia, Paraguay, Ecuador, Venezuela (y todos los países con MercadoPago) |
| **Idioma principal** | Español (es-419) |

---

## Nombre de la app (máx. 50 caracteres)

```
Moneypik - Monetiza tu Contenido
```

---

## Descripción corta (máx. 80 caracteres)

```
Sube fotos, recibe likes y convierte tu contenido en dinero real.
```

---

## Descripción larga (máx. 4000 caracteres)

```
¿Tienes talento para crear contenido? Con Moneypik puedes convertir tu creatividad en ingresos reales, de forma simple y directa.

🎯 ¿CÓMO FUNCIONA?

Sube tus mejores fotos y videos, compártelos con la comunidad y cada like que recibas se convierte automáticamente en $0.01 USD en tu wallet. Cuando acumules $20 o más, puedes retirar tu dinero directamente a tu cuenta de MercadoPago.

💰 TU CONTENIDO VALE DINERO

En Moneypik, cada interacción cuenta. No necesitas miles de seguidores para empezar a ganar: cualquier creador puede monetizar su contenido desde el primer día. Cuanto más original y atractivo sea tu contenido, más likes recibirás y más rápido crecerá tu saldo.

📱 CARACTERÍSTICAS PRINCIPALES

✅ Feed de contenido: Descubre publicaciones de otros creadores y apoya su trabajo con likes
✅ Subida fácil: Sube fotos desde tu galería o toma una directamente con la cámara
✅ Wallet integrada: Visualiza tu saldo en USD, historial de ganancias y estadísticas en tiempo real
✅ Retiros a MercadoPago: Solicita tu retiro desde la wallet cuando tengas $20 USD o más; el pago se procesa manualmente en 1 a 3 días hábiles
✅ Notificaciones: Recibe alertas instantáneas cuando alguien le da like a tu contenido
✅ Perfil personalizable: Crea tu identidad como creador con foto, nombre de usuario y biografía
✅ Reportar y bloquear: Si ves contenido inapropiado, repórtalo desde la publicación o bloquea al usuario

💸 SISTEMA DE MONETIZACIÓN TRANSPARENTE

- 1 like recibido = $0.01 USD en tu wallet
- Retiro mínimo: $20.00 USD
- Tarifa de servicio: solo 5% sobre el monto retirado
- Procesamiento en 1 a 3 días hábiles (manual, a través de MercadoPago)
- Sin suscripciones ni costos ocultos

🔒 SEGURO Y CONFIABLE

Tu información viaja cifrada (TLS/HTTPS) y se guarda en servidores seguros. Los retiros se procesan exclusivamente a través de MercadoPago, la plataforma de pagos más confiable de Latinoamérica.

📊 PARA CREADORES DE TODO TIPO

Ya seas fotógrafo, artista, cocinero, deportista o simplemente alguien con historias interesantes que contar, Moneypik es la plataforma para ti. No importa tu nicho: si tu contenido conecta con las personas, puedes ganar dinero con él.

🚀 EMPIEZA HOY

Crear tu cuenta es gratis y toma menos de un minuto. Sube tu primera foto, empieza a recibir likes y ve cómo tu saldo crece día a día.

---

Moneypik es para mayores de 18 años. Los retiros requieren una cuenta activa de MercadoPago. Las ganancias pueden variar según la calidad y frecuencia del contenido publicado.
```

---

## Palabras clave / Tags sugeridos

```
ganar dinero, monetizar contenido, creadores de contenido, ingresos pasivos, mercadopago, fotos, likes, wallet, retiros, dinero online, app de ganancias, contenido digital, fotografia, red social, monetizacion
```

---

## URL de la Política de Privacidad

```
https://lmillan12co.github.io/Moneypik/privacidad/
```

> **Nota:** Debes publicar la política de privacidad en una URL pública antes de enviar la app a revisión. El texto corregido está en `playstore-assets/politica-de-privacidad.md`. Opciones: publicarla con la web de la app (Expo web, salida estática) en un hosting gratuito, o en GitHub Pages desde el repo. La URL que se pegue en Play Console debe ser la real y debe abrir.

## URL de borrado de cuenta (para Play Console)

```
https://lmillan12co.github.io/Moneypik/eliminar-cuenta/
```

> Es la página nueva `app/web/eliminar-cuenta.tsx`. Debe publicarse en el mismo hosting que la política de privacidad. Sin esta URL, Play no acepta el envío.

---

## Email de contacto del desarrollador

```
soporte@moneypik.app
```

> **Verificar:** confirmar que el dominio moneypik.app existe y que los correos privacidad@moneypik.app y soporte@moneypik.app funcionan. Si no, cambiar el contacto por un email que Laura controle y actualizar la política, la ficha y la app.

---

## Sitio web del desarrollador

```
https://lmillan12co.github.io/Moneypik/
```

---

## Clasificación de contenido — Cuestionario IARC

Al completar el cuestionario de clasificación de contenido en Play Console, selecciona las siguientes opciones:

| Pregunta | Respuesta |
|----------|-----------|
| ¿Contiene violencia? | No |
| ¿Contiene lenguaje inapropiado? | No |
| ¿Contiene contenido sexual? | No |
| ¿Permite contenido generado por usuarios? | **Sí** |
| ¿Incluye compras dentro de la app? | No |
| ¿Comparte ubicación del usuario? | No |
| ¿Incluye funcionalidades de redes sociales? | **Sí** |
| ¿Incluye transacciones financieras reales? | **Sí** |

La clasificación resultante será probablemente **+18** o **+16** por las funcionalidades financieras y el contenido generado por usuarios.

---

## Declaración de permisos (para la sección de seguridad de datos)

En la sección **"Seguridad de los datos"** de Play Console, declara lo siguiente:

| Tipo de dato | Recopilado | Compartido | Propósito |
|-------------|------------|------------|-----------|
| Nombre | Sí | No | Funcionalidad de la app |
| Dirección de email | Sí | Con MercadoPago (solo para retiros) | Funcionalidad de la app |
| Fotos y videos | Sí (subidos por el usuario) | No | Funcionalidad de la app |
| Actividad en la app (likes, publicaciones) | Sí | No | Analytics, funcionalidad |
| Información financiera (email de pago) | Sí | Con procesador de pagos | Procesamiento de pagos |

Marca que los datos se cifran en tránsito y que el usuario puede solicitar la eliminación de sus datos (en la app y por el enlace web). No declares cifrado de extremo a extremo: la app usa TLS, no E2EE.

---

## Notas para la revisión de Google Play

Si Google solicita información adicional durante la revisión, ten preparado:

1. **Demostración del flujo de monetización:** Capturas de pantalla o video mostrando cómo funciona el sistema de likes → créditos → retiro.
2. **Evidencia de integración con MercadoPago:** los retiros son manuales (no hay integración con la API de MercadoPago): el usuario solicita el retiro en la app y el equipo lo paga a mano en 1 a 3 días hábiles. No presentes documentación de API que no se usa.
3. **Política de moderación de contenido:** los usuarios pueden reportar publicaciones y usuarios desde el menú (•••) de cada publicación, y bloquear usuarios; los reportes los revisa el equipo y el contenido que viola los Términos se oculta. La cola de reportes es solo para administradores.
4. **Cuenta de prueba:** Google puede solicitar credenciales de una cuenta de prueba para revisar la app. Prepara una cuenta demo con saldo ficticio. El login es Manus OAuth: verificar que el revisor puede entrar sin tener cuenta de Manus.
5. **Borrado de cuenta:** mostrar dónde está en la app (Configuración → Eliminar Cuenta) y el enlace web registrado en Play Console.
