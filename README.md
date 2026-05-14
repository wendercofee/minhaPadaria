# Minha Padaria

Um aplicativo de gerenciamento para padarias desenvolvido em React Native. Este sistema permite controlar produtos, realizar vendas, gerenciar estoque e acompanhar relatórios financeiros.

## 📱 Funcionalidades

### Para Donos:
- **Dashboard** com resumo de vendas diárias e alertas de estoque
- **Cadastro de Produtos** para adicionar e editar produtos
- **Ponto de Venda** para realizar vendas
- **Relatórios Mensais** com faturamento e lucro

### Para Funcionários:
- **Ponto de Venda** para realizar vendas (acesso restrito)

## 📁 Estrutura do Projeto

```
minhaPadaria/
├── App.js                 # Componente principal da aplicação
├── database/
│   └── database.js        # Funções de acesso ao banco de dados SQLite
├── screens/
│   ├── LoginScreen.js     # Tela de login
│   ├── OwnerDashboard.js  # Painel do dono
│   ├── EmployeeDashboard.js # Painel do funcionário
│   ├── ProductRegistration.js # Cadastro de produtos
│   ├── SalesPoint.js      # Ponto de venda
│   └── MonthlyReport.js   # Relatórios mensais
└── assets/                # Recursos como ícones e imagens
```

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma para desenvolvimento
- **SQLite** - Banco de dados local
- **React Navigation** - Navegação entre telas
- **React Native Paper** - Componentes de interface

## 📦 Instalação

1. **Pré-requisitos**
   - Node.js (versão 14 ou superior)
   - npm ou yarn
   - Expo CLI (`npm install -g expo-cli`)

2. **Instalação das dependências**
   ```bash
   npm install
   ```

3. **Executando o aplicativo**
   ```bash
   # Para iniciar o aplicativo em modo de desenvolvimento
   expo start
   
   # Para executar no Android
   expo start --android
   
   # Para executar no iOS
   expo start --ios
   ```

## 🔧 Usuários Padrão

O sistema possui dois usuários pré-configurados para testes:

- **Dono da Padaria**:
  - Usuário: `admin`
  - Senha: `admin123`

- **Funcionário**:
  - Usuário: `funcionario`
  - Senha: `func123`

## 📊 Banco de Dados

O aplicativo utiliza SQLite como banco de dados local com as seguintes tabelas:

- `users` - Usuários do sistema (dono e funcionários)
- `products` - Produtos da padaria
- `sales` - Registro de vendas

## 🛠️ Desenvolvimento

### Estrutura de Componentes

1. **App.js** - Componente raiz que configura a navegação e inicializa o banco de dados
2. **Telas (screens/)** - Componentes para cada funcionalidade específica
3. **Banco de Dados (database/)** - Funções para interação com SQLite

### Padrões de Código

- Funções assíncronas para operações de banco de dados
- Componentes funcionais do React com hooks
- Tratamento de erros em todas as operações críticas
- Comentários em português para facilitar manutenção

## 📈 Funcionalidades Detalhadas

### Controle de Estoque
- Cadastro de produtos com nome, preço de custo, preço de venda e quantidade
- Alerta automático quando o estoque está abaixo do mínimo
- Atualização automática de estoque após vendas

### Ponto de Venda
- Busca de produtos por nome
- Adição de produtos ao carrinho de compras
- Cálculo automático do total da venda
- Registro de vendas com data e hora

### Relatórios
- Relatório mensal com faturamento e lucro
- Agrupamento de dados por mês
- Base para cálculo de Imposto de Renda

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é parte de um trabalho acadêmico e não possui licença específica.

## 📞 Contato

Desenvolvido como parte da disciplina de Programação para Dispositivos Móveis em Android - 2026.1

Instituição: Universidade Estácio de Sá