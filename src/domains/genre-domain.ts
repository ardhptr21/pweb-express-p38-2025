import z from "zod";
import {
  createGenreValidator,
  genreFilterQueryValidator,
  genreParamsValidator,
  updateGenreValidator,
} from "../validators/genre-validator";

export type GenreFilterQuery = z.infer<typeof genreFilterQueryValidator>;

export type GenreParams = z.infer<typeof genreParamsValidator>;

export type GetGenreResponse = {
  id: string;
  name: string;
};

export type CreateGenreRequest = z.infer<typeof createGenreValidator>;
export type CreateGenreResponse = {
  id: string;
  name: string;
  created_at: Date;
};

export type UpdateGenreRequest = z.infer<typeof updateGenreValidator>;
export type UpdateGenreResponse = {
  id: string;
  name: string;
  updated_at: Date;
};
