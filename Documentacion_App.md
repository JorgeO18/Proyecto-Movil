# Documentación Técnica Completa del Directorio `app`

A continuación, se detalla la documentación de cada uno de los archivos encontrados en la carpeta `app`. Para cada archivo, encontrarás su **descripción general** y el **código principal comentado línea por línea y por bloques** (hemos omitido los bloques finales de `const styles = StyleSheet.create({...})` para centrarnos pura y exclusivamente en la lógica funcional de la de los componentes).

---

## 1. `app/_layout.tsx`

**Descripción General:** Archivo maestro que configura la navegación raíz (Routing) y aplica los temas visuales de la aplicación.

### Código Explicado:
```tsx
// Bloque de Importaciones
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'; // Manejadores de Temas Visuales
import { Stack } from 'expo-router'; // Enrutador tipo pila (Stack) nativo de Expo
import { StatusBar } from 'expo-status-bar'; // Componente para la barra de estado superior nativa (Batería, WiFi)
import 'react-native-reanimated'; 

import { useColorScheme } from '../hooks/use-color-scheme'; // Hook local que detecta si el celular está en modo Oscuro o Claro

// Objeto que asegura el acceso principal ante un fallo en el routing
export const unstable_settings = {
  initialRouteName: 'index', 
};

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Leemos el modo preferido por el dispositivo

  return (
    // ThemeProvider inyecta en toda la jerarquía el color nativo detectado 
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Aquí registramos individualmente las vistas que conformarán este bloque de negocio */}
        {/* options={{ headerShown: false }} oculta el título nativo que interpone el sistema operativo */}
        <Stack.Screen name="index" options={{ headerShown: false }} /> 
        <Stack.Screen name="citas" options={{ headerShown: false }} />
        <Stack.Screen name="agendar" options={{ headerShown: false }} />
      </Stack>
      
      {/* Componente para adaptar dinámicamente el color de los iconos de estado (batería, hora, etc) al tema de fondo */}
      <StatusBar style="auto" /> 
    </ThemeProvider>
  );
}
```

---

## 2. `app/index.tsx`

**Descripción General:** Pantalla inicial de bienvenida. Presenta la marca y ramifica la navegación a dos acciones directas.

### Código Explicado:
```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router'; // Utilidad principal para hacer cambio de vistas
import { Ionicons } from '@expo/vector-icons'; // Iconos pregenerados vectoriales de Expo

export default function WelcomeScreen() {
  const router = useRouter(); // Instanciamos la utilidad para usarla más adelante

  return (
    // SafeAreaView "abraza" el contenido para que las muescas físicas (Notches/Pantallas curvas) no tapen la UI
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" /> {/* Personalización puntual de la barra superior */}
      <View style={styles.container}>
        
        {/* Bloque superior con Títulos Institucionales e Iconos */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="medical" size={60} color="#4F46E5" />
          </View>
          <Text style={styles.title}>SaludPlus</Text>
          <Text style={styles.subtitle}>Gestor Médico Integral</Text>
        </View>

        {/* Bloque Inferior que contiene los dos botones interactivos */}
        <View style={styles.buttonsContainer}>
          
          {/* Primer Botón: Consultas */}
          <TouchableOpacity 
            style={styles.buttonPrimary} 
            onPress={() => router.push('/citas')} // <- ACCIÓN: Añade "citas" al tope de la pila y viaja a esa vista
            activeOpacity={0.8} // Modifica qué tan transparente debe estar el botón al sentir el tacto humano (80%)
          >
            <Ionicons name="list" size={26} color="#ffffff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Consultar Citas</Text>
          </TouchableOpacity>

          {/* Segundo Botón: Agendar un Nuevo Ingreso */}
          <TouchableOpacity 
            style={styles.buttonSecondary} 
            onPress={() => router.push('/agendar')} // <- ACCIÓN: Viaja a "agendar"
            activeOpacity={0.8}
          >
            <Ionicons name="calendar-outline" size={26} color="#4F46E5" style={styles.buttonIcon} />
            <Text style={styles.buttonSecondaryText}>Agendar Nueva Cita</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
```

---

## 3. `app/citas.tsx`

**Descripción General:** Pantalla de listado y filtrado que muestra el histórico general de Citas Médicas (`HomeScreen`).

