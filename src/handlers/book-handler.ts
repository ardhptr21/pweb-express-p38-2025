import { Request, Response, Router } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {});
router.get("/", async (req: Request, res: Response) => {});
router.get("/:book_id", async (req: Request, res: Response) => {});
router.get("/genre/:genre_id", async (req: Request, res: Response) => {});
router.patch("/:book_id", async (req: Request, res: Response) => {});
router.delete("/:book_id", async (req: Request, res: Response) => {});

export default router;
