import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DetalleCitaScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const { lista } = useLocalSearchParams();
  const { id } = useLocalSearchParams();
  const parsedLista = lista ? JSON.parse(lista as string) : [];
  const [listaState, setListaState] = useState<any[]>(parsedLista);

  // Objeto fijo para propósito de maquetación visual (Mockup)
  const cita = listaState.find((item: any) => item.idCita === Number(id));

  const cambiarEstado = (id: number) => {
    const nuevaLista = listaState.map((item) => {
      if (item.idCita === id) {
        return {
          ...item,
          estado: item.estado === "Confirmada" ? "Cancelada" : "Confirmada",
        };
      }
      
      return item;
    });

    setListaState(nuevaLista);
  };

  const handleCancelar = () => {
    // No hay base de datos. Solo ocultamos el alerta de confirmación y volvemos visualmente.
    setModalVisible(false);
    router.back();
  };

  const getSpecialtyColor = (spec: string) => {
    switch (spec) {
      case "Medicina General":
        return "#3b82f6";
      case "Odontología":
        return "#10b981";
      case "Pediatría":
        return "#f59e0b";
      default:
        return "#6366f1";
    }
  };

  const getSpecialtyIcon = (spec: string) => {
    switch (spec) {
      case "Medicina General":
        return "medical";
      case "Odontología":
        return "happy";
      case "Pediatría":
        return "color-palette";
      default:
        return "medkit";
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          router.replace({
            pathname: "/citas",
            params: {
              lista: JSON.stringify(listaState),
            },
          })
        }
      >
        <Ionicons name="arrow-back" size={24} color="#1e293b" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getSpecialtyColor(cita.especialidad) + "20" },
          ]}
        >
          <Ionicons
            name={getSpecialtyIcon(cita.specialty) as any}
            size={40}
            color={getSpecialtyColor(cita.especialidad)}
          />
        </View>
        <Text style={styles.title}>{cita.nomPaciente}</Text>
        <Text
          style={[
            styles.specialtyBadge,
            {
              color: getSpecialtyColor(cita.especialidad),
              backgroundColor: getSpecialtyColor(cita.especialidad) + "15",
            },
          ]}
        >
          {cita.especialidad}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.detailRow}>
          <View style={styles.iconBox}>
            <Ionicons name="id-card-outline" size={18} color="#64748b" />
          </View>
          <View>
            <Text style={styles.label}>Documento</Text>
            <Text style={styles.text}>{cita.idPaciente}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <View style={styles.iconBox}>
            <Ionicons name="calendar-outline" size={18} color="#64748b" />
          </View>
          <View>
            <Text style={styles.label}>Fecha y Hora</Text>
            <Text style={styles.text}>{cita.fechaHora}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <View style={styles.iconBox}>
            <Ionicons name="document-text-outline" size={18} color="#64748b" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Observaciones</Text>
            <Text style={styles.text}>{cita.observaciones}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <View style={styles.iconBox}>
            <Ionicons name="pricetag-outline" size={16} color="#64748b" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Estado</Text>
            <Text style={styles.text}>{cita.estado}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.buttonDanger}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons
            name="close-outline"
            size={20}
            color="#EF4444"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonDangerText}>Cancelar Cita</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning-outline" size={40} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>¿Cancelar Cita?</Text>
            <Text style={styles.modalText}>
              Esta seguro de cancelar la cita
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnCloseText}>Volver</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={() => {
                  cambiarEstado(Number(id));
                }}
              >
                <Text style={styles.modalBtnConfirmText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  backButton: {
    marginTop: 50,
    marginLeft: 20,
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
    alignItems: "center",
    marginTop: 15,
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  specialtyBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: "700",
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "600",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 18,
  },
  actionContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  buttonSecondary: {
    backgroundColor: "#4F46E5",
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  buttonDanger: {
    backgroundColor: "#fef2f2",
    borderWidth: 1.5,
    borderColor: "#fca5a5",
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDangerText: {
    color: "#EF4444",
    fontSize: 17,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#334155",
    marginTop: 15,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.65)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 28,
    padding: 30,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 10,
  },
  modalText: {
    textAlign: "center",
    fontSize: 16,
    color: "#64748b",
    lineHeight: 24,
    marginBottom: 28,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 14,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnClose: {
    backgroundColor: "#f1f5f9",
  },
  modalBtnConfirm: {
    backgroundColor: "#EF4444",
    elevation: 3,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalBtnCloseText: {
    color: "#475569",
    fontWeight: "700",
    fontSize: 16,
  },
  modalBtnConfirmText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});
