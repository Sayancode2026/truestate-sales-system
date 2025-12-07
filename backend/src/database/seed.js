import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_FILE_PATH = path.join(__dirname, '../../../data/sales_data.csv');
const BATCH_SIZE = 500;

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log(' Starting CSV import...\n');

    console.log('  Clearing existing data...');
    await client.query('TRUNCATE TABLE sales RESTART IDENTITY CASCADE');

    const records = [];
    let skipped = 0;
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (row) => {
          if (!row['Transaction ID'] || !row['Transaction ID'].trim()) {
            skipped++;
            return;
          }

        
          let tagsArray = [];
          if (row['Tags'] && row['Tags'].trim()) {
            tagsArray = row['Tags'].split(',').map(tag => tag.trim()).filter(Boolean);
          }
          
          records.push({
            transaction_id: row['Transaction ID'],
            date: row['Date'],
            customer_id: row['Customer ID'],
            customer_name: row['Customer Name'],
            phone_number: row['Phone Number'],
            gender: row['Gender'],
            age: row['Age'] ? parseInt(row['Age']) : null,
            customer_region: row['Customer Region'],
            customer_type: row['Customer Type'],
            product_id: row['Product ID'],
            product_name: row['Product Name'],
            brand: row['Brand'],
            product_category: row['Product Category'],
            tags: tagsArray,
            quantity: row['Quantity'] ? parseInt(row['Quantity']) : null,
            price_per_unit: row['Price per Unit'] ? parseFloat(row['Price per Unit']) : null,
            discount_percentage: row['Discount Percentage'] ? parseFloat(row['Discount Percentage']) : null,
            total_amount: row['Total Amount'] ? parseFloat(row['Total Amount']) : null,
            final_amount: row['Final Amount'] ? parseFloat(row['Final Amount']) : null,
            payment_method: row['Payment Method'],
            order_status: row['Order Status'],
            delivery_type: row['Delivery Type'],
            store_id: row['Store ID'],
            store_location: row['Store Location'],
            salesperson_id: row['Salesperson ID'],
            employee_name: row['Employee Name'],
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Found ${records.length} valid records`);
    if (skipped > 0) console.log(`  Skipped ${skipped} empty rows\n`);

    if (records.length === 0) {
      throw new Error('No valid records found in CSV');
    }

    
    let inserted = 0;
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      
      for (const record of batch) {
        try {
          await client.query(`
            INSERT INTO sales (
              transaction_id, date, customer_id, customer_name, phone_number,
              gender, age, customer_region, customer_type, product_id,
              product_name, brand, product_category, tags, quantity,
              price_per_unit, discount_percentage, total_amount, final_amount,
              payment_method, order_status, delivery_type, store_id,
              store_location, salesperson_id, employee_name
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
            ON CONFLICT (transaction_id) DO NOTHING
          `, [
            record.transaction_id, record.date, record.customer_id, record.customer_name, record.phone_number,
            record.gender, record.age, record.customer_region, record.customer_type, record.product_id,
            record.product_name, record.brand, record.product_category, record.tags, record.quantity,
            record.price_per_unit, record.discount_percentage, record.total_amount, record.final_amount,
            record.payment_method, record.order_status, record.delivery_type, record.store_id,
            record.store_location, record.salesperson_id, record.employee_name
          ]);
          inserted++;
        } catch (err) {
          console.error(`\n Failed to insert ${record.transaction_id}:`, err.message);
        }
      }

      process.stdout.write(`\r Imported: ${inserted}/${records.length} records`);
    }

    console.log('\n\n Import completed!');
    
    const stats = await client.query('SELECT COUNT(*) as total FROM sales');
    console.log(`\n Total records: ${stats.rows[0].total}`);

  } catch (error) {
    console.error('\n Import failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase()
  .then(() => {
    console.log('\n Database seeding complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nFatal error:', error);
    process.exit(1);
  });
