import { Request, Response, Router } from "express";
import { mustAuthMiddleware } from "../middlewares/auth-middleware";
import { validatorMiddleware } from "../middlewares/validator-middleware";
import {
  createTransactionService,
  getAllTransactionsService,
  getSingleTransactionService,
  getTransactionStatisticService,
} from "../services/transaction-service";
import {
  createTransactionValidator,
  transactionFilterQueryValidator,
  transactionParamsValidator,
} from "../validators/transaction-validator";

const router = Router();

router.use(mustAuthMiddleware);

router.post(
  "/",
  validatorMiddleware({
    body: createTransactionValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await createTransactionService(req.validated.body);
    return response.finalize(res);
  }
);
router.get(
  "/",
  validatorMiddleware({
    query: transactionFilterQueryValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await getAllTransactionsService(req.validated.query);
    return response.finalize(res);
  }
);

router.get("/statistics", async (req: Request, res: Response) => {
  const response = await getTransactionStatisticService();
  return response.finalize(res);
});

router.get(
  "/:transaction_id",
  validatorMiddleware({
    params: transactionParamsValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await getSingleTransactionService(req.validated.params.transaction_id);
    return response.finalize(res);
  }
);

export default router;
