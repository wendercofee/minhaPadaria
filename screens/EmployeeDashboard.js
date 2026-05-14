import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

/**
 * Painel do funcionário da padaria
 * Exibe informações de boas-vindas e fornece acesso ao ponto de venda
 * Funcionários têm acesso limitado comparado ao dono da padaria
 * @param {Object} navigation - Objeto de navegação do React Navigation
 */
export default function EmployeeDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Card de boas-vindas com informações sobre permissões do funcionário */}
      <Card style={styles.card}>
        <Card.Title title="Bem-vindo ao Sistema" />
        <Card.Content>
          <Text style={styles.welcomeText}>
            Como funcionário, você tem acesso apenas ao Ponto de Venda e à lista de preços.
          </Text>
        </Card.Content>
      </Card>

      {/* Card com as funções disponíveis para funcionários */}
      <Card style={styles.card}>
        <Card.Title title="Funções Disponíveis" />
        <Card.Content>
          {/* Botão para acessar o ponto de venda */}
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

/**
 * Estilos para os componentes da tela do painel do funcionário
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
  
  // Estilo para o texto de boas-vindas
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // Estilo para os botões do menu
  menuButton: {
    marginVertical: 8,
  },
});