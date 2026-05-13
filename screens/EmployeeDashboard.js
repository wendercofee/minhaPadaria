import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function EmployeeDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Bem-vindo ao Sistema" />
        <Card.Content>
          <Text style={styles.welcomeText}>
            Como funcionário, você tem acesso apenas ao Ponto de Venda e à lista de preços.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Funções Disponíveis" />
        <Card.Content>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('SalesPoint')}
            style={styles.menuButton}
            icon="cart"
          >
            Ponto de Venda
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
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  menuButton: {
    marginVertical: 8,
  },
});