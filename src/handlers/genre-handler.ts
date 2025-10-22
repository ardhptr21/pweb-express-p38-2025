import { GenreFilterQuery } from "domains/genre-domain";
import { Request, Response, Router } from "express";
import { mustAuthMiddleware } from "../middlewares/auth-middleware";
import { validatorMiddleware } from "../middlewares/validator-middleware";
import {
  createGenreService,
  deleteGenreService,
  getAllGenresService,
  getSingleGenreService,
  updateGenreService,
} from "../services/genre-service";
import {
  createGenreValidator,
  genreFilterQueryValidator,
  genreParamsValidator,
  updateGenreValidator,
} from "../validators/genre-validator";

const router = Router();

router.use(mustAuthMiddleware);

router.post(
  "/",
  validatorMiddleware({
    body: createGenreValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await createGenreService(req.validated.body);
    return response.finalize(res);
  }
);

router.get(
  "/",
  validatorMiddleware({
    query: genreFilterQueryValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await getAllGenresService(req.validated.query as GenreFilterQuery);
    return response.finalize(res);
  }
);

router.get(
  "/:genre_id",
  validatorMiddleware({
    params: genreParamsValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await getSingleGenreService(req.validated.params.genre_id);
    return response.finalize(res);
  }
);

router.patch(
  "/:genre_id",
  validatorMiddleware({
    params: genreParamsValidator,
    body: updateGenreValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await updateGenreService(req.validated.params.genre_id, req.validated.body);
    return response.finalize(res);
  }
);

router.delete(
  "/:genre_id",
  validatorMiddleware({
    params: genreParamsValidator,
  }),
  async (req: Request, res: Response) => {
    const response = await deleteGenreService(req.validated.params.genre_id);
    return response.finalize(res);
  }
);

export default router;
