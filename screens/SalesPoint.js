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

/**
 * Tela de ponto de venda
 * Permite realizar vendas, buscar produtos, adicionar itens ao carrinho e finalizar compras
 */
export default function SalesPoint() {
  // Estados para gerenciar produtos, busca, quantidade e carrinho de compras
  const [products, setProducts] = useState([]); // Todos os produtos
  const [filteredProducts, setFilteredProducts] = useState([]); // Produtos filtrados pela busca
  const [searchQuery, setSearchQuery] = useState(''); // Termo de busca
  const [quantity, setQuantity] = useState(''); // Quantidade a ser adicionada ao carrinho
  const [cart, setCart] = useState([]); // Itens no carrinho de compras

  /**
   * Efeito para carregar produtos ao montar o componente
   */
  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Efeito para filtrar produtos com base no termo de busca
   */
  useEffect(() => {
    if (searchQuery) {
      // Filtra produtos cujo nome contém o termo de busca (case insensitive)
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      // Se não houver busca, mostra todos os produtos
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  /**
   * Carrega todos os produtos do banco de dados
   */
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

  /**
   * Adiciona um produto ao carrinho de compras
   * @param {Object} product - Produto a ser adicionado ao carrinho
   */
  const handleAddToCart = (product) => {
    // Converte a quantidade para número (padrão é 1 se não especificado)
    const qty = parseInt(quantity || '1');

    // Valida a quantidade
    if (qty <= 0) {
      Alert.alert('Erro', 'Quantidade inválida');
      return;
    }

    // Verifica se há estoque suficiente
    if (qty > product.quantidade) {
      Alert.alert('Erro', 'Estoque insuficiente');
      return;
    }

    // Verifica se o produto já está no carrinho
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id
    );

    // Cria uma cópia do carrinho para atualização
    let newCart = [...cart];

    if (existingIndex >= 0) {
      // Se o produto já está no carrinho, apenas incrementa a quantidade
      newCart[existingIndex].quantity += qty;
    } else {
      // Se é um novo produto, adiciona ao carrinho
      newCart.push({
        product,
        quantity: qty
      });
    }

    // Atualiza o estado do carrinho e limpa o campo de quantidade
    setCart(newCart);
    setQuantity('');
  };

  /**
   * Remove um item do carrinho de compras
   * @param {number} productId - ID do produto a ser removido
   */
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  /**
   * Processa a venda, registrando no banco de dados e atualizando o estoque
   */
  const handleProcessSale = async () => {
    // Verifica se o carrinho está vazio
    if (cart.length === 0) {
      Alert.alert('Erro', 'Carrinho vazio');
      return;
    }

    try {
      // Processa cada item do carrinho
      for (const item of cart) {
        // Prepara os dados da venda
        const sale = {
          product_id: item.product.id,
          quantity: item.quantity,
          sale_price: item.product.preco_venda,
        };

        // Insere a venda no banco de dados
        const saleId = await insertSale(sale);

        if (!saleId) {
          throw new Error('Erro ao inserir venda');
        }

        // Atualiza a quantidade em estoque do produto
        const success = await updateProductQuantity(
          item.product.id,
          item.quantity
        );

        if (!success) {
          throw new Error('Erro ao atualizar estoque');
        }
      }

      // Exibe mensagem de sucesso e limpa o carrinho
      Alert.alert('Sucesso', 'Venda realizada com sucesso!');

      setCart([]); // Limpa o carrinho
      loadProducts(); // Recarrega os produtos para atualizar estoques

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Erro ao processar venda');
    }
  };

  /**
   * Calcula o valor total da venda
   */
  const totalSale = cart.reduce((total, item) => {
    return total + (item.product.preco_venda * item.quantity);
  }, 0);

  return (
    <ScrollView style={styles.container}>
      {/* Seção de produtos para venda */}
      <Card style={styles.card}>
        <Card.Title title="Ponto de Venda" />
        <Card.Content>
          {/* Barra de busca para filtrar produtos */}
          <Searchbar
            placeholder="Buscar produto..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />

          {/* Campo para definir quantidade ao adicionar produto */}
          <TextInput
            label="Quantidade"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Lista de produtos disponíveis */}
          {filteredProducts.length > 0 ? (
            <DataTable>
              {/* Cabeçalho da tabela de produtos */}
              <DataTable.Header>
                <DataTable.Title>Produto</DataTable.Title>
                <DataTable.Title numeric>Preço</DataTable.Title>
                <DataTable.Title numeric>Estoque</DataTable.Title>
              </DataTable.Header>

              {/* Linhas da tabela com os produtos */}
              {filteredProducts.map((item) => (
                <DataTable.Row
                  key={item.id}
                  onPress={() => handleAddToCart(item)} // Adiciona ao carrinho ao clicar
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

      {/* Seção do carrinho de compras (exibida apenas se houver itens) */}
      {cart.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Carrinho" />
          <Card.Content>
            {/* Lista de itens no carrinho */}
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
                {/* Botão para remover item do carrinho */}
                <Button
                  onPress={() => removeFromCart(item.product.id)}
                >
                  Remover
                </Button>
              </View>
            ))}
            {/* Exibição do valor total da venda */}
            <Text style={styles.totalText}>
              Total da Venda: R$ {totalSale.toFixed(2)}
            </Text>
            {/* Botão para confirmar e finalizar a venda */}
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

/**
 * Estilos para os componentes da tela de ponto de venda
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

  // Estilo para a barra de busca
  searchBar: {
    marginBottom: 16,
  },

  // Estilo para os campos de entrada
  input: {
    marginBottom: 10,
  },

  // Estilo para os itens do carrinho
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  // Estilo para os botões
  button: {
    marginTop: 10,
  },

  // Estilo para mensagem quando não há resultados
  noResults: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },

  // Estilo para o texto do total da venda
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 16,
    marginBottom: 10,
  },

});