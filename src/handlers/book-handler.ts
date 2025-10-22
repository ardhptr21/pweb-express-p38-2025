import { Request, Response, Router } from "express";
import { BookFilterQuery } from "../domains/book-domain";
import { mustAuthMiddleware } from "../middlewares/auth-middleware";
import { validatorMiddleware } from "../middlewares/validator-middleware";
import {
  createBookService,
  deleteBookService,
  getAllBooksService,
  getBooksByGenreService,
  getSingleBookService,
  updateBookService,
} from "../services/book-service";
import {
  bookFilterQueryValidator,
  bookParamsValidator,
  createBookValidator,
  updateBookValidator,
} from "../validators/book-validator";
import { genreParamsValidator } from "../validators/genre-validator";

const router = Router();

router.use(mustAuthMiddleware);

router.post(
  "/",
  validatorMiddleware({
    body: createBookValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await createBookService(req.validated.body);
    return response.finalize(res);
  }
);

router.get(
  "/",
  validatorMiddleware({
    query: bookFilterQueryValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await getAllBooksService(req.validated.query as BookFilterQuery);
    return response.finalize(res);
  }
);

router.get(
  "/:book_id",
  validatorMiddleware({
    params: bookParamsValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await getSingleBookService(req.validated.params.book_id);
    return response.finalize(res);
  }
);

router.get(
  "/genre/:genre_id",

  validatorMiddleware({
    query: bookFilterQueryValidator,
    params: genreParamsValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await getBooksByGenreService(
      req.params.genre_id,
      req.validated.query as BookFilterQuery
    );
    return response.finalize(res);
  }
);

router.patch(
  "/:book_id",
  validatorMiddleware({
    params: bookParamsValidator,
    body: updateBookValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await updateBookService(req.validated.params.book_id, req.validated.body);
    return response.finalize(res);
  }
);

router.delete(
  "/:book_id",
  validatorMiddleware({
    params: bookParamsValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await deleteBookService(req.validated.params.book_id);
    return response.finalize(res);
  }
);

export default router;
