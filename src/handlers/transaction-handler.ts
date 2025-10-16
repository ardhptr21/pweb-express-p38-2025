import { Request, Response, Router } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {});
router.get("/", async (req: Request, res: Response) => {});
router.get("/:transaction_id", async (req: Request, res: Response) => {});
router.get(
  "/:transaction_id/statistics",
  async (req: Request, res: Response) => {},
);

export default router;
