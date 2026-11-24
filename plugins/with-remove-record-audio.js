/**
 * Moneypik — Plugin opcional: quitar el permiso de micrófono (RECORD_AUDIO).
 *
 * ARCHIVO OPCIONAL (plugins/with-remove-record-audio.js).
 * SOLO se usa si, después de quitar la opción `microphonePermission`
 * del plugin expo-audio en app.config.ts y de correr `npx expo prebuild`,
 * el permiso RECORD_AUDIO sigue apareciendo en
 * android/app/src/main/AndroidManifest.xml.
 *
 * La app no graba audio (no hay ningún import de expo-audio en el
 * código), así que ese permiso no debe estar en el manifiesto: un
 * permiso sensible sin uso real es motivo de rechazo en Play.
 *
 * Uso (solo si hace falta):
 *   1. Copiar este archivo a plugins/with-remove-record-audio.js en el repo.
 *   2. En app.config.ts, añadirlo a los plugins:
 *        plugins: [ ..., "./plugins/with-remove-record-audio" ]
 *   3. Volver a correr `npx expo prebuild` y comprobar que RECORD_AUDIO
 *      ya no está en el manifiesto.
 */
const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withRemoveRecordAudio(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const application = manifest.application?.[0];
    if (!application) return config;

    const permissions = manifest["uses-permission"] || [];
    manifest["uses-permission"] = permissions.filter((permission) => {
      const name = permission.$?.["android:name"];
      return name !== "android.permission.RECORD_AUDIO";
    });

    // También quitar la función que lo pide, si algún plugin la añadió.
    const features = manifest["uses-feature"] || [];
    manifest["uses-feature"] = features.filter((feature) => {
      const name = feature.$?.["android:name"];
      return name !== "android.hardware.microphone";
    });

    return config;
  });
};
