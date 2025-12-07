export function buildFilterQuery(filters, startParamIndex) {
  const clauses = [];
  const params = [];
  let paramIndex = startParamIndex;

  
  if (filters.customerRegion && filters.customerRegion.length > 0) {
    const regions = Array.isArray(filters.customerRegion)
      ? filters.customerRegion
      : [filters.customerRegion];
    clauses.push(`customer_region = ANY($${paramIndex})`);
    params.push(regions);
    paramIndex++;
  }

  
  if (filters.gender && filters.gender.length > 0) {
    const genders = Array.isArray(filters.gender)
      ? filters.gender
      : [filters.gender];
    clauses.push(`gender = ANY($${paramIndex})`);
    params.push(genders);
    paramIndex++;
  }

  
  if (filters.ageMin !== null && filters.ageMin !== undefined && filters.ageMin !== '') {
    clauses.push(`age >= $${paramIndex}`);
    params.push(parseInt(filters.ageMin));
    paramIndex++;
  }

  if (filters.ageMax !== null && filters.ageMax !== undefined && filters.ageMax !== '') {
    clauses.push(`age <= $${paramIndex}`);
    params.push(parseInt(filters.ageMax));
    paramIndex++;
  }

  
  if (filters.productCategory && filters.productCategory.length > 0) {
    const categories = Array.isArray(filters.productCategory)
      ? filters.productCategory
      : [filters.productCategory];
    clauses.push(`product_category = ANY($${paramIndex})`);
    params.push(categories);
    paramIndex++;
  }

  
  if (filters.tags && filters.tags.length > 0) {
    const tagList = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
    
    clauses.push(`tags && $${paramIndex}::text[]`);
    params.push(tagList);
    paramIndex++;
  }

  
  if (filters.paymentMethod && filters.paymentMethod.length > 0) {
    const methods = Array.isArray(filters.paymentMethod)
      ? filters.paymentMethod
      : [filters.paymentMethod];
    clauses.push(`payment_method = ANY($${paramIndex})`);
    params.push(methods);
    paramIndex++;
  }

  
  if (filters.dateFrom && filters.dateFrom !== '') {
    clauses.push(`date >= $${paramIndex}::date`);
    params.push(filters.dateFrom);
    paramIndex++;
  }

  if (filters.dateTo && filters.dateTo !== '') {
    clauses.push(`date <= $${paramIndex}::date`);
    params.push(filters.dateTo);
    paramIndex++;
  }

  return {
    clauses,
    params,
    nextParamIndex: paramIndex
  };
}
