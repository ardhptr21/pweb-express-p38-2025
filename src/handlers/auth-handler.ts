import { Request, Response, Router } from "express";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {});
router.post("/login", async (req: Request, res: Response) => {});
router.get("/get-me", async (req: Request, res: Response) => {});

export default router;
