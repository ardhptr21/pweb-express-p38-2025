import { GenreFilterQuery } from "domains/genre-domain";
import prisma from "../libs/prisma";

export const getAllGenresPaginate = async (query: GenreFilterQuery) => {
  const offset = (query.page - 1) * query.limit;
  console.log(query.search);

  const where: any = {
    deletedAt: null,
    name: query.search ? { contains: query.search, mode: "insensitive" } : undefined,
  };

  const [total, data] = await Promise.all([
    prisma.genre.count({
      where,
    }),
    prisma.genre.findMany({
      where,
      skip: offset,
      take: query.limit,
      orderBy: {
        name: query.orderByName || "asc",
      },
    }),
  ]);

  return {
    total,
    data,
    prev: offset - query.limit > 0 ? query.page - 1 : null,
    next: offset + query.limit < total ? query.page + 1 : null,
  };
};

export const createGenre = async (name: string) => {
  return await prisma.genre.create({ data: { name } });
};

export const genreExistsById = async (id: string) => {
  const count = await prisma.genre.count({
    where: {
      AND: { id, deletedAt: null },
    },
  });
  return count > 0;
};

export const getGenreById = async (id: string) => {
  return await prisma.genre.findFirst({
    where: {
      AND: { id, deletedAt: null },
    },
  });
};

export const updateGenreById = async (id: string, name: string) => {
  return await prisma.genre.update({
    where: { id },
    data: { name },
  });
};

export const deleteGenreById = async (id: string) => {
  return await prisma.genre.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
