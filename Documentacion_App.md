# Documentación Técnica Completa del Directorio `app`

A continuación, se detalla la documentación extensa de cada uno de los archivos principales en la carpeta `app`. Se incluye el código fuente funcional íntegro de cada componente (**omitiendo la hoja de estilos** al final para centrarnos directamente en la lógica) junto a la explicación del propósito y las técnicas empleadas.

---

## 1. `app/_layout.tsx`

**Descripción General:** 
Es el archivo maestro de configuración de enrutamiento (Routing) utilizado por Expo Router. Define el "Stack" o pila de navegación nativa e inyecta los temas de color (oscuro/claro) a toda la jerarquía de las pantallas, además de ocultar cabeceras nativas no deseadas.

### Código Fuente Explicado:
```tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// Hook local para detectar si el celular está en Dark o Light mode
import { useColorScheme } from '../hooks/use-color-scheme';

// Permite redirigir a 'index' si se presenta un error grave en la jerarquía inicial de layout
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // Inyecta dinámicamente colores base al árbol de navegación
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Registro directo de Pantallas: headerShown en false oculta la cabecera nativa */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="citas" options={{ headerShown: false }} />
        <Stack.Screen name="agendar" options={{ headerShown: false }} />
        <Stack.Screen name="detalle/[id]" options={{ headerShown: false }} />
      </Stack>
      {/* Adapta el color de la barra del sistema (batería, hora) dinámicamente */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
```

---

## 2. `app/index.tsx`

**Descripción General:** 
Pantalla de inicio o bienvenida al entrar a la app. Atrapa el estado eventual que viaje por parámetros y actúa como el menú central y "dashboard" visual que dispersa al usuario hacia las acciones clave: listar las citas o agendar una nueva.

