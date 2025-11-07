import z from 'zod';
import {
  createTransactionValidator,
  transactionFilterQueryValidator,
  transactionParamsValidator,
} from '../validators/transaction-validator';

export type TransactionFilterQuery = z.infer<typeof transactionFilterQueryValidator>;
export type TransactionParams = z.infer<typeof transactionParamsValidator>;

export type GetManyTransactionResponse = {
  id: string;
  total_quantity: number;
  total_price: number;
};

export type GetSingleTransactionResponse = {
  id: string;
  items: {
    book_id: string;
    book_title: string;
    book_image: string;
    quantity: number;
    subtotal_price: number;
  }[];
  total_quantity: number;
  total_price: number;
};

export type GetTransactionStatisticResponse = {
  total_transactions: number;
  average_transaction_amount: number;
  fewest_book_sales_genre: string | null;
  most_book_sales_genre: string | null;
};

export type CreateTransactionRequest = z.infer<typeof createTransactionValidator>;
export type CreateTransactionResponse = {
  transaction_id: string;
  total_quantity: number;
  total_price: number;
};
