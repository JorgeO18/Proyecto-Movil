import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditarScreen() {
  const router = useRouter();

  // Datos precargados visuales de mockup
  const [patientName, setPatientName] = useState('Ejemplo Visual');
  const [document, setDocument] = useState('123456789');
  const [specialty, setSpecialty] = useState('Odontología');
  const [date, setDate] = useState('10/05/2026');
  const [time, setTime] = useState('08:30');
  const [observations, setObservations] = useState('Esta vista es solo un prototipo visual que no requiere datos reales de fondo.');
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'error' as 'error' | 'success', onConfirm: () => {} });

  const showAlert = (title: string, message: string, type: 'error' | 'success', onConfirm: () => void = () => {}) => {
    setAlertConfig({ title, message, type, onConfirm });
    setAlertVisible(true);
  };

  const handleUpdate = () => {
    // Alerta visual indicando demostración sin almacenamiento
    showAlert('Demostración', 'Modo Maqueta Visual. Los datos mostrados arriba no fueron actualizados permanentemente.', 'success', () => router.back());
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Editar Cita</Text>
          <Text style={styles.subtitle}>Modifica la información visual del paciente</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Nombre del Paciente *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              value={patientName} 
              onChangeText={setPatientName} 
              placeholder="Ej. Juan Pérez"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <Text style={styles.label}>Documento *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="id-card-outline" size={20} color="#94a3b8" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              value={document} 
              onChangeText={setDocument} 
              placeholder="Ej. 123456789"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Especialidad *</Text>
          <View style={styles.pickerContainer}>
            <Ionicons name="medkit-outline" size={20} color="#94a3b8" style={styles.pickerIcon} />
            <Picker
              selectedValue={specialty}
              onValueChange={(itemValue) => setSpecialty(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Medicina General" value="Medicina General" />
              <Picker.Item label="Odontología" value="Odontología" />
              <Picker.Item label="Pediatría" value="Pediatría" />
            </Picker>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Fecha *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="calendar-outline" size={20} color="#94a3b8" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  value={date} 
                  onChangeText={setDate} 
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
            <View style={styles.spacer} />
            <View style={styles.col}>
              <Text style={styles.label}>Hora *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="time-outline" size={20} color="#94a3b8" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  value={time} 
                  onChangeText={setTime} 
                  placeholder="HH:MM"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          </View>

          <Text style={styles.label}>Observaciones</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={observations} 
              onChangeText={setObservations} 
              placeholder="Síntomas, notas adicionales..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.buttonPrimary} 
          onPress={handleUpdate}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Simular Actualización</Text>
          <Ionicons name="save-outline" size={22} color="#ffffff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
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
            <View style={[styles.alertIconContainer, { backgroundColor: alertConfig.type === 'error' ? '#fef2f2' : '#ecfdf5' }]}>
              <Ionicons 
                name={alertConfig.type === 'error' ? "warning-outline" : "checkmark-circle-outline"} 
                size={40} 
                color={alertConfig.type === 'error' ? "#EF4444" : "#10B981"} 
              />
            </View>
            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage}>{alertConfig.message}</Text>
            <TouchableOpacity 
              style={[styles.alertButton, { backgroundColor: alertConfig.type === 'error' ? '#EF4444' : '#10B981' }]} 
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
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerRow: {
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 6,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    marginBottom: 25,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    marginBottom: 20,
    paddingHorizontal: 14,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingVertical: 0,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    marginBottom: 20,
    paddingLeft: 14,
    overflow: 'hidden',
  },
  pickerIcon: {
    marginRight: 2,
  },
  picker: {
    flex: 1,
    color: '#1e293b',
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
  spacer: {
    width: 16,
  },
  buttonPrimary: {
    backgroundColor: '#4F46E5',
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  alertOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  alertBox: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  alertIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  alertButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  alertButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
