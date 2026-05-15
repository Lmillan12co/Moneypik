# Guía: Firebase App Distribution para Beta Testing

Firebase App Distribution permite distribuir versiones beta de tu app a testers específicos de forma segura y rápida. Perfecto para obtener feedback antes de publicar en las tiendas.

## ¿Cuándo usar Firebase App Distribution?

- ✅ Antes de publicar en Google Play Store
- ✅ Para obtener feedback de testers
- ✅ Para probar nuevas funcionalidades
- ✅ Para detectar bugs antes de la publicación oficial

## Paso 1: Configurar Firebase

### 1.1 Crear proyecto en Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Haz clic en **"Crear proyecto"**
3. Nombre: `Moneypik`
4. Selecciona tu país
5. Haz clic en **"Crear"**

### 1.2 Habilitar App Distribution

1. En el panel de Firebase, ve a **"App Distribution"** (en el menú izquierdo bajo "Release & Monitor")
2. Haz clic en **"Comenzar"**
3. Sigue las instrucciones de configuración

## Paso 2: Subir el APK

### 2.1 Método 1: Desde la consola de Firebase

1. Ve a **"App Distribution"**
2. Haz clic en **"Subir"**
3. Selecciona el archivo `.apk` de Moneypik
4. Espera a que se cargue (2-5 minutos)

### 2.2 Método 2: Usando Firebase CLI

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Subir APK
firebase appdistribution:distribute moneypik.apk \
  --app 1:123456789:android:abcdef123456 \
  --release-notes "Version 1.0.0 - Beta" \
  --testers "tester1@example.com,tester2@example.com"
```

## Paso 3: Invitar testers

### 3.1 Agregar testers manualmente

1. En **"App Distribution"**, ve a **"Testers"**
2. Haz clic en **"Invitar testers"**
3. Ingresa los emails de los testers (separados por comas)
4. Haz clic en **"Invitar"**

### 3.2 Crear grupos de testers

1. Ve a **"Grupos de testers"**
2. Haz clic en **"Crear grupo"**
3. Nombre: `Moneypik Beta Testers`
4. Agrega emails de testers
5. Haz clic en **"Crear"**

## Paso 4: Distribuir la versión

### 4.1 Asignar testers a la versión

1. Ve a **"Versiones"**
2. Selecciona la versión que subiste
3. Haz clic en **"Distribuir"**
4. Selecciona los testers o grupos
5. Agrega notas de la versión
6. Haz clic en **"Distribuir"**

### 4.2 Notas de la versión recomendadas

```
Versión 1.0.0 - Beta

Cambios principales:
• Feed de contenido personalizado
• Sistema de monetización ($0.01 por like)
• Wallet con historial de transacciones
• Retiros via MercadoPago
• Notificaciones en tiempo real

Problemas conocidos:
• Las notificaciones pueden tardar hasta 1 minuto en llegar
• La carga de videos grandes puede ser lenta

Feedback solicitado:
• ¿Es fácil de usar la interfaz?
• ¿Encontraste algún bug?
• ¿Qué funcionalidad te gustaría agregar?

Contacto: feedback@moneypik.app
```

## Paso 5: Los testers reciben un email

Los testers recibirán un email con:
- Enlace para descargar la app
- Instrucciones de instalación
- Notas de la versión
- Formulario para enviar feedback

## Paso 6: Monitorear feedback

### 6.1 Ver comentarios de testers

1. Ve a **"Versiones"**
2. Selecciona la versión
3. Haz clic en **"Feedback"**
4. Lee los comentarios de los testers

### 6.2 Responder a feedback

1. Haz clic en un comentario
2. Escribe tu respuesta
3. Haz clic en **"Enviar"**

## Mejores prácticas

### Para obtener feedback de calidad

- ✅ Invita a 10-20 testers para la primera versión
- ✅ Proporciona instrucciones claras sobre qué probar
- ✅ Pide feedback específico (UI, funcionalidad, bugs)
- ✅ Responde rápidamente a los comentarios
- ✅ Implementa los cambios sugeridos rápidamente
- ✅ Publica nuevas versiones cada 2-3 días

### Preguntas para hacer a los testers

1. ¿Es fácil crear una cuenta?
2. ¿Es intuitivo subir contenido?
3. ¿Funcionan correctamente los likes?
4. ¿Es clara la información del wallet?
5. ¿Encontraste algún bug?
6. ¿Qué funcionalidad te gustaría agregar?
7. ¿Recomendarías esta app a un amigo?

## Cronograma sugerido

**Semana 1: Beta cerrada**
- Invita a 10 testers cercanos
- Recopila feedback
- Corrige bugs críticos

**Semana 2: Beta abierta**
- Invita a 50-100 testers
- Implementa mejoras
- Prepara para lanzamiento oficial

**Semana 3: Lanzamiento**
- Publica en Google Play Store
- Publica en Amazon Appstore
- Monitorea reseñas

## Solución de problemas

### El tester no recibe el email

1. Verifica que el email sea correcto
2. Revisa la carpeta de spam
3. Invita de nuevo al tester

### El APK no se carga

1. Verifica que el APK esté firmado
2. Verifica que el tamaño sea menor a 2GB
3. Intenta subir de nuevo

### El tester no puede instalar la app

1. Verifica que tenga Android 7.0+
2. Verifica que tenga suficiente espacio
3. Pide que permita "Instalar desde fuentes desconocidas"

## Contacto de soporte

- 📧 [firebase.google.com/support](https://firebase.google.com/support)
- 📚 [Documentación oficial](https://firebase.google.com/docs/app-distribution)

---

**¡Listo!** Usa Firebase App Distribution para obtener feedback de testers antes de publicar en las tiendas oficiales.
