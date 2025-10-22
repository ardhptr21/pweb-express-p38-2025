import z from "zod";
import {
  bookFilterQueryValidator,
  bookParamsValidator,
  createBookValidator,
  updateBookValidator,
} from "../validators/book-validator";

export type BookFilterQuery = z.infer<typeof bookFilterQueryValidator>;
export type BookParams = z.infer<typeof bookParamsValidator>;

export type GetBookResponse = {
  id: string;
  title: string;
  writer: string;
  publisher: string;
  description: string | null;
  publication_year: number;
  price: number;
  stock_quantity: number;
  genre: string;
};

export type GetBookResponseByGenre = Omit<GetBookResponse, "genre">;

export type CreateBookRequest = z.infer<typeof createBookValidator>;
export type CreateBookResponse = {
  id: string;
  title: string;
  created_at: Date;
};

export type UpdateBookRequest = z.infer<typeof updateBookValidator>;
export type UpdateBookResponse = {
  id: string;
  title: string;
  updated_at: Date;
};
