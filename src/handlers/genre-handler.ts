import { Request, Response, Router } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {});
router.get("/", async (req: Request, res: Response) => {});
router.get("/:genre_id", async (req: Request, res: Response) => {});
router.patch("/:genre_id", async (req: Request, res: Response) => {});
router.delete("/:genre_id", async (req: Request, res: Response) => {});

export default router;
