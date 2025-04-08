
import mysql from 'mysql2/promise';

// Database connection configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'umkm_pos',
  port: parseInt(process.env.DB_PORT || '3306'),
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Helper function to execute SQL queries
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Database operation failed');
  }
}

// Example Product queries
export const productQueries = {
  getAllProducts: async () => {
    return executeQuery<any[]>('SELECT * FROM products');
  },
  
  getProductById: async (id: number) => {
    return executeQuery<any[]>('SELECT * FROM products WHERE id = ?', [id]);
  },
  
  createProduct: async (product: any) => {
    const { name, price, stock, category, image } = product;
    return executeQuery(
      'INSERT INTO products (name, price, stock, category, image) VALUES (?, ?, ?, ?, ?)',
      [name, price, stock, category, image]
    );
  },
  
  updateProduct: async (id: number, product: any) => {
    const { name, price, stock, category, image } = product;
    return executeQuery(
      'UPDATE products SET name = ?, price = ?, stock = ?, category = ?, image = ? WHERE id = ?',
      [name, price, stock, category, image, id]
    );
  },
  
  deleteProduct: async (id: number) => {
    return executeQuery('DELETE FROM products WHERE id = ?', [id]);
  }
};
