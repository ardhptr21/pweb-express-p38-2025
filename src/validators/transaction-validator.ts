import z from "zod";
import { paginateQueryValidator } from "./common-validator";

export const transactionFilterQueryValidator = paginateQueryValidator.extend({
  search: z.string().optional(),
  orderById: z.enum(["asc", "desc"]).optional(),
  orderByAmount: z.enum(["asc", "desc"]).optional(),
  orderByPrice: z.enum(["asc", "desc"]).optional(),
});

export const transactionParamsValidator = z.object({
  transaction_id: z.uuid(),
});

export const createTransactionValidator = z.object({
  user_id: z.uuid(),
  items: z
    .array(
      z.object({
        book_id: z.uuid(),
        quantity: z.number().min(1),
      })
    )
    .min(1),
});
