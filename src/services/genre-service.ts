import {
  CreateGenreRequest,
  CreateGenreResponse,
  GenreFilterQuery,
  GetGenreResponse,
  UpdateGenreRequest,
  UpdateGenreResponse,
} from "../domains/genre-domain";
import { HTTPResponse } from "../libs/http";
import {
  createGenre,
  deleteGenreById,
  genreExistsById,
  getAllGenresPaginate,
  getGenreById,
  updateGenreById,
} from "../repositories/genre-repository";

export const createGenreService = async (
  body: CreateGenreRequest
): Promise<HTTPResponse<CreateGenreResponse>> => {
  const res = new HTTPResponse<CreateGenreResponse>();
  try {
    const genre = await createGenre(body.name);

    res.withCode(201).withMessage("Genre created successfully").withData({
      id: genre.id,
      name: genre.name,
      created_at: genre.createdAt,
    });

    return res;
  } catch (error) {
    res.withCode(500).withMessage("Internal server error");
    return res;
  }
};

export const getAllGenresService = async (
  filter: GenreFilterQuery
): Promise<HTTPResponse<GetGenreResponse[]>> => {
  const res = new HTTPResponse<GetGenreResponse[]>();
  try {
    const { data, prev, next } = await getAllGenresPaginate(filter);
    res
      .withCode(200)
      .withMessage("Get all genre successfully")
      .withMeta({
        page: filter.page,
        limit: filter.limit,
        prev_page: prev,
        next_page: next,
      })
      .withData(data);
    return res;
  } catch (error) {
    res.withCode(500).withMessage("Internal server error");
    return res;
  }
};

export const getSingleGenreService = async (
  id: string
): Promise<HTTPResponse<GetGenreResponse>> => {
  const res = new HTTPResponse<GetGenreResponse>();
  try {
    const genre = await getGenreById(id);
    if (!genre) {
      res.withCode(404).withMessage("Genre not found");
      return res;
    }

    res.withCode(200).withMessage("Genre retrieved successfully").withData({
      id: genre.id,
      name: genre.name,
    });

    return res;
  } catch (error) {
    res.withCode(500).withMessage("Internal server error");
    return res;
  }
};

export const updateGenreService = async (
  id: string,
  body: UpdateGenreRequest
): Promise<HTTPResponse<UpdateGenreResponse>> => {
  const res = new HTTPResponse<UpdateGenreResponse>();
  try {
    const exists = await genreExistsById(id);
    if (!exists) {
      res.withCode(404).withMessage("Genre not found");
      return res;
    }

    const genre = await updateGenreById(id, body.name);

    res.withCode(200).withMessage("Genre updated successfully").withData({
      id: genre.id,
      name: genre.name,
      updated_at: genre.updatedAt,
    });

    return res;
  } catch (error) {
    res.withCode(500).withMessage("Internal server error");
    return res;
  }
};

export const deleteGenreService = async (id: string): Promise<HTTPResponse<never>> => {
  const res = new HTTPResponse<never>();
  try {
    const exists = await genreExistsById(id);
    if (!exists) {
      res.withCode(404).withMessage("Genre not found");
      return res;
    }

    await deleteGenreById(id);

    res.withCode(200).withMessage("Genre deleted successfully");

    return res;
  } catch (error) {
    res.withCode(500).withMessage("Internal server error");
    return res;
  }
};
