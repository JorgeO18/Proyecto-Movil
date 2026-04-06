import React, { useState,useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// flatlist es una lista que se puede desplazar
//safeAreaView es un componente que se asegura de que la pantalla sea visible(Evita zonas peligrosas (notch, bordes))
// statusbar es la barra que muestra la hora, la bateria, la señal, etc

// Datos fijos o quemados solo para diseño


export default function HomeScreen() {
  type Cita = {
    idCita: number;
    idPaciente: string;
    nomPaciente: string;
    especialidad: string;
    fechaHora: string;
    estado: string;
    observaciones: string;
  };

  //const { lista } = useLocalSearchParams();
  const router = useRouter();
  const { lista } = useLocalSearchParams();
  const parsedLista = useMemo(() => {
    return lista ? JSON.parse(lista as string) : [];
  }, [lista]);
  const [filtro, setFiltro] = useState("");
  

  const [listaFiltrada,setListaFiltrada] = useState<Cita[]>([]);
  useEffect(() => {
  if (lista) {
    setListaFiltrada(JSON.parse(lista as string));
  }
}, [lista]);
  useEffect(() => {
  setListaFiltrada(parsedLista);
}, [parsedLista]);


  const filtrar = async(especialidad :string)=>{
    
    if (especialidad === "") {
      setListaFiltrada(parsedLista);
      
    } else {
      const filtrados = parsedLista.filter((item:any) => item.especialidad === especialidad);
      setListaFiltrada(filtrados);
    }
  }








  

  

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
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backButtonTop} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>SaludPlus</Text>
        <Text style={styles.headerSubtitle}>Tus citas médicas, organizadas</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Especialidad</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filtro}
              onValueChange={(itemValue) => {setFiltro(itemValue);filtrar(itemValue);}}
              style={styles.picker}
            >
              <Picker.Item label="Todas las especialidades" value="" />
              <Picker.Item label="Medicina General" value="Medicina General" />
              <Picker.Item label="Odontología" value="Odontología" />
              <Picker.Item label="Pediatría" value="Pediatría" />
            </Picker>
          </View>
        </View>

        <FlatList
          data={listaFiltrada}
          keyExtractor={(item:Cita)=>item.idCita.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color="#cbd5e1" />
              <Text style={styles.emptyText}>No hay citas registradas</Text>
              <Text style={styles.emptySubtext}>Agrega una nueva pulsando el botón +</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.citaCard}
              activeOpacity={0.8}
              onPress={() => router.push({pathname:`/detalle/${item.idCita}` as any,params:{lista}})}
            >
              <View style={[styles.cardBorder, { backgroundColor: getSpecialtyColor(item.especialidad) }]} />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.citaName}>{item.nomPaciente}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </View>
                <View style={styles.cardDetail}>
                  <Ionicons name={getSpecialtyIcon(item.especialidad) as any} size={16} color={getSpecialtyColor(item.especialidad)} />
                  <Text style={[styles.citaSpecialty, { color: getSpecialtyColor(item.especialidad) }]}>{item.especialidad}</Text>
                </View>
                <View style={styles.cardTime}>
                  <Ionicons name="time-outline" size={16} color="#64748b" />
                  <Text style={styles.citaDate}>{item.fechaHora}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/agendar')}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerTopRow: {
    marginBottom: 15,
  },
  backButtonTop: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#E0E7FF',
    marginTop: 4,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 6,
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  picker: {
    color: '#334155',
  },
  citaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  cardBorder: {
    width: 6,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  citaName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1e293b',
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  citaSpecialty: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  cardTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  citaDate: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#4F46E5',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
});