### Código Explicado:
```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Herramienta de menú tipo "Acordeón/Selector"
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * Bloque 1: Almacenamiento Estático 
 * Se trata de un Objeto falso que no viaja sobre internet. Solamente provee contenido emulando APIs 
 * para construir visualmente el prototipo UI (Mockup).
 */
const dummyCitas = [
  { id: '1', patientName: 'Ana García', specialty: 'Medicina General', date: '15/11/2026', time: '10:00' },
  { id: '2', patientName: 'Carlos López', specialty: 'Odontología', date: '16/11/2026', time: '14:30' },
  { id: '3', patientName: 'María Rodríguez', specialty: 'Pediatría', date: '18/11/2026', time: '09:15' },
];

export default function HomeScreen() {
  const router = useRouter();
  
  // Estado Reactivo del componente en texto ("Pediatría", "Odontología", o vacío "")
  const [filterSpecialty, setFilterSpecialty] = useState<string>(''); 

  /**
   * Evaluador/Condicionador central. 
   * Ejecuta JavaScript comprobando si hay un filtro escrito. Sí encuentra datos, aplica función estricta `.filter`.
   * de lo contrario, deja todo sin cambios como array madre.
   */
  const filteredCitas = filterSpecialty
    ? dummyCitas.filter(c => c.specialty === filterSpecialty)
    : dummyCitas;

  // Estos Helpers (Ayudantes) simplifican asignar Colores Hexadecimales consultando qué atributo string tiene el objeto.
  const getSpecialtyColor = (spec: string) => { /* Retorna ejemplo #3b82f6 si es Medicina General */  ... }
  const getSpecialtyIcon = (spec: string) => { /*  Retorna ejemplo icono de "medical" si es Medicina General */ ... }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      {/* Header Personalizado con Títulos y Botón de Flecha Regreso usando "router.back()" */}
      ...
        <View style={styles.filterContainer}>
          {/* Bloque 2: Administrador del Filtro ("Especialidad") */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filterSpecialty} // Atributo bidireccional "Leyendo valor de variable"
              onValueChange={(itemValue) => setFilterSpecialty(itemValue)} // Atributo modificador "Asignando valor a variable"
            >
              <Picker.Item label="Todas las especialidades" value="" />
              <Picker.Item label="Medicina General" value="Medicina General" />
              {/* Otros ítems... */}
            </Picker>
          </View>
        </View>

        {/* Bloque 3: Core Visual (La Lista en Pantalla) */}
        {/* FlatList solo pinta en RAM los datos que están visualmente en el celular, ayudando al FPS. */}
        <FlatList
          data={filteredCitas} // Aquí se envían todos los datos del Array
          keyExtractor={item => item.id} // Requisito estricto React que evita conflictos
          // Este es el Renderizador por Tarjeta. Es un Botón Gigante (TouchableOpacity) enlazado a detalle
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.citaCard}
              // Viaja con un Template String interpolando `/detalle/1` o igual al objeto asignado
              onPress={() => router.push(`/detalle/${item.id}` as any)}
            >
              {/* Lógica Interna de la Tarjeta */}
              <View style={styles.cardContent}>
                  {/* Se imprimen propiedades puntuales de la persona emulando data */}
                  <Text style={styles.citaName}>{item.patientName}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Bloque 4: FAB (Boton FLotante Abstracto Circular Absoluto a la Pantalla para agendar Citas */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/agendar')}>
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
```

---

## 4. `app/agendar.tsx`

**Descripción General:** Pantalla de formulario enfocado en creación de Cita con evación de colisiones de teclado para móviles interactivos.

### Código Explicado:
```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function AgendarScreen() {
  const router = useRouter();

  // Estados Particulares y Separados por cada "Cajoncillo" del Formulario. Arrancan vacíos => ''.
  const [patientName, setPatientName] = useState('');
  const [document, setDocument] = useState('');
  const [specialty, setSpecialty] = useState('Medicina General'); // Inicia por lógica genérica médica.
  ...
  
  // Estado compuesto (Booleano + Objeto de Objeto) usado dinámicamente para emitir notificaciones "Toast" o Emergentes  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'error', onConfirm: () => {} });

  // Función encargada de Mutar todos los estados de Alerta a la vez 
  const showAlert = (title: string, message: string, type: 'error' | 'success', onConfirm: () => void = () => {}) => {
    setAlertConfig({ title, message, type, onConfirm });
    setAlertVisible(true);
  };

  /**
   * Controlador lógico "Ficticio":
   * Donde típicamente deberíamos ver Fetch, Axios (API) comunicándose por Rest con Servidores,
   * Hoy hay una demo y redirecciona informando confirmación exitosa del pop-up en la interfaz de usuario.
   */
  const handleSave = () => {
    showAlert('Demostración', 'Maqueta sin datos guardados...', 'success', () => router.push('/citas'));
  };

  return (
    // Esencial: Alerta a iOS (`Platform.OS === ios`) que sume espacio ("padding") desde abajo para 
    // evitar que el sistema empuje u oculte este panel con el teclado físico táctil
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      
      {/* ScrollView otorga el superpoder a todo hijo descendiente a moverse arrastrando con el dedo hacia abajo */}
      <ScrollView>
        {/* Estructuraciones y Formularios */}

        <View style={styles.inputContainer}>
            {/* TextInput es el control base en React Native para escribir contenido en texto */}
            <TextInput 
              value={patientName} // 1 => Lectura Dinámica del Estado
              onChangeText={setPatientName} // 2=> Asignador que manda lo que escribes como estado
              placeholder="Ej. Juan Pérez" // Letra Opaca/Fantasma Instructiva
            />
        </View>
        ...
      </ScrollView>

      {/* Modal Independiente que aguarda instrucciones del bool 'alertVisible' para disparar opacidad encima del formulario */}
      <Modal transparent={true} visible={alertVisible}>
          ... // Mensaje dinámico que lee e imprime: alertConfig.title y alertConfig.message
      </Modal>

    </KeyboardAvoidingView>
  );
}
```

