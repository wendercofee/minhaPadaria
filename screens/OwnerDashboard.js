import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Card, Text, Badge, Divider } from 'react-native-paper';
import { getDailySalesSummary, getLowStockProducts } from '../database/database';

/**
 * Painel do dono da padaria
 * Exibe resumo das vendas do dia, alertas de estoque e menu de navegação
 * @param {Object} navigation - Objeto de navegação do React Navigation
 */
export default function OwnerDashboard({ navigation }) {
  // Estados para armazenar os dados do dashboard
  const [dailySummary, setDailySummary] = useState({ total_revenue: 0, total_profit: 0 });
  const [lowStockCount, setLowStockCount] = useState(0);

  // Carrega os dados do dashboard ao montar o componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Carrega os dados do dashboard do banco de dados
   * Inclui resumo de vendas do dia e produtos com estoque baixo
   */
  const loadDashboardData = async () => {
    try {
      // Carrega dados em paralelo para melhor performance
      const [summary, lowStockProducts] = await Promise.all([
        getDailySalesSummary(),
        getLowStockProducts()
      ]);

      setDailySummary(summary);
      setLowStockCount(lowStockProducts.length);

    } catch (error) {
      // Trata erros durante o carregamento dos dados
      console.log(error);

      Alert.alert(
        'Erro',
        'Erro ao carregar dados do dashboard'
      );

    }
  
  };

  return (
    <View style={styles.container}>
      {/* Card com resumo das vendas do dia */}
      <Card style={styles.card}>
        <Card.Title title="Resumo do Dia" />
        <Card.Content>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Faturamento:</Text>
            <Text style={styles.summaryValue}>R$ {dailySummary.total_revenue != null && !isNaN(Number(dailySummary.total_revenue)) ? Number(dailySummary.total_revenue).toFixed(2) : '0.00'}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Lucro:</Text>
            <Text style={[styles.summaryValue, { color: dailySummary.total_profit >= 0 ? 'green' : 'red' }]}>
              R$ {dailySummary.total_profit != null && !isNaN(Number(dailySummary.total_profit)) ? Number(dailySummary.total_profit).toFixed(2) : '0.00'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Card de alerta de estoque baixo (exibido apenas quando há produtos com estoque baixo) */}
      {lowStockCount > 0 && (
        <Card style={[styles.card, styles.alertCard]}>
          <Card.Title 
            title="Alerta de Estoque" 
            left={() => <Badge style={{ backgroundColor: 'red' }}>{lowStockCount}</Badge>}
          />
          <Card.Content>
            <Text style={styles.alertText}>
              Você tem {lowStockCount} produto(s) com estoque abaixo do mínimo!
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('ProductRegistration')}
              style={styles.alertButton}
            >
              Ver Produtos
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Card com menu de navegação principal */}
      <Card style={styles.card}>
        <Card.Title title="Menu Principal" />
        <Card.Content>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('ProductRegistration')}
            style={styles.menuButton}
            icon="plus-circle"
          >
            Cadastrar Produto
          </Button>
          
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('SalesPoint')}
            style={styles.menuButton}
            icon="cart"
          >
            Ponto de Venda
          </Button>
          
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('MonthlyReport')}
            style={styles.menuButton}
            icon="chart-bar"
          >
            Relatório Mensal
          </Button>
        </Card.Content>
      </Card>
    </View>
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  alertCard: {
    backgroundColor: '#ffebee',
  },
  alertText: {
    fontSize: 14,
    marginBottom: 12,
    color: '#c62828',
  },
  alertButton: {
    borderColor: '#c62828',
  },
  menuButton: {
    marginVertical: 8,
  },
});