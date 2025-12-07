import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME ,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🗄️  Creating sales table...');
    
    await client.query(`
      DROP TABLE IF EXISTS sales CASCADE;
      
      CREATE TABLE sales (
        id SERIAL PRIMARY KEY,
        transaction_id VARCHAR(50) UNIQUE NOT NULL,
        date DATE NOT NULL,
        customer_id VARCHAR(50),
        customer_name VARCHAR(255),
        phone_number VARCHAR(20),
        gender VARCHAR(20),
        age INTEGER,
        customer_region VARCHAR(50),
        customer_type VARCHAR(50),
        product_id VARCHAR(50),
        product_name VARCHAR(255),
        brand VARCHAR(100),
        product_category VARCHAR(100),
        tags TEXT[],
        quantity INTEGER,
        price_per_unit DECIMAL(10, 2),
        discount_percentage DECIMAL(5, 2),
        total_amount DECIMAL(10, 2),
        final_amount DECIMAL(10, 2),
        payment_method VARCHAR(50),
        order_status VARCHAR(50),
        delivery_type VARCHAR(50),
        store_id VARCHAR(50),
        store_location VARCHAR(100),
        salesperson_id VARCHAR(50),
        employee_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating indexes...');
    
    await client.query(`
      CREATE INDEX idx_customer_name_lower ON sales (LOWER(customer_name));
      CREATE INDEX idx_phone_number ON sales (phone_number);
      CREATE INDEX idx_date_desc ON sales (date DESC);
      CREATE INDEX idx_customer_region ON sales (customer_region);
      CREATE INDEX idx_gender ON sales (gender);
      CREATE INDEX idx_age ON sales (age);
      CREATE INDEX idx_product_category ON sales (product_category);
      CREATE INDEX idx_payment_method ON sales (payment_method);
      CREATE INDEX idx_quantity_desc ON sales (quantity DESC);
      CREATE INDEX idx_tags ON sales USING GIN(tags);
    `);

    console.log(' Setting up full-text search...');
    await client.query(`
      ALTER TABLE sales ADD COLUMN search_vector tsvector;
      CREATE INDEX idx_search_vector ON sales USING GIN(search_vector);
      
      CREATE OR REPLACE FUNCTION sales_search_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector := to_tsvector('english', 
          COALESCE(NEW.customer_name, '') || ' ' || 
          COALESCE(NEW.phone_number, '') || ' ' ||
          COALESCE(NEW.transaction_id, '') || ' ' ||
          COALESCE(NEW.product_name, '')
        );
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
      
      CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE ON sales 
      FOR EACH ROW EXECUTE FUNCTION sales_search_trigger();
    `);

    console.log(' Creating composite indexes...');
    await client.query(`
      CREATE INDEX idx_region_category ON sales (customer_region, product_category);
      CREATE INDEX idx_date_region ON sales (date DESC, customer_region);
      CREATE INDEX idx_category_date ON sales (product_category, date DESC);
      CREATE INDEX idx_amount_date ON sales (final_amount DESC, date DESC);
    `);

    console.log(' Database setup complete!\n');
    
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
