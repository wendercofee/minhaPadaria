import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Text, DataTable } from 'react-native-paper';
import { insertProduct, getAllProducts, updateProduct } from '../database/database';

/**
 * Tela de cadastro e gerenciamento de produtos
 * Permite cadastrar novos produtos, editar produtos existentes e visualizar a lista de produtos
 */
export default function ProductRegistration() {
  // Estados para armazenar os valores dos campos do formulário
  const [name, setName] = useState('');
  const [precoCusto, setPrecoCusto] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [estoqueMin, setEstoqueMin] = useState('');
  const [quantidade, setQuantidade] = useState('');
  
  // Estados para gerenciar a lista de produtos e o modo de edição
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  // Carrega a lista de produtos ao montar o componente
  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Carrega todos os produtos do banco de dados
   */
  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Erro',
        'Erro ao carregar produtos'
      );
    }
  };

  /**
   * Salva ou atualiza um produto no banco de dados
   * Se estiver em modo de edição, atualiza o produto existente
   * Caso contrário, cria um novo produto
   */
  const handleSaveProduct = async () => {
    // Validação de campos obrigatórios
    if (!name || !precoCusto || !precoVenda || !estoqueMin || !quantidade) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Prepara os dados do produto
    const product = {
      id: editingProductId,
      name,
      preco_custo: parseFloat(precoCusto),
      preco_venda: parseFloat(precoVenda),
      estoque_min: parseInt(estoqueMin),
      quantidade: parseInt(quantidade),
    };

    try {
      let success;

      // Determina se é uma atualização ou uma inserção
      if (editingProductId) {
        success = await updateProduct(product);
      } else {
        const id = await insertProduct(product);
        success = !!id;
      }

      if (success) {
        // Exibe mensagem de sucesso e limpa o formulário
        Alert.alert(
          'Sucesso',
          editingProductId
            ? 'Produto atualizado com sucesso!'
            : 'Produto cadastrado com sucesso!'
        );

        // Limpa o formulário
        setName('');
        setPrecoCusto('');
        setPrecoVenda('');
        setEstoqueMin('');
        setQuantidade('');
        setEditingProductId(null);

        // Recarrega a lista de produtos
        loadProducts();
      } else {
        Alert.alert('Erro', 'Operação não realizada');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Erro ao salvar produto');
    }
  };

  /**
   * Preenche o formulário com os dados de um produto para edição
   * @param {Object} item - Objeto contendo os dados do produto a ser editado
   */
  const handleEdit = (item) => {
    setEditingProductId(item.id);
    setName(item.name);
    setPrecoCusto(String(item.preco_custo));
    setPrecoVenda(String(item.preco_venda));
    setEstoqueMin(String(item.estoque_min));
    setQuantidade(String(item.quantidade));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Formulário de cadastro/edição de produtos */}
      <Card style={styles.card}>
        <Card.Title title="Cadastro de Produto" />
        <Card.Content>
          <TextInput
            label="Nome do Produto"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            label="Preço de Custo (R$)"
            value={precoCusto}
            onChangeText={setPrecoCusto}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Preço de Venda (R$)"
            value={precoVenda}
            onChangeText={setPrecoVenda}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Estoque Mínimo"
            value={estoqueMin}
            onChangeText={setEstoqueMin}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Quantidade em Estoque"
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button 
            mode="contained" 
            onPress={handleSaveProduct}
            style={styles.button}
          >
            {editingProductId ? 'Atualizar Produto' : 'Cadastrar Produto'}
          </Button>
        </Card.Content>
      </Card>

      {/* Lista de produtos cadastrados */}
      {products.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Produtos Cadastrados" />
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Produto</DataTable.Title>
              <DataTable.Title numeric>Custo</DataTable.Title>
              <DataTable.Title numeric>Venda</DataTable.Title>
              <DataTable.Title numeric>Estoque</DataTable.Title>
              <DataTable.Title>Atualizar</DataTable.Title>
            </DataTable.Header>

            {products.map((item) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell>{item.name}</DataTable.Cell>
                <DataTable.Cell numeric>R$ {item.preco_custo.toFixed(2)}</DataTable.Cell>
                <DataTable.Cell numeric>R$ {item.preco_venda.toFixed(2)}</DataTable.Cell>
                <DataTable.Cell numeric>{item.quantidade}</DataTable.Cell>
                <DataTable.Cell>
                  <Button onPress={() => handleEdit(item)}> Editar </Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card>
      )}
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
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
    padding: 8,
  },
});