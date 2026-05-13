import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('bakery.db');

// Inicializa o banco
export const initDatabase = async () => {

    try {

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('DONO', 'FUNCIONARIO'))
            );

            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                preco_custo REAL NOT NULL,
                preco_venda REAL NOT NULL,
                estoque_min INTEGER NOT NULL,
                quantidade INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                sale_price REAL NOT NULL,
                sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id)
            );
        `);

        // Usuário admin padrão
        await db.runAsync(
            `INSERT OR IGNORE INTO users (username, password, role)
             VALUES (?, ?, ?);`,
            ['admin', 'admin123', 'DONO']
        );

        // Usuário funcionário padrão
        await db.runAsync(
            `INSERT OR IGNORE INTO users (username, password, role)
             VALUES (?, ?, ?);`,
            ['funcionario', 'func123', 'FUNCIONARIO']
        );

        console.log('Banco inicializado com sucesso');

    } catch (error) {

        console.log('Erro ao inicializar banco:', error);

    }

};

// Autenticar usuário
export const authenticateUser = async (username, password) => {
    console.log(`pegou o usuario ${username} com a senha ${password}` )
    try {
        console.log("entrou no try")
        const result = await db.getFirstAsync(
            'SELECT * FROM users WHERE username = ? AND password = ?;',
            [username, password]
        );
        console.log(`pegou este resultado ${result.role}`)
        return result || null;

    } catch (error) {

        console.log('Erro autenticação:', error);
        return null;

    }

};

// Inserir produto
export const insertProduct = async (product) => {

    try {

        const result = await db.runAsync(
            `INSERT INTO products
            (name, preco_custo, preco_venda, estoque_min, quantidade)
            VALUES (?, ?, ?, ?, ?);`,
            [
                product.name,
                product.preco_custo,
                product.preco_venda,
                product.estoque_min,
                product.quantidade
            ]
        );

        return result.lastInsertRowId;

    } catch (error) {

        console.log('Erro inserir produto:', error);
        return null;

    }

};

// Buscar produtos
export const getAllProducts = async () => {

    try {

        const result = await db.getAllAsync(
            'SELECT * FROM products ORDER BY name ASC;'
        );

        return result;

    } catch (error) {

        console.log('Erro buscar produtos:', error);
        return [];

    }

};

// Produtos com estoque baixo
export const getLowStockProducts = async () => {

    try {

        const result = await db.getAllAsync(
            'SELECT * FROM products WHERE quantidade <= estoque_min;'
        );

        return result;

    } catch (error) {

        console.log('Erro estoque baixo:', error);
        return [];

    }

};

// Atualizar produto
export const updateProduct = async (product) => {

  try {

    const result = await db.runAsync(
      `UPDATE products
       SET name = ?,
           preco_custo = ?,
           preco_venda = ?,
           estoque_min = ?,
           quantidade = ?
       WHERE id = ?;`,
      [
        product.name,
        product.preco_custo,
        product.preco_venda,
        product.estoque_min,
        product.quantidade,
        product.id
      ]
    );

    return result.changes > 0;

  } catch (error) {

    console.log('Erro ao atualizar produto:', error);
    return false;

  }

};

// Atualizar quantidade
export const updateProductQuantity = async (productId, quantity) => {

    try {

        const result = await db.runAsync(
            `UPDATE products
             SET quantidade = quantidade - ?
             WHERE id = ?;`,
            [quantity, productId]
        );

        return result.changes > 0;

    } catch (error) {

        console.log('Erro atualizar quantidade:', error);
        return false;

    }

};

// Inserir venda
export const insertSale = async (sale) => {

    try {

        const result = await db.runAsync(
            `INSERT INTO sales
            (product_id, quantity, sale_price)
            VALUES (?, ?, ?);`,
            [
                sale.product_id,
                sale.quantity,
                sale.sale_price
            ]
        );

        return result.lastInsertRowId;

    } catch (error) {

        console.log('Erro inserir venda:', error);
        return null;

    }

};

// Resumo diário
export const getDailySalesSummary = async () => {

    try {

        const result = await db.getFirstAsync(`
            SELECT
                SUM(s.quantity * s.sale_price) as total_revenue,
                SUM(s.quantity * (p.preco_venda - p.preco_custo)) as total_profit
            FROM sales s
            JOIN products p ON s.product_id = p.id
            WHERE DATE(s.sale_date) = DATE('now');
        `);

        return result || {
            total_revenue: 0,
            total_profit: 0
        };

    } catch (error) {

        console.log('Erro resumo diário:', error);

        return {
            total_revenue: 0,
            total_profit: 0
        };

    }

};

// Vendas mensais
export const getMonthlySales = async () => {

    try {

        const result = await db.getAllAsync(`
            SELECT
                strftime('%Y-%m', s.sale_date) as month,
                SUM(s.quantity * s.sale_price) as revenue,
                SUM(s.quantity * (p.preco_venda - p.preco_custo)) as profit
            FROM sales s
            JOIN products p ON s.product_id = p.id
            GROUP BY strftime('%Y-%m', s.sale_date)
            ORDER BY month DESC;
        `);

        return result;

    } catch (error) {

        console.log('Erro vendas mensais:', error);
        return [];

    }

};

export default db;