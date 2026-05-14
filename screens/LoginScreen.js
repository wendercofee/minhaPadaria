import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { authenticateUser } from '../database/database';

/**
 * Tela de login da aplicação
 * Permite que usuários façam login no sistema com diferentes perfis (dono ou funcionário)
 * @param {Object} navigation - Objeto de navegação do React Navigation
 */
export default function LoginScreen({ navigation }) {
  // Estados para armazenar os valores dos campos de entrada
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Função para lidar com o processo de login
   * Autentica o usuário e redireciona para o painel apropriado
   */
  const handleLogin = async () => {
    // Validação de campos obrigatórios
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      // Autenticação do usuário no banco de dados
      const user = await authenticateUser(username, password);
      setLoading(false)
      if (user) {
        // Redireciona para o painel apropriado com base no perfil do usuário
        if (user.role === 'DONO') {
          navigation.replace('OwnerDashboard');
        } else if (user.role === 'FUNCIONARIO') {
          navigation.replace('EmployeeDashboard');
        }
        
      } else {
        // Exibe mensagem de erro caso as credenciais sejam inválidas
        Alert.alert(
        'Erro',
        'Usuário ou senha incorretos'
        );
      }

    } catch (error) {
      // Trata erros durante o processo de autenticação
      console.log(error);
      setLoading(false);
      Alert.alert(
        'Erro',
        'Erro ao autenticar usuário'
      );
    }
 
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Padaria do Seu Zé" subtitle="Sistema de Gestão" />
        <Card.Content>
          <TextInput
            label="Usuário"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />
          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />
          <Button 
            mode="contained" 
            onPress={handleLogin} 
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Entrar
          </Button>
          
          <Text style={styles.infoText}>
            Usuário padrão: admin / admin123 (Dono){'\n'}
            Usuário padrão: funcionario / func123 (Funcionário)
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 16,
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
    padding: 8,
  },
  infoText: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
});