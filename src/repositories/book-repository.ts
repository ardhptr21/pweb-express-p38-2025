import { BookFilterQuery, CreateBookRequest, UpdateBookRequest } from "domains/book-domain";
import prisma from "../libs/prisma";

export const getAllBooksPaginate = async (query: BookFilterQuery) => {
  const offset = (query.page - 1) * query.limit;
  console.log(query.search);

  const where: any = {
    deletedAt: null,
    name: query.search ? { contains: query.search, mode: "insensitive" } : undefined,
  };

  const [total, data] = await Promise.all([
    prisma.book.count({
      where,
    }),
    prisma.book.findMany({
      where,
      include: {
        genre: true,
      },
      skip: offset,
      take: query.limit,
      orderBy: {
        title: query.orderByTitle || "asc",
        publicationYear: query.orderByPublishDate || "asc",
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

export const createBook = async ({
  genre_id: genreId,
  publication_year: publicationYear,
  stock_quantity: stockQuantity,
  ...payload
}: CreateBookRequest) => {
  return await prisma.book.create({
    data: {
      ...payload,
      genreId,
      publicationYear,
      stockQuantity,
    },
  });
};

export const bookExistsById = async (id: string) => {
  const count = await prisma.book.count({
    where: {
      AND: { id, deletedAt: null },
    },
  });
  return count > 0;
};

export const getBookById = async (id: string) => {
  return await prisma.book.findFirst({
    where: {
      AND: { id, deletedAt: null },
    },
    include: {
      genre: true,
    },
  });
};

export const getAllBooksByGenreIdPaginate = async (genreId: string, query: BookFilterQuery) => {
  const offset = (query.page - 1) * query.limit;
  console.log(query.search);

  const where: any = {
    deletedAt: null,
    genreId,
    name: query.search ? { contains: query.search, mode: "insensitive" } : undefined,
  };

  const [total, data] = await Promise.all([
    prisma.book.count({
      where,
    }),
    prisma.book.findMany({
      where,
      include: {
        genre: true,
      },
      skip: offset,
      take: query.limit,
      orderBy: {
        title: query.orderByTitle || "asc",
        publicationYear: query.orderByPublishDate || "asc",
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

export const updateBookById = async (
  id: string,
  {
    genre_id: genreId,
    publication_year: publicationYear,
    stock_quantity: stockQuantity,
    ...payload
  }: UpdateBookRequest
) => {
  return await prisma.book.update({
    where: { id },
    data: {
      ...payload,
      genreId,
      publicationYear,
      stockQuantity,
    },
  });
};

export const deleteBookById = async (id: string) => {
  return await prisma.book.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
