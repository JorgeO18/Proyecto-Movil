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
      <StatusBar barStyle="light-content" backgroundColor="#4338ca" />
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backButtonTop} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerBadge}>
            <Ionicons name="pulse" size={20} color="#4338ca" />
          </View>
        </View>
        <Text style={styles.headerTitle}>Citas</Text>
        <Text style={styles.headerSubtitle}>Gestiona tus próximas atenciones</Text>
      </View>

      <View style={styles.container}>
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

        <FlatList
          data={listaFiltrada}
          keyExtractor={(item:Cita)=>item.idCita.toString()}
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
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.citaCard}
              activeOpacity={0.8}
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

                <View style={styles.chevronContainer}>
                  <Ionicons name="chevron-forward" size={24} color="#cbd5e1" />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.replace({
            pathname: "/agendar",
            params: {
              lista: JSON.stringify(parsedLista),
            },
          })}
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 8,
    shadowColor: '#4338ca',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonTop: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    marginTop: 6,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  filterContainer: {
    marginBottom: 25,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pickerWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  picker: {
    color: '#1e293b',
    height: 55,
  },
  citaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f8fafc',
  },
  cardInner: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  citaName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  citaSpecialty: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  citaDate: {
    fontSize: 13,
    color: '#4338ca',
    marginLeft: 6,
    fontWeight: '700',
  },
  chevronContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#1e293b',
    fontWeight: '800',
  },
  emptySubtext: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    backgroundColor: '#4338ca',
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#4338ca',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});
