import { Request, Response, Router } from "express";
import { mustAuthMiddleware } from "../middlewares/auth-middleware";
import { validatorMiddleware } from "../middlewares/validator-middleware";
import { getMe, login, register } from "../services/auth-service";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth-validator";

const router = Router();

router.post(
  "/register",
  validatorMiddleware({ body: registerValidator }),
  async (req: Request, res: Response) => {
    const response = await register(req.body);
    return response.finalize(res);
  },
);

router.post(
  "/login",
  validatorMiddleware({ body: loginValidator }),
  async (req: Request, res: Response) => {
    const response = await login(req.body);
    return response.finalize(res);
  },
);

router.get("/me", mustAuthMiddleware, async (req: Request, res: Response) => {
  const response = await getMe(req.user.id);
  return response.finalize(res);
});

export default router;
