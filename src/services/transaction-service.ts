import {
  CreateTransactionRequest,
  CreateTransactionResponse,
  GetManyTransactionResponse,
  GetSingleTransactionResponse,
  GetTransactionStatisticResponse,
  TransactionFilterQuery,
} from "../domains/transaction-domain";
import { HTTPResponse } from "../libs/http";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionStatistic,
} from "../repositories/transaction-repository";

export const createTransactionService = async (
  body: CreateTransactionRequest
): Promise<HTTPResponse<CreateTransactionResponse>> => {
  const res = new HTTPResponse<CreateTransactionResponse>();
  try {
    const transaction = await createTransaction(body);
    res.withCode(201).withData({
      transaction_id: transaction.order.id,
      total_price: transaction.totalPrice,
      total_quantity: transaction.totalQuantity,
    });
    return res;
  } catch (error) {
    if (error instanceof Error && error.name === "CreateTransactionError") {
      res.withCode(400).withMessage(error.message);
    } else {
      res.withCode(500).withMessage("Internal Server Error");
    }
    return res;
  }
};

export const getAllTransactionsService = async (
  filter: TransactionFilterQuery
): Promise<HTTPResponse<GetManyTransactionResponse[]>> => {
  const res = new HTTPResponse<GetManyTransactionResponse[]>();
  try {
    const { data, prev, next } = await getAllTransactions(filter);
    res
      .withCode(200)
      .withMessage("Get all transaction successfully")
      .withMeta({
        page: filter.page,
        limit: filter.limit,
        prev_page: prev,
        next_page: next,
      })
      .withData(data);

    return res;
  } catch {
    res.withCode(500).withMessage("Internal Server Error");
    return res;
  }
};

export const getSingleTransactionService = async (
  id: string
): Promise<HTTPResponse<GetSingleTransactionResponse>> => {
  const res = new HTTPResponse<GetSingleTransactionResponse>();
  try {
    const transaction = await getTransactionById(id);
    if (!transaction) {
      res.withCode(404).withMessage("Transaction not found");
      return res;
    }

    res.withCode(200).withMessage("Get transaction successfully").withData(transaction);

    return res;
  } catch {
    res.withCode(500).withMessage("Internal Server Error");
    return res;
  }
};

export const getTransactionStatisticService = async (): Promise<
  HTTPResponse<GetTransactionStatisticResponse>
> => {
  const res = new HTTPResponse<GetTransactionStatisticResponse>();
  try {
    const stats = await getTransactionStatistic();
    res.withCode(200).withMessage("Get transaction statistics successfully").withData(stats);
    return res;
  } catch {
    res.withCode(500).withMessage("Internal Server Error");
    return res;
  }
};
