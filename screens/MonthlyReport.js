import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, DataTable, Button } from 'react-native-paper';
import { getMonthlySales } from '../database/database';

export default function MonthlyReport() {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadMonthlyData();
  }, []);

  const loadMonthlyData = async () => {
    try {

      const data = await getMonthlySales();

      setMonthlyData(data);

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Erro',
        'Erro ao carregar vendas mensais'
      );

    }
 
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Relatório Mensal" />
        <Card.Content>
          <Text style={styles.subtitle}>Faturamento e Lucro por Mês</Text>
          
          {monthlyData.length > 0 ? (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Mês</DataTable.Title>
                <DataTable.Title numeric>Faturamento</DataTable.Title>
                <DataTable.Title numeric>Lucro</DataTable.Title>
              </DataTable.Header>

              {monthlyData.map((item) => (
                <DataTable.Row key={item.month}>
                  <DataTable.Cell>{item.month}</DataTable.Cell>
                  <DataTable.Cell numeric>R$ {parseFloat(item.revenue || 0).toFixed(2)}</DataTable.Cell>
                  <DataTable.Cell numeric>R$ {parseFloat(item.profit || 0).toFixed(2)}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          ) : (
            <Text style={styles.noData}>Nenhum dado disponível</Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.infoText}>
            Este relatório é a base para o cálculo do Imposto de Renda.
            O lucro líquido representa a diferença entre faturamento e custos.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  noData: {
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
    color: '#999',
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    lineHeight: 18,
  },
});