---

## 5. `app/detalle/[id].tsx`

**Descripción General:** Archivo anclado dinámico por `[id]`, exhibe y desglosa a un paciente estático ("Mockup") asimilando su traída simulada en RAM y conteniendo la alerta interaccional de eliminación por interfaz.

### Código Explicado:
```tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';

export default function DetalleCitaScreen() {
  const router = useRouter();
  
  // Condición lógica principal para disparos de "Borrar" (Alerta de Confimación Cancelado)
  const [modalVisible, setModalVisible] = useState(false); 

  /**
   * JSON Interno. Reemplazo del hook comúnmente usado "useLocalSearchParams()"
   * Simula los campos capturados que arrojaría la ruta HTTP o un componente por prop.
   */
  const cita = { id: '1', patientName: 'Visual', document: '123...', specialty: 'Odontología'... };

  // Ejecutador Estático Cancelación
  const handleCancelar = () => {
    setModalVisible(false); // Retira la capa del pop-up de atención de la vista
    router.back(); // Comando vital que retrocede la historialidad del Routing
  };

  return (
    <ScrollView style={styles.container}>
      {/* Volcador principal de Header con Regreso */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        ...
      </TouchableOpacity>

      <View style={styles.card}>
          {/* Interpolaciones dinámicas clásicas de React (usando variables Javascript `{}`). Se mapean 
              los componentes locales al archivo físico con simpleza */}
          <Text style={styles.text}>{cita.document}</Text>
          <Text style={styles.text}>{cita.date} a las {cita.time}</Text>

          {/* Renderizado Condicional (`&&`): Si cita.observations no esta vacio, procede a construir Textos del bloque */}
          {!!cita.observations && ( ... <Text>{cita.observations}</Text> ... )}
      </View>

      {/* Bloque Principal Operativo */}
      <View style={styles.actionContainer}>
        {/* Evento 1: Botón empujador hacia una ruta hermana dinámica (`/editar/[ID]`)  */}
        <TouchableOpacity onPress={() => router.push(`/editar/${cita.id}` as any)}>
          <Text>Editar Datos Visibles</Text>
        </TouchableOpacity>

        {/* Evento 2: Botón Cancelador el cuál desata asíncronamente el Estado a ser Verdad (`True`) */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
      </View>
      
      {/* Pop Up que vigila al estado booleano "visible" pasivo y actúa dependiendo a setModalVisible */}
      <Modal visible={modalVisible}>
         ... {/* Botón confirmador oculto que dispara de ser apretado el proceso `handleCancelar` */}
      </Modal>
    </ScrollView>
  );
}
```

---

## 6. `app/modal.tsx`

**Descripción General:** Archivo anexo demostrativo y residual. Sirve para exponer el concepto teórico de Modales base de Expo sin impacto verdadero o relacional a la app.

### Código Explicado:
```tsx
import { Link } from 'expo-router'; // Interactor generalizado asimilado al Anchor <a href="#"> web
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text'; // Componentes abstraídos modulares que soportan Oscuro/Claro nativo
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Etiqueta Texto Tipográfica para encabezado ("type=title") */}
      <ThemedText type="title">This is a modal</ThemedText>
      
      {/* 
        Link hace navegación y dismissTo es un atributo especial que le indica al ruteador: 
        "Destruye todas tus acciones en pila y devuélvete pasivamente al index base ("/") "
      */}
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}
```
