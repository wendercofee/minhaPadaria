import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, DataTable, Button } from 'react-native-paper';
import { getMonthlySales } from '../database/database';

/**
 * Tela de relatório mensal
 * Exibe um relatório com faturamento e lucro agrupados por mês
 * Utilizado para fins de controle financeiro e cálculo de impostos
 */
export default function MonthlyReport() {
  // Estado para armazenar os dados de vendas mensais
  const [monthlyData, setMonthlyData] = useState([]);

  /**
   * Efeito para carregar os dados do relatório ao montar o componente
   */
  useEffect(() => {
    loadMonthlyData();
  }, []);

  /**
   * Carrega os dados de vendas mensais do banco de dados
   * Os dados incluem faturamento e lucro agrupados por mês
   */
  const loadMonthlyData = async () => {
    try {
      // Obtém os dados de vendas mensais do banco de dados
      const data = await getMonthlySales();

      // Atualiza o estado com os dados obtidos
      setMonthlyData(data);

    } catch (error) {
      // Trata erros durante o carregamento dos dados
      console.log(error);

      // Exibe alerta em caso de erro (note: Alert precisa ser importado)
      Alert.alert(
        'Erro',
        'Erro ao carregar vendas mensais'
      );

    }
 
  };

  return (
    <ScrollView style={styles.container}>
      {/* Card principal com o relatório de vendas mensais */}
      <Card style={styles.card}>
        <Card.Title title="Relatório Mensal" />
        <Card.Content>
          <Text style={styles.subtitle}>Faturamento e Lucro por Mês</Text>
          
          {/* Tabela de dados (exibida apenas se houver dados) */}
          {monthlyData.length > 0 ? (
            <DataTable>
              {/* Cabeçalho da tabela */}
              <DataTable.Header>
                <DataTable.Title>Mês</DataTable.Title>
                <DataTable.Title numeric>Faturamento</DataTable.Title>
                <DataTable.Title numeric>Lucro</DataTable.Title>
              </DataTable.Header>

              {/* Linhas da tabela com os dados mensais */}
              {monthlyData.map((item) => (
                <DataTable.Row key={item.month}>
                  <DataTable.Cell>{item.month}</DataTable.Cell>
                  <DataTable.Cell numeric>R$ {parseFloat(item.revenue || 0).toFixed(2)}</DataTable.Cell>
                  <DataTable.Cell numeric>R$ {parseFloat(item.profit || 0).toFixed(2)}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          ) : (
            // Mensagem exibida quando não há dados disponíveis
            <Text style={styles.noData}>Nenhum dado disponível</Text>
          )}
        </Card.Content>
      </Card>

      {/* Card com informações adicionais sobre o relatório */}
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

/**
 * Estilos para os componentes da tela de relatório mensal
 */
const styles = StyleSheet.create({
  // Estilo para o container principal
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  
  // Estilo para os cards
  card: {
    marginBottom: 16,
  },
  
  // Estilo para o subtítulo
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  
  // Estilo para mensagem quando não há dados
  noData: {
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
    color: '#999',
  },
  
  // Estilo para o texto informativo
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    lineHeight: 18,
  },
});