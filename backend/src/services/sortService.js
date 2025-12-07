export function buildSortClause(sortBy) {
  const sortMappings = {
    'date_desc': 'date DESC',
    'date_asc': 'date ASC',
    'amount_desc': 'final_amount DESC',
    'amount_asc': 'final_amount ASC',
    'customer_name_asc': 'customer_name ASC',
    'customer_name_desc': 'customer_name DESC',
    'quantity_desc': 'quantity DESC',
    'quantity_asc': 'quantity ASC'
  };

  return sortMappings[sortBy] || 'date DESC';
}
