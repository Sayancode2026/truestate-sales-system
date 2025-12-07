import pool from '../database/db.js';
import { buildSearchQuery } from '../services/searchService.js';
import { buildFilterQuery } from '../services/filterService.js';
import { buildSortClause } from '../services/sortService.js';
import { getCachedFilterOptions, setCachedFilterOptions } from '../services/cacheService.js';
import { Parser } from 'json2csv';

export async function getSales(req, res, next) {
  try {
    const {
      search = '', customerRegion = '', gender = '', ageMin = '', ageMax = '',
      productCategory = '', tags = '', paymentMethod = '', dateFrom = '', dateTo = '',
      sortBy = 'date_desc', page = '1', limit = '10'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const offset = (pageNum - 1) * pageLimit;

    const whereClauses = [];
    const params = [];
    let paramIndex = 1;

    if (search.trim()) {
      const searchQuery = buildSearchQuery(search);
      if (searchQuery.clause) {
        whereClauses.push(searchQuery.clause);
        params.push(...searchQuery.params);
        paramIndex += searchQuery.params.length;
      }
    }

    const filters = {
      customerRegion: customerRegion ? customerRegion.split(',').filter(Boolean) : [],
      gender: gender ? gender.split(',').filter(Boolean) : [],
      ageMin: ageMin ? parseInt(ageMin) : null,
      ageMax: ageMax ? parseInt(ageMax) : null,
      productCategory: productCategory ? productCategory.split(',').filter(Boolean) : [],
      tags: tags ? tags.split(',').filter(Boolean) : [],
      paymentMethod: paymentMethod ? paymentMethod.split(',').filter(Boolean) : [],
      dateFrom: dateFrom || null,
      dateTo: dateTo || null
    };

    const filterQuery = buildFilterQuery(filters, paramIndex);
    whereClauses.push(...filterQuery.clauses);
    params.push(...filterQuery.params);
    paramIndex = filterQuery.nextParamIndex;

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const orderClause = `ORDER BY ${buildSortClause(sortBy)}`;

    
    const countQuery = `
      SELECT 
        COUNT(*) as total,
        COALESCE(SUM(quantity), 0) as total_units,
        COALESCE(SUM(final_amount), 0) as total_amount,
        COALESCE(SUM(total_amount - final_amount), 0) as total_discount
      FROM sales ${whereClause}
    `;

    const countResult = await pool.query(countQuery, params);
    const { total, total_units, total_amount, total_discount } = countResult.rows[0];

    const paginationParams = [...params, pageLimit, offset];
    const dataQuery = `
      SELECT transaction_id, TO_CHAR(date, 'YYYY-MM-DD') as date, customer_id, customer_name,
        phone_number, gender, age, customer_region, customer_type, product_id, product_name,
        brand, product_category, tags, quantity, price_per_unit, discount_percentage,
        total_amount, final_amount, payment_method, order_status, delivery_type,
        store_id, store_location, salesperson_id, employee_name
      FROM sales ${whereClause} ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const dataResult = await pool.query(dataQuery, paginationParams);

    const formattedData = dataResult.rows.map(row => ({
      transaction_id: row.transaction_id,
      date: row.date,
      customer_id: row.customer_id,
      customer_name: row.customer_name,
      phone_number: row.phone_number,
      gender: row.gender,
      age: row.age,
      customer_region: row.customer_region,
      customer_type: row.customer_type,
      product_id: row.product_id,
      product_name: row.product_name,
      brand: row.brand,
      product_category: row.product_category,
      tags: row.tags,
      quantity: row.quantity,
      price_per_unit: parseFloat(row.price_per_unit) || 0,
      discount_percentage: parseFloat(row.discount_percentage) || 0,
      total_amount: parseFloat(row.total_amount) || 0,
      final_amount: parseFloat(row.final_amount) || 0,
      payment_method: row.payment_method,
      order_status: row.order_status,
      delivery_type: row.delivery_type,
      store_id: row.store_id,
      store_location: row.store_location,
      salesperson_id: row.salesperson_id,
      employee_name: row.employee_name
    }));

    const totalPages = Math.ceil(total / pageLimit);

    res.json({
      success: true,
      data: formattedData,
      summary: {
        totalUnitsSold: parseInt(total_units) || 0,
        totalAmount: parseFloat(total_amount) || 0,
        totalDiscount: parseFloat(total_discount) || 0
      },
      pagination: {
        currentPage: pageNum,
        totalPages,
        pageSize: pageLimit,
        total: parseInt(total),
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Query error:', error);
    next(error);
  }
}


export async function exportSalesCSV(req, res, next) {
  try {
    const {
      search = '', customerRegion = '', gender = '', ageMin = '', ageMax = '',
      productCategory = '', tags = '', paymentMethod = '', dateFrom = '', dateTo = '',
      sortBy = 'date_desc'
    } = req.query;

    const whereClauses = [];
    const params = [];
    let paramIndex = 1;

    if (search.trim()) {
      const searchQuery = buildSearchQuery(search);
      if (searchQuery.clause) {
        whereClauses.push(searchQuery.clause);
        params.push(...searchQuery.params);
        paramIndex += searchQuery.params.length;
      }
    }

    const filters = {
      customerRegion: customerRegion ? customerRegion.split(',').filter(Boolean) : [],
      gender: gender ? gender.split(',').filter(Boolean) : [],
      ageMin: ageMin ? parseInt(ageMin) : null,
      ageMax: ageMax ? parseInt(ageMax) : null,
      productCategory: productCategory ? productCategory.split(',').filter(Boolean) : [],
      tags: tags ? tags.split(',').filter(Boolean) : [],
      paymentMethod: paymentMethod ? paymentMethod.split(',').filter(Boolean) : [],
      dateFrom: dateFrom || null,
      dateTo: dateTo || null
    };

    const filterQuery = buildFilterQuery(filters, paramIndex);
    whereClauses.push(...filterQuery.clauses);
    params.push(...filterQuery.params);

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const orderClause = `ORDER BY ${buildSortClause(sortBy)}`;

    
    const dataQuery = `
      SELECT transaction_id, TO_CHAR(date, 'YYYY-MM-DD') as date, customer_id, customer_name,
        phone_number, gender, age, customer_region, customer_type, product_id, product_name,
        brand, product_category, tags, quantity, price_per_unit, discount_percentage,
        total_amount, final_amount, payment_method, order_status, delivery_type,
        store_id, store_location, salesperson_id, employee_name
      FROM sales ${whereClause} ${orderClause}
      LIMIT 50000
    `;

    const dataResult = await pool.query(dataQuery, params);

    const fields = [
      'transaction_id', 'date', 'customer_id', 'customer_name', 'phone_number', 
      'gender', 'age', 'customer_region', 'customer_type', 'product_id', 'product_name',
      'brand', 'product_category', 'tags', 'quantity', 'price_per_unit', 
      'discount_percentage', 'total_amount', 'final_amount', 'payment_method', 
      'order_status', 'delivery_type', 'store_id', 'store_location', 
      'salesperson_id', 'employee_name'
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(dataResult.rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=sales_export_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    next(error);
  }
}

export async function getFilterOptions(req, res, next) {
  try {
    // Try cache first
    const cached = await getCachedFilterOptions();
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true
      });
    }

    
    const filterQuery = `
      SELECT json_build_object(
        'regions', (SELECT array_agg(DISTINCT customer_region ORDER BY customer_region) 
                    FROM sales WHERE customer_region IS NOT NULL),
        'genders', (SELECT array_agg(DISTINCT gender ORDER BY gender) 
                    FROM sales WHERE gender IS NOT NULL),
        'categories', (SELECT array_agg(DISTINCT product_category ORDER BY product_category) 
                       FROM sales WHERE product_category IS NOT NULL),
        'paymentMethods', (SELECT array_agg(DISTINCT payment_method ORDER BY payment_method) 
                           FROM sales WHERE payment_method IS NOT NULL),
        'ageRange', (SELECT json_build_object('min', MIN(age), 'max', MAX(age)) 
                     FROM sales WHERE age IS NOT NULL),
        'dateRange', (SELECT json_build_object(
                        'min', TO_CHAR(MIN(date), 'YYYY-MM-DD'),
                        'max', TO_CHAR(MAX(date), 'YYYY-MM-DD')
                      ) FROM sales WHERE date IS NOT NULL)
      ) as options
    `;

    const result = await pool.query(filterQuery);
    
    
    const tagsResult = await pool.query(`
      SELECT DISTINCT TRIM(unnest(tags)) as tag 
      FROM sales 
      WHERE tags IS NOT NULL 
        AND array_length(tags, 1) > 0
      ORDER BY tag 
      LIMIT 100
    `);

    const filterOptions = {
      ...result.rows[0].options,
      tags: tagsResult.rows.map(r => r.tag).filter(Boolean)
    };

    
    await setCachedFilterOptions(filterOptions);

    res.json({
      success: true,
      data: filterOptions,
      cached: false
    });

  } catch (error) {
    console.error('Filter options error:', error);
    next(error);
  }
}


export async function getAllSales(req, res, next) {
  try {
    const { 
      search = '', 
      customerRegion = '', 
      gender = '', 
      ageMin = '', 
      ageMax = '', 
      productCategory = '', 
      tags = '', 
      paymentMethod = '', 
      dateFrom = '', 
      dateTo = '',
      sortBy = 'date_desc'
    } = req.query;

    const whereClauses = [];
    const params = [];
    let paramIndex = 1;

    
    if (search.trim()) {
      const searchQuery = buildSearchQuery(search);
      if (searchQuery.clause) {
        whereClauses.push(searchQuery.clause);
        params.push(...searchQuery.params);
        paramIndex += searchQuery.params.length;
      }
    }

    
    const filters = {
      customerRegion: customerRegion ? customerRegion.split(',').filter(Boolean) : [],
      gender: gender ? gender.split(',').filter(Boolean) : [],
      ageMin: ageMin ? parseInt(ageMin) : null,
      ageMax: ageMax ? parseInt(ageMax) : null,
      productCategory: productCategory ? productCategory.split(',').filter(Boolean) : [],
      tags: tags ? tags.split(',').filter(Boolean) : [],
      paymentMethod: paymentMethod ? paymentMethod.split(',').filter(Boolean) : [],
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    };

    const filterQuery = buildFilterQuery(filters, paramIndex);
    whereClauses.push(...filterQuery.clauses);
    params.push(...filterQuery.params);

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const orderClause = `ORDER BY ${buildSortClause(sortBy)}`;

    
    const dataQuery = `
      SELECT 
        transaction_id,
        TO_CHAR(date, 'YYYY-MM-DD') as date,
        customer_id,
        customer_name,
        phone_number,
        gender,
        age,
        customer_region,
        customer_type,
        product_id,
        product_name,
        brand,
        product_category,
        tags,
        quantity,
        price_per_unit,
        discount_percentage,
        total_amount,
        final_amount,
        payment_method,
        order_status,
        delivery_type,
        store_id,
        store_location,
        salesperson_id,
        employee_name
      FROM sales
      ${whereClause}
      ${orderClause}
      LIMIT 1000000
    `;

    console.log('📊 Fetching all records for modal...');
    const dataResult = await pool.query(dataQuery, params);

    const formattedData = dataResult.rows.map(row => ({
      transaction_id: row.transaction_id,
      date: row.date,
      customer_id: row.customer_id,
      customer_name: row.customer_name,
      phone_number: row.phone_number,
      gender: row.gender,
      age: row.age,
      customer_region: row.customer_region,
      customer_type: row.customer_type,
      product_id: row.product_id,
      product_name: row.product_name,
      brand: row.brand,
      product_category: row.product_category,
      tags: row.tags,
      quantity: row.quantity,
      price_per_unit: parseFloat(row.price_per_unit || 0),
      discount_percentage: parseFloat(row.discount_percentage || 0),
      total_amount: parseFloat(row.total_amount || 0),
      final_amount: parseFloat(row.final_amount || 0),
      payment_method: row.payment_method,
      order_status: row.order_status,
      delivery_type: row.delivery_type,
      store_id: row.store_id,
      store_location: row.store_location,
      salesperson_id: row.salesperson_id,
      employee_name: row.employee_name,
    }));

    console.log(`Returning ${formattedData.length} total records`);

    res.json({
      success: true,
      data: formattedData,
      total: formattedData.length
    });

  } catch (error) {
    console.error('Query error:', error);
    next(error);
  }
}