### Código Fuente Explicado:
```tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  const router = useRouter(); // Hook utilizado para viajar entre rutas programáticamente
  const { lista } = useLocalSearchParams(); // Recibe la "Base de Datos Virtual" temporal que puede haber viajado a index

  return (
    // SafeAreaView asegura que tu contenido no quede tapado por bordes irregulares físicos del celular
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <View style={styles.container}>
        
        {/* Cabecera visual del index con Título y Subtítulo principal */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="medical" size={60} color="#4F46E5" />
          </View>
          <Text style={styles.title}>SaludPlus</Text>
          <Text style={styles.subtitle}>Gestor Médico Integral</Text>
        </View>

        <View style={styles.buttonsContainer}>
          {/* Acción para ingresar a ver la lista de pacientes registrados */}
          <TouchableOpacity
            style={styles.buttonPrimary}
            // Navega a citas, inyectando recursivamente la variable "lista" en los parámetros
            onPress={() =>
              router.push({
                pathname: "/citas",
                params: { lista: lista },
              })
            }
            activeOpacity={0.8}
          >
            <Ionicons name="list" size={26} color="#ffffff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Consultar Citas</Text>
          </TouchableOpacity>

          {/* Acción directa de agendamiento aislando la operación en otra vista */}
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => router.push("/agendar")}
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

**Descripción General:** 
Despliega dinámicamente un `FlatList` con las atenciones alojadas en memoria RAM. Filtra especialidades médicas mediante un `Picker`. La comunicación y persistencia dependen por completo del envío recíproco de la variable de estado central `lista` convertida a formato JSON transversal.

### Código Fuente Explicado:
```tsx
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  // Tipado estricto TS para el objeto "Cita" que da forma algorítmica al arreglo
  type Cita = {
    idCita: number;
    idPaciente: string;
    nomPaciente: string;
    especialidad: string;
    fechaHora: string;
    estado: string;
    observaciones: string;
  };

  const router = useRouter();
  
  // Rescata el arrastre temporal JSON en texto desde el ruteador HTTP local
  const { lista } = useLocalSearchParams();
  
  // uso de un Memoizer: Evita re-explotar recursos del parseo al menos que 'lista' string haya cambiado físicamente.
  const parsedLista = useMemo(() => {
    return lista ? JSON.parse(lista as string) : [];
  }, [lista]);
  
  const [filtro, setFiltro] = useState("");
  const [listaFiltrada, setListaFiltrada] = useState<Cita[]>([]);

  // Efectos reactivos que inyectan y sincronizan la pantalla al cargarse cuando 'lista' detecta cambios
  useEffect(() => {
    if (lista) {
      setListaFiltrada(JSON.parse(lista as string));
    }
  }, [lista]);

  useEffect(() => {
    setListaFiltrada(parsedLista);
  }, [parsedLista]);

  // Controlador lógico imperativo. Vacía todo al original si no hay nada en Picker, o usa un filtrado (.filter()) de Javascript puro.
  const filtrar = async(especialidad :string)=>{
    if (especialidad === "") {  
      setListaFiltrada(parsedLista);
    } else {
      const filtrados = parsedLista.filter((item:any) => item.especialidad === especialidad);
      setListaFiltrada(filtrados);
    }
  }

  // Utilidades repetitivas de estilos visuales semánticos dinámicos (Retornan hexadecimales o string names de iconos)
  const getSpecialtyColor = (spec: string) => {
    switch (spec) {
      case 'Medicina General': return '#3b82f6';
      case 'Odontología': return '#10b981';
      case 'Pediatría': return '#f59e0b';
      default: return '#6366f1';
    }
  };

  const getSpecialtyIcon = (spec: string) => {
    switch (spec) {
      case 'Medicina General': return 'medical';
      case 'Odontología': return 'happy';
      case 'Pediatría': return 'color-palette';
      default: return 'medkit';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4338ca" />
      
      {/* Header Estético */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backButtonTop} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerBadge}>
            <Ionicons name="pulse" size={20} color="#4338ca" />
          </View>
        </View>
        <Text style={styles.headerTitle}>Mis Citas</Text>
        <Text style={styles.headerSubtitle}>Gestiona tus próximas atenciones</Text>
      </View>

      <View style={styles.container}>
        {/* Contenedor del Dropdown de Selección (Picker) enganchado al ejecutor 'filtrar' */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filtrar especialidad</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filtro}
              onValueChange={(itemValue) => {setFiltro(itemValue);filtrar(itemValue);}}
              style={styles.picker}
              dropdownIconColor="#4338ca"
            >
              <Picker.Item label="Todas las especialidades" value="" color="#1e293b" />
              <Picker.Item label="Medicina General" value="Medicina General" />
              <Picker.Item label="Odontología" value="Odontología" />
              <Picker.Item label="Pediatría" value="Pediatría" />
            </Picker>
          </View>
        </View>

        {/* Iterador FlatList para tarjetas: Altamente rendidor. Solo renderiza la porción visible en la memoria física. */}
        <FlatList
          data={listaFiltrada}
          keyExtractor={(item:Cita)=>item.idCita.toString()} // Prop estricta
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="calendar-clear-outline" size={50} color="#818cf8" />
              </View>
              <Text style={styles.emptyText}>No tienes citas pendientes</Text>
              <Text style={styles.emptySubtext}>Toca el botón inferior para agendar</Text>
            </View>
          }
          // El render individual en bucle 
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.citaCard}
              activeOpacity={0.8}
              // Operación vital: Viaja al modo de detalle pasando un ID literal en la ruta, y la base de persistencia temporal entera anidada en params
              onPress={() => router.push({pathname:`/detalle/${item.idCita}` as any,params:{lista}})}
            >
              <View style={styles.cardInner}>
                <View style={[styles.iconWrapper, { backgroundColor: getSpecialtyColor(item.especialidad) + '1A' }]}>
                  <Ionicons name={getSpecialtyIcon(item.especialidad) as any} size={28} color={getSpecialtyColor(item.especialidad)} />
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={styles.citaName} numberOfLines={1}>{item.nomPaciente}</Text>
                  <Text style={styles.citaSpecialty}>{item.especialidad}</Text>
                  
                  <View style={styles.cardFooter}>
                    <View style={styles.timeBadge}>
                      <Ionicons name="time-outline" size={14} color="#4338ca" />
                      <Text style={styles.citaDate}>{item.fechaHora}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Botón flotante para llevar al usuario a "agendar" */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/agendar')} activeOpacity={0.9}>
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
```

---

## 4. `app/agendar.tsx`

**Descripción General:** 
Un componente pesado y avanzado, enfocado enteramente en ser un creador e inyector interactivo de registros listos para la matriz principal. Implementa una gran dosis de estados individuales, lógicas controladas de "Doble Botonera", y una librería madura selectora de fechas externa.

### Código Fuente Explicado:
```tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export default function AgendarScreen() {
  const router = useRouter();

  type Cita = {
    // ...
  };

  // Estados reactivos particionados para los campos libres 
  const [contador, setContador] = useState(1);
  const [idPaciente, setIdPaciente] = useState("");
  const [nomPaciente, setNomPaciente] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [fechaHora, setFechaHora] = useState(new Date());
  const [observaciones, setObservaciones] = useState("");
  
  // BBDD Local Temporal que irá engordando y reciclándose antes de ser exportada por URL a otras vistas
  const [lista, setLista] = useState<Cita[]>([]);

  // Bandas locales de Timers e invocadores
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  /**
   * Operador Supremo "Guardar":
   * Valida existencia en blanco, ejecuta verificador bucle, encapsula datos y muta el Array con Spread Operator.
   */
  const guardar = () => {
    // 1. Condicional anti-blancos
    const verfDatos =
      idPaciente.trim() === "" ||
      nomPaciente.trim() === "" ||
      especialidad.trim() === "" ||
      observaciones.trim() === "";

    if (!verfDatos) {
      const nFecha = formatearFechaHora(fechaHora);
      const compFechas = verifFecha(nFecha, lista);

      if (compFechas === true) {
        alert("Las fechas no deben coincidir");
      } else {
        const newCita = {
          idCita: contador,
          idPaciente: idPaciente,
          nomPaciente: nomPaciente,
          especialidad: especialidad,
          fechaHora: nFecha,
          estado: "Confirmada",
          observaciones: observaciones,
        };
        if (loading === false) {
          const nueva = [...lista, newCita];
          setLista(nueva);
        }
        iniciarProceso()
        // Reset absoluto visual de los inputs y contadores
        setEspecialidad("");
        setFechaHora(new Date());
        setIdPaciente("");
        setNomPaciente("");
        setObservaciones("");
        setContador(contador + 1); 
      }
    } else {
      showAlert("Error", "Rellene todos los cambios", "error", () =>{});
    }
  };

  /**
   * Evento de Interacción con `react-native-community/datetimepicker`.
   * Pasa secuencialmente por Fecha -> Hora verificando y acotando los rangos con condicionales.
   */
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }
    const currentDate = selectedDate || fechaHora;

    if (mode === "date") {
      const hoy = new Date();
      // Anula matemáticamente las horas de las firmas de tiempo para comparar exclusivamente Días.
      const f1 = new Date(currentDate).setHours(0, 0, 0, 0);
      const f2 = new Date(hoy).setHours(0, 0, 0, 0);

      if (f1 <= f2) {
        alert("No puedes seleccionar fechas pasadas o de hoy");
        setShow(false);
        return;
      }
      setFechaHora(currentDate);
      setMode("time"); // Vuelve a ejecutar pidiendo horas
      setShow(true);
    } else {
      // Impone jornada comercial 8 AM a 5 PM 
      const hora = currentDate.getHours();
      if (hora < 8 || hora >= 17) {
        alert("Solo puedes seleccionar entre 8:00 AM y 5:00 PM");
        setShow(false);
        return;
      }
      setFechaHora(currentDate);
      setShow(false); // Sale de la librería.
    }
  };

  // Simulador de envío web al servidory aviso "Exitoso" temporalizado con SetTimeout.
  const iniciarProceso = () => {
    setLoading(true);
    setTimeout(() => {
      showAlert(
      "La cita se a guardado correctamente",
      "Ahora sera redireccionado para verificar las citas.",
      "success",
      () =>{})  
      setLoading(false);
    }, 2000);
  };

  // Verificador manual algorítmico bucle for-loop que constata que no exista exactitud horaria repetida previa.
  const verifFecha = (fecha: string, lista: any) => {
    if (!lista) return false;
    const newDate = fecha;
    for (let i = 0; i < lista.length; i++) {
      if (newDate === lista[i].fechaHora) return true;
    }
    return false;
  };

  // Helpers visuales para Modales Personalizados
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", message: "", type: "error" as "error" | "success", onConfirm: () => {}, });

  const showAlert = (title: string, message: string, type: "error" | "success", onConfirm: () => void = () => {}) => {
    setAlertConfig({ title, message, type, onConfirm });
    setAlertVisible(true);
  };

  // Escape de transporte desde otra botonera que empuja los datos al histórico
  const handleSave = () => {
    return (router.push({
      pathname: "/citas",
      params: { lista: JSON.stringify(lista) }}))
  };

  const formatearFechaHora = (fecha: Date) => {
     // ... Utiliza API nativa 'toLocaleString' JS para generar un texto legible...
  }

  return (
    // Re-estructurador dinámico para móviles que empuja el panel hacia arriba a medida de la pantalla sin tapar cajas con el teclado nativo físico
    <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Cabeceras Base... */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace({ pathname: "/citas", params: { lista: JSON.stringify(lista) }})}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <View style={styles.formCard}>
          {/* Construcción clásica bidireccional "Value -> onChangeText" del texto puro escrito. */}
          <Text style={styles.label}>Nombre del Paciente *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={nomPaciente}
              onChangeText={setNomPaciente}
              placeholder="Ej. Juan Pérez"
            />
          </View>
          
          {/* ... Inputs documentales y Picker especiales omitidos por repetición .. */}
          
          {/* Implementación nativa Pressable para levantar calendario de librería independiente */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Fecha y hora *</Text>
              <View>
                <Pressable onPress={() => { setShow(true); setMode("date");}} style={[styles.inputContainer, { width: "100%" }]}>
                  <Ionicons name="calendar-outline" size={20} color="#94a3b8" style={styles.icon} />
                  <Text style={styles.input}>{formatearFechaHora(fechaHora)}</Text>
                </Pressable>
                {show && (
                  <DateTimePicker value={fechaHora} mode={Platform.OS === "ios" ? "datetime" : mode} display="compact" onChange={onChange} />
                )}
              </View>
            </View>
          </View>

        {/* Doble Botonera Operativa */}
        <View style={{flexDirection:'row',gap:'6',justifyContent:'center'}}>
          <TouchableOpacity style={[styles.buttonPrimary,{backgroundColor: "#8f77e7"}]} onPress={()=>{handleSave()}} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Ver Citas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonPrimary} onPress={()=>{guardar()}} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Confirmar Cita</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Inyección modal final del panel emergente reconfigurable */}
      <Modal animationType="fade" transparent={true} visible={alertVisible} onRequestClose={() => { ... }}>
         {/* ... Elementos de UI Controladores ... */}
      </Modal>
    </KeyboardAvoidingView>
  );
}
```

---

## 5. `app/detalle/[id].tsx`

**Descripción General:** 
Vista de Perfil Detallado basada en enrutamiento dinámico `[id]`. Recoge la base de datos temporal completa por puente de texto HTTP, filtra en el acto de renderizado al paciente exacto que hizo "clic", y dispone de acciones destructivas de estado (Cancelar/Mutar Estado), devolviéndolo íntegramente de regreso al padre por `replace` para garantizar el cierre histórico del Routing de React.

### Código Fuente Explicado:
```tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DetalleCitaScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  
  // Parámetros mágicos de Ruta recolectados 
  const { lista } = useLocalSearchParams(); // String adjunto transportado desde /citas
  const { id } = useLocalSearchParams();    // Identificador único interpolado estricto por la URL: (/detalle/4)
  
  const parsedLista = lista ? JSON.parse(lista as string) : [];
  // Estado local copiado para permitir a esta vista operar libremente alteraciones sin tapujos.
  const [listaState, setListaState] = useState<any[]>(parsedLista);

  // Selector Buscador: Explora localmente el objeto donde idCita confluya con el ID del router forzado a formato numérico puro.
  const cita = listaState.find((item: any) => item.idCita === Number(id));

  /**
   * Modificador Fuerte Central
   */
  const cambiarEstado = (id: number) => {
    // Si la iteración encuentra el mismo ID analizado, desencadena clonación profunda (`...item`)
    // alterando única y caprichosamente a inversa su status con un operador ternario lógico ("estado").
    const nuevaLista = listaState.map((item) => {
      if (item.idCita === id) {
        return {
          ...item,
          estado: item.estado === "Confirmada" ? "Cancelada" : "Confirmada",
        };
      }
      return item;
    });
    // Reajusta a nivel global esta variable en la pantalla
    setListaState(nuevaLista);
  };

  // Simplemente esconde pop-ups sin consecuencias persistentes y mata el router hacia abajo usando el historial.
  const handleCancelar = () => {
    setModalVisible(false);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      
      {/* 
        Aviso Importante: Este botón "Back" sustituye en función y visualmente al header nativo del SO
        usando un router.replace destructivo para el Stack, e inyectándole un payload entero JSON con los cambios forzados posibles. 
      */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace({ pathname: "/citas", params: { lista: JSON.stringify(listaState) } })}
      >
        <Ionicons name="arrow-back" size={24} color="#1e293b" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getSpecialtyColor(cita.especialidad) + "20" }]}>
          <Ionicons name={getSpecialtyIcon(cita.specialty) as any} size={40} color={getSpecialtyColor(cita.especialidad)} />
        </View>
        <Text style={styles.title}>{cita.nomPaciente}</Text>
        <Text style={[styles.specialtyBadge, { color: getSpecialtyColor(cita.especialidad), backgroundColor: getSpecialtyColor(cita.especialidad) + "15" }]}>
          {cita.especialidad}
        </Text>
      </View>

      <View style={styles.card}>
         {/* UI repetitiva del panel informativo de lectura en tabla apilada */}
        <View style={styles.detailRow}>
           ... <Text style={styles.text}>{cita.fechaHora}</Text> ...
        </View>
      </View>

      <View style={styles.actionContainer}>
        {/* Levantador de modal preventivo de UI. No borra nada, acciona el panel. */}
        <TouchableOpacity style={styles.buttonDanger} onPress={() => setModalVisible(true)}>
          <Ionicons name="close-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.buttonDangerText}>Cancelar Cita</Text>
        </TouchableOpacity>
      </View>

      {/* Panel Alert Criterio Fuerte "Warning" */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
             {/* Componente Confirmador Definitivo que acciona el Hook Superior mutador `cambiarEstado` y cierra el popup. */}
             <TouchableOpacity style={[styles.modalBtn, styles.modalBtnConfirm]} onPress={() => { cambiarEstado(Number(id)); }}>
                <Text style={styles.modalBtnConfirmText}>Cancelar</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}
```

---

## 6. `app/modal.tsx`

**Descripción General:** 
Archivo residual demostrativo. Sirve para exponer conceptualmente el modal de Expo utilizando hooks abstractos de interfaz. No cuenta con dependencia enrutada formal relacionada con el objetivo transaccional médico de SaludPlus.

### Código Fuente Explicado:
```tsx
import { Link } from "expo-router";
import { StyleSheet } from "react-native";

// Componentes preconstruidos Themed para auto-acople al framework ColorMode del Teléfono.
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">This is a modal</ThemedText>
      
      {/* 
        Funcionaliza el componente Link anclando `href="/"`.
        Su Prop. especial `dismissTo` asesina/destruye por completo la pila previa sobre el Stack nativo
        devolviendo todo al nivel cero inicial que el router reconozca.
      */}
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}
```
