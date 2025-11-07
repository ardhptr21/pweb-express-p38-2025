import z from 'zod';
import { paginateQueryValidator } from './common-validator';

export const bookFilterQueryValidator = paginateQueryValidator.extend({
  search: z.string().optional(),
  orderByTitle: z.enum(['asc', 'desc']).optional(),
  orderByPublishDate: z.enum(['asc', 'desc']).optional(),
});

export const bookParamsValidator = z.object({
  book_id: z.uuid(),
});

export const createBookValidator = z.object({
  genre_id: z.uuid(),
  image: z.url(),
  title: z.string().min(3).max(100),
  writer: z.string().min(3).max(100),
  publisher: z.string().min(3).max(100),
  description: z.string().optional(),
  publication_year: z.number().int().min(1000).max(new Date().getFullYear()),
  price: z.number().min(0),
  stock_quantity: z.number().int().min(0),
});

export const updateBookValidator = z.object({
  genre_id: z.uuid().optional(),
  title: z.string().min(3).max(100).optional(),
  writer: z.string().min(3).max(100).optional(),
  publisher: z.string().min(3).max(100).optional(),
  description: z.string().optional(),
  publication_year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  price: z.number().min(0).optional(),
  stock_quantity: z.number().int().min(0).optional(),
});
