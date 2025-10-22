import { Request, Response, Router } from "express";
import { mustAuthMiddleware } from "../middlewares/auth-middleware";
import { validatorMiddleware } from "../middlewares/validator-middleware";
import { getMeService, loginService, registerService } from "../services/auth-service";
import { loginValidator, registerValidator } from "../validators/auth-validator";

const router = Router();

router.post(
  "/register",
  validatorMiddleware({ body: registerValidator }),
  async (req: Request, res: Response) => {
    const response = await registerService(req.validated.body);
    return response.finalize(res);
  }
);

router.post(
  "/login",
  validatorMiddleware({ body: loginValidator }),
  async (req: Request, res: Response) => {
    const response = await loginService(req.validated.body);
    return response.finalize(res);
  }
);

router.get("/me", mustAuthMiddleware, async (req: Request, res: Response) => {
  const response = await getMeService(req.user.id);
  return response.finalize(res);
});

export default router;
