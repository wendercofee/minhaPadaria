import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Card, Text, Badge, Divider } from 'react-native-paper';
import { getDailySalesSummary, getLowStockProducts } from '../database/database';

export default function OwnerDashboard({ navigation }) {
  const [dailySummary, setDailySummary] = useState({ total_revenue: 0, total_profit: 0 });
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {

      const [summary, lowStockProducts] = await Promise.all([
        getDailySalesSummary(),
        getLowStockProducts()
      ]);

      setDailySummary(summary);
      setLowStockCount(lowStockProducts.length);

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Erro',
        'Erro ao carregar dados do dashboard'
      );

    }
  
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Resumo do Dia" />
        <Card.Content>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Faturamento:</Text>
            <Text style={styles.summaryValue}>R$ {dailySummary.total_revenue.toFixed(2)}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Lucro:</Text>
            <Text style={[styles.summaryValue, { color: dailySummary.total_profit >= 0 ? 'green' : 'red' }]}>
              R$ {dailySummary.total_profit.toFixed(2)}
            </Text>
          </View>
        </Card.Content>
      </Card>

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