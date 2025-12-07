import { z } from 'zod';

export const salesQuerySchema = z.object({
  search: z.string().max(100).optional().default(''),
  customerRegion: z.string().max(500).optional().default(''),
  gender: z.string().max(100).optional().default(''),
  ageMin: z.string().optional().default(''),
  ageMax: z.string().optional().default(''),
  productCategory: z.string().max(500).optional().default(''),
  tags: z.string().max(1000).optional().default(''),
  paymentMethod: z.string().max(300).optional().default(''),
  dateFrom: z.string().optional().default(''),
  dateTo: z.string().optional().default(''),
  sortBy: z.string().optional().default('date_desc'),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
});

export function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          error: 'Validation failed', 
          details: error.errors 
        });
      }
      next(error);
    }
  };
}
