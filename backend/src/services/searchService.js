export function buildSearchQuery(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return { clause: '', params: [] };
    }
  
    const term = searchTerm.trim();
    const isPhoneSearch = /^\+?\d+$/.test(term);
    
    if (isPhoneSearch) {
      return { clause: `phone_number LIKE $1`, params: [`%${term}%`] };
    }
    
    const tsQuery = term.split(/\s+/).filter(word => word.length > 0).map(word => `${word}:*`).join(' & ');
    
    return {
      clause: `(search_vector @@ to_tsquery('english', $1) OR LOWER(customer_name) LIKE $2 OR phone_number LIKE $3)`,
      params: [tsQuery, `%${term.toLowerCase()}%`, `%${term}%`]
    };
  }
  