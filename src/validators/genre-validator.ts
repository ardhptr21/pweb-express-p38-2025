import z from "zod";
import { paginateQueryValidator } from "./common-validator";

export const genreFilterQueryValidator = paginateQueryValidator.extend({
  search: z.string().optional(),
  orderByName: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const createGenreValidator = z.object({
  name: z.string().min(1).max(100),
});

export const updateGenreValidator = createGenreValidator;

export const genreParamsValidator = z.object({
  genre_id: z.uuid(),
});
