# SaludPlus - Gestor Médico Integral

SaludPlus es una aplicación móvil desarrollada con [React Native](https://reactnative.dev/) y [Expo](https://expo.dev/). Su propósito es servir como un prototipo visual interactivo (mockup) para la gestión de citas médicas, permitiendo explorar la interfaz de usuario, los flujos de navegación y las interacciones sin requerir de servicios backend vivos ni persistencia real de datos.

## Características Principales

- **Dashboard Principal:** Acceso centralizado y fluido a las diferentes herramientas médicas y administrativas.
- **Consulta de Citas:** Lista de pacientes (datos simulados), funcionalidad de filtrado de acuerdo a especializaciones (por ejemplo, "Pediatría" u "Odontología") y previsualización rápida.
- **Detalle de la Cita:** Presentación detallada e individual de la cita elegida con operaciones de demostración para cancelación.
- **Agendamiento:** Formulario optimizado para móviles (incluyendo soporte de `KeyboardAvoidingView` para una mejor experiencia táctil) y notificaciones in-app personalizadas.

## Tecnologías y Arquitectura

- **Framework:** React Native + Expo.
- **Ruteo:** [Expo Router](https://docs.expo.dev/router/introduction/) implementando el sistema basado en archivos en el directorio `/app`.
- **Estructura Conceptual:** Todo concepto transaccional como el Context API y llamadas API han sido retiradas, resultando en un prototipo enteramente presentatorio enfocado en diseño moderno y experiencia de usuario.

## Primeros Pasos

### 1. Instalación de Dependencias

Asegúrate de contar con Node.js en tu sistema, y posteriormente ejecuta:

```bash
npm install
```

### 2. Iniciar el Servidor de Desarrollo

Una vez instalados los paquetes, puedes iniciar el proyecto:

```bash
npx expo start
```

Cuando aparezca el menú en la consola de comandos, podrás optar por levantar el sistema en:
- Emulador de Android
- Simulador de iOS
- Aplicación de [Expo Go](https://expo.dev/go) en tu celular físico, escaneando el código QR.

## Documentación del Código

Para detalles específicos sobre la implementación de las pantallas del proyecto, por favor revisa el documento [`Documentacion_App.md`](./Documentacion_App.md), que explica exhaustiva y detalladamente los archivos del directorio `/app`.
