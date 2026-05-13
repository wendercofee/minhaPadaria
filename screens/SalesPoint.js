import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  DataTable,
  Searchbar
} from 'react-native-paper';

import {
  getAllProducts,
  updateProductQuantity,
  insertSale
} from '../database/database';

export default function SalesPoint() {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  // =========================
  // CARREGAR PRODUTOS
  // =========================
  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Erro ao carregar produtos');
    }
  };

  // =========================
  // ADICIONAR AO CARRINHO
  // =========================
  const handleAddToCart = (product) => {

    const qty = parseInt(quantity || '1');

    if (qty <= 0) {
      Alert.alert('Erro', 'Quantidade inválida');
      return;
    }

    if (qty > product.quantidade) {
      Alert.alert('Erro', 'Estoque insuficiente');
      return;
    }

    const existingIndex = cart.findIndex(
      item => item.product.id === product.id
    );

    let newCart = [...cart];

    if (existingIndex >= 0) {
      newCart[existingIndex].quantity += qty;
    } else {
      newCart.push({
        product,
        quantity: qty
      });
    }

    setCart(newCart);
    setQuantity('');
  };

  // =========================
  // REMOVER ITEM DO CARRINHO
  // =========================
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // =========================
  // FINALIZAR VENDA
  // =========================
  const handleProcessSale = async () => {

    if (cart.length === 0) {
      Alert.alert('Erro', 'Carrinho vazio');
      return;
    }

    try {

      for (const item of cart) {

        const sale = {
          product_id: item.product.id,
          quantity: item.quantity,
          sale_price: item.product.preco_venda,
        };

        const saleId = await insertSale(sale);

        if (!saleId) {
          throw new Error('Erro ao inserir venda');
        }

        const success = await updateProductQuantity(
          item.product.id,
          item.quantity
        );

        if (!success) {
          throw new Error('Erro ao atualizar estoque');
        }
      }

      Alert.alert('Sucesso', 'Venda realizada com sucesso!');

      setCart([]);
      loadProducts();

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Erro ao processar venda');
    }
  };
  const totalSale = cart.reduce((total, item) => {

    return total + (
      item.product.preco_venda * item.quantity
    );

  }, 0);
  // =========================
  // RENDER
  // =========================
  return (
    <ScrollView style={styles.container}>

      {/* PRODUTOS */}
      <Card style={styles.card}>
        <Card.Title title="Ponto de Venda" />
        <Card.Content>

          <Searchbar
            placeholder="Buscar produto..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />

          <TextInput
            label="Quantidade"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
          />

          {filteredProducts.length > 0 ? (
            <DataTable>

              <DataTable.Header>
                <DataTable.Title>Produto</DataTable.Title>
                <DataTable.Title numeric>Preço</DataTable.Title>
                <DataTable.Title numeric>Estoque</DataTable.Title>
              </DataTable.Header>

              {filteredProducts.map((item) => (
                <DataTable.Row
                  key={item.id}
                  onPress={() => handleAddToCart(item)}
                >
                  <DataTable.Cell>{item.name}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    R$ {item.preco_venda.toFixed(2)}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    {item.quantidade}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

            </DataTable>
          ) : (
            <Text style={styles.noResults}>
              Nenhum produto encontrado
            </Text>
          )}

        </Card.Content>
      </Card>

      {/* CARRINHO */}
      {cart.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Carrinho" />
          <Card.Content>

            {cart.map((item) => (
              <View
                key={item.product.id}
                style={styles.cartItem}
              >
                <Text>
                  {item.product.name} - {item.quantity}x
                </Text>
                <Text>
                  R$ {(item.product.preco_venda * item.quantity).toFixed(2)}
                </Text>
                <Button
                  onPress={() => removeFromCart(item.product.id)}
                >
                  Remover
                </Button>
              </View>
            ))}
            <Text style={styles.totalText}>
              Total da Venda: R$ {totalSale.toFixed(2)}
            </Text>
            <Button
              mode="contained"
              onPress={handleProcessSale}
              style={styles.button}
            >
              Confirmar Venda
            </Button>

          </Card.Content>
        </Card>
      )}

    </ScrollView>
  );
}

// =========================
// ESTILOS
// =========================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },

  card: {
    marginBottom: 16,
  },

  searchBar: {
    marginBottom: 16,
  },

  input: {
    marginBottom: 10,
  },

  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  button: {
    marginTop: 10,
  },

  noResults: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },

  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 16,
    marginBottom: 10,
  },

});