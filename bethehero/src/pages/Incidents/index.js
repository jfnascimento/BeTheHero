import React, {useState, useEffect} from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, SafeAreaView, ScrollView, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

import api from '../services/api';

import logoImg from '../../assets/logo.png';

export default function Incidents() {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);


  function navigateToDetail(incident) {
    navigation.navigate('Details', {incident});
  };

  async function loadIncidents() {

    if(loading) {
      return;
    }

    
    if(total < incidents.length) {
      return;
    }

    setLoading(true);
    const response = await api.get('incidents', {
      params: {page}
    });

    setIncidents([...response.data, ...incidents]);
    setTotal(response.headers['x-total-count']);
    setPage(page + 1)
    setLoading(false);

  }

  useEffect(() => {
    loadIncidents();
  }, []); 

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total de <Text style={styles.headerTextBod}>{total} casos</Text>.
        </Text>
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={()=> loadIncidents()}
      >
      <Text style={styles.title}>Bém-vindo</Text>
      <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>
      
      <View style={styles.incidentList}>
        {incidents.map((incident, key) => (
          <View style={styles.incident} key={key}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>
            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>
            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentValue}>
              {
                Intl.NumberFormat('pt-BR',
                  {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(incident.value)}</Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigateToDetail(incident)}
            >
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={17} color="#e02041" />
            </TouchableOpacity>
          </View>))}
      </View>
      </ScrollView>

    </View>

    
  );
}