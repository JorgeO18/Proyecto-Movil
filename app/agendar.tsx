import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";


export default function AgendarScreen() {
  const router = useRouter();// router es para navegar entre pantallas

  // KeyboardAvoidingView evita que el teclado tape los campos
  // Platform Detecta si es Android o iOS
  type Cita = {
    idCita: number;
    idPaciente: string;
    nomPaciente: string;
    especialidad: string;
    fechaHora: string;
    estado: string;
    observaciones: string;
  };
  const { lista } = useLocalSearchParams();
  const parsedLista = useMemo(() => {
    return lista ? JSON.parse(lista as string) : [];
  }, [lista]);

  const [contador, setContador] = useState(1);
  const [idPaciente, setIdPaciente] = useState("");
  const [nomPaciente, setNomPaciente] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [fechaHora, setFechaHora] = useState(new Date());
  const [observaciones, setObservaciones] = useState("");
  const [listaCitas, setListaCitas] = useState<Cita[]>(parsedLista || []);
  

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  const guardar = () => {
    const verfDatos =
      idPaciente.trim() === "" ||
      nomPaciente.trim() === "" ||
      especialidad.trim() === "" ||
      observaciones.trim() === "";

    if (!verfDatos) {
      const nFecha = formatearFechaHora(fechaHora);
      const compFechas = verifFecha(nFecha, listaCitas);
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
          const nueva = [...listaCitas, newCita];
          setListaCitas(nueva);
          console.log(nueva);
        }
        iniciarProceso()
        setEspecialidad("");
        setFechaHora(new Date());
        setIdPaciente("");
        setNomPaciente("");
        setObservaciones("");
        setContador(contador + 1);
      }
    } else {
      showAlert(
      "Error",
      "Rellene todos los cambios",
      "error",
      () =>{});
    }
    
    
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }
    const currentDate = selectedDate || fechaHora;

    if (mode === "date") {
      const hoy = new Date();
      const f1 = new Date(currentDate).setHours(0, 0, 0, 0);
      const f2 = new Date(hoy).setHours(0, 0, 0, 0);

      if (f1 <= f2) {
        alert("No puedes seleccionar fechas pasadas o de hoy");
        setShow(false);
        
        return;
      }
      setFechaHora(currentDate);
      setMode("time"); // luego pide la hora
      setShow(true);
    } else {
      const hora = currentDate.getHours();
      if (hora < 8 || hora >= 17) {
        alert("Solo puedes seleccionar entre 8:00 AM y 5:00 PM");
        setShow(false);
        return;
      }
      setFechaHora(currentDate);
      setShow(false); //  termina
    }
  };

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

  const verifFecha = (fecha: string, lista: any) => {
    if (!lista) return false;
    
    const newDate = fecha;
    for (let i = 0; i < lista.length; i++) {
      if (newDate === lista[i].fechaHora) {
        console.log('1')
        return true;
      }
    }
    return false;
  };

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "error" as "error" | "success",
    onConfirm: () => {},
  });

  const showAlert = (
    title: string,
    message: string,
    type: "error" | "success",
    onConfirm: () => void = () => {},
  ) => {
    setAlertConfig({ title, message, type, onConfirm });
    setAlertVisible(true);
  };

  const handleSave = () => {
    
    
    return (router.push({
      pathname: "/citas",
      params: { lista: JSON.stringify(listaCitas) }}))
    
  };

  const formatearFechaHora = (fecha: Date) => {
    return new Date(fecha).toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
          router.replace({
            pathname: "/",
            params: {
              lista: JSON.stringify(listaCitas),
            },
          })}
          >
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Nueva Cita</Text>
          <Text style={styles.subtitle}>Ingresa los datos del paciente</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Nombre del Paciente *</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#94a3b8"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={nomPaciente}
              onChangeText={setNomPaciente}
              placeholder="Ej. Juan Pérez"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <Text style={styles.label}>Documento *</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="id-card-outline"
              size={20}
              color="#94a3b8"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={idPaciente}
              onChangeText={setIdPaciente}
              placeholder="Ej. 123456789"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Especialidad *</Text>
          <View style={styles.pickerContainer}>
            <Ionicons
              name="medkit-outline"
              size={20}
              color="#94a3b8"
              style={styles.pickerIcon}
            />
            <Picker
              selectedValue={especialidad}
              onValueChange={(itemValue) => setEspecialidad(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione especialidad" value="" />
              <Picker.Item label="Medicina General" value="Medicina General" />
              <Picker.Item label="Odontología" value="Odontología" />
              <Picker.Item label="Pediatría" value="Pediatría" />
            </Picker>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Fecha y hora *</Text>
              <View>
                <Pressable
                  onPress={() => {
                    setShow(true);
                    setMode("date");
                  }}
                  style={[styles.inputContainer, { width: "100%" }]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color="#94a3b8"
                    style={styles.icon}
                  />
                  <Text style={styles.input}>
                    {formatearFechaHora(fechaHora)}
                  </Text>
                </Pressable>
                {show && (
                  <DateTimePicker
                    value={fechaHora}
                    mode={Platform.OS === "ios" ? "datetime" : mode}
                    display="compact"
                    onChange={onChange}
                  />
                )}
              </View>
            </View>
          </View>

          <Text style={styles.label}>Observaciones</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={observaciones}
              onChangeText={setObservaciones}
              placeholder="Síntomas, notas adicionales..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
        <View style={{flexDirection:'row',gap:'6',justifyContent:'center'}}>

        
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={()=>{guardar()}}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Confirmar Cita</Text>
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color="#ffffff"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => {
          setAlertVisible(false);
          alertConfig.onConfirm();
        }}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <View
              style={[
                styles.alertIconContainer,
                {
                  backgroundColor:
                    alertConfig.type === "error" ? "#fef2f2" : "#ecfdf5",
                },
              ]}
            >
              <Ionicons
                name={
                  alertConfig.type === "error"
                    ? "warning-outline"
                    : "checkmark-circle-outline"
                }
                size={40}
                color={alertConfig.type === "error" ? "#EF4444" : "#10B981"}
              />
            </View>
            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage}>{alertConfig.message}</Text>
            <TouchableOpacity
              style={[
                styles.alertButton,
                {
                  backgroundColor:
                    alertConfig.type === "error" ? "#EF4444" : "#10B981",
                },
              ]}
              onPress={() => {
                setAlertVisible(false);
                alertConfig.onConfirm();
              }}
            >
              <Text style={styles.alertButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerRow: {
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 6,
    fontWeight: "500",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    marginBottom: 25,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    marginBottom: 20,
    paddingHorizontal: 14,
  },
  textAreaContainer: {
    alignItems: "flex-start",
    paddingVertical: 14,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1e293b",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
    paddingVertical: 0,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    marginBottom: 20,
    paddingLeft: 14,
    overflow: "hidden",
  },
  pickerIcon: {
    marginRight: 2,
  },
  picker: {
    flex: 1,
    color: "#1e293b",
  },
  row: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
  },
  spacer: {
    width: 16,
  },
  buttonPrimary: {
    backgroundColor: "#4F46E5",
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    flex:1
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  alertOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.65)",
  },
  alertBox: {
    width: "85%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  alertIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 10,
    textAlign: "center",
  },
  alertMessage: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  alertButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  alertButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
