import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initDatabase } from './database/database';
import LoginScreen from './screens/LoginScreen';
import OwnerDashboard from './screens/OwnerDashboard';
import EmployeeDashboard from './screens/EmployeeDashboard';
import ProductRegistration from './screens/ProductRegistration';
import SalesPoint from './screens/SalesPoint';
import MonthlyReport from './screens/MonthlyReport';



const Stack = createStackNavigator();

export default function App() {

  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    const initialize = async () => {

      try {

        await initDatabase();

        setDbReady(true);

      } catch (err) {

        console.log(err);

        setError(err.message);

      }

    };

    initialize();

  }, []);

  if (error) {

    return (
      <View style={styles.errorContainer}>

        <Text style={styles.errorTitle}>
          Erro ao inicializar
        </Text>

        <Text style={styles.errorMessage}>
          {error}
        </Text>

      </View>
    );

  }

  if (!dbReady) {

    return (
      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#6200ea"
        />

        <Text style={styles.loadingText}>
          Carregando banco de dados...
        </Text>

      </View>
    );

  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6200ea',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          /> 
          <Stack.Screen 
            name="OwnerDashboard" 
            component={OwnerDashboard} 
            options={{ title: 'Painel do Dono' }}
          />
          <Stack.Screen 
            name="EmployeeDashboard" 
            component={EmployeeDashboard} 
            options={{ title: 'Painel do Funcionário' }}
          />
          <Stack.Screen 
            name="ProductRegistration" 
            component={ProductRegistration} 
            options={{ title: 'Cadastro de Produto' }}
          />
          <Stack.Screen 
            name="SalesPoint" 
            component={SalesPoint} 
            options={{ title: 'Ponto de Venda' }}
          />
          <Stack.Screen 
            name="MonthlyReport" 
            component={MonthlyReport} 
            options={{ title: 'Relatório Mensal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffebee',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: '#c62828',
  },
});
