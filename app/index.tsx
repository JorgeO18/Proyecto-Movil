import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  const router = useRouter();
  const { lista } = useLocalSearchParams();

  // flatlist es una lista que se puede desplazar
  //safeAreaView Es un contenedor que asegura que tu contenido no quede pegado ni tapado por los bordes del celular.
  // statusbar es la barra que muestra la hora, la bateria, la señal, etc

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="medical" size={60} color="#4F46E5" />
          </View>
          <Text style={styles.title}>SaludPlus</Text>
          <Text style={styles.subtitle}>Gestor Médico Integral</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() =>
              router.push({
                pathname: "/citas",
                params: { lista: lista },
              })
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name="list"
              size={26}
              color="#ffffff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Consultar Citas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => router.push("/agendar")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="calendar-outline"
              size={26}
              color="#4F46E5"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonSecondaryText}>Agendar Nueva Cita</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    marginBottom: 25,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: "#64748b",
    marginTop: 6,
    fontWeight: "500",
  },
  buttonsContainer: {
    width: "100%",
    gap: 20,
  },
  buttonPrimary: {
    backgroundColor: "#4F46E5",
    paddingVertical: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonSecondary: {
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  buttonSecondaryText: {
    color: "#4F46E5",
    fontSize: 18,
    fontWeight: "700",
  },
});
