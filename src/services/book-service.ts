import {
  BookFilterQuery,
  CreateBookRequest,
  CreateBookResponse,
  GetBookResponse,
  GetBookResponseByGenre,
  UpdateBookRequest,
  UpdateBookResponse,
} from '../domains/book-domain';
import { HTTPResponse } from '../libs/http';
import {
  bookExistsById,
  createBook,
  deleteBookById,
  getAllBooksByGenreIdPaginate,
  getAllBooksPaginate,
  getBookById,
  updateBookById,
} from '../repositories/book-repository';
import { genreExistsById, getGenreById } from '../repositories/genre-repository';

export const createBookService = async (
  body: CreateBookRequest
): Promise<HTTPResponse<CreateBookResponse>> => {
  const res = new HTTPResponse<CreateBookResponse>();
  try {
    const exists = await genreExistsById(body.genre_id);
    if (!exists) {
      res.withCode(404).withMessage('Genre not found');
      return res;
    }

    const book = await createBook(body);

    res.withCode(201).withMessage('Book created successfully').withData({
      id: book.id,
      title: book.title,
      created_at: book.createdAt,
    });

    return res;
  } catch (error) {
    res.withCode(500).withMessage('Internal server error');
    return res;
  }
};

export const getAllBooksService = async (
  filter: BookFilterQuery
): Promise<HTTPResponse<GetBookResponse[]>> => {
  const res = new HTTPResponse<GetBookResponse[]>();
  try {
    const { data, prev, next } = await getAllBooksPaginate(filter);
    res
      .withCode(200)
      .withMessage('Get all genre successfully')
      .withMeta({
        page: filter.page,
        limit: filter.limit,
        prev_page: prev,
        next_page: next,
      })
      .withData(
        data.map((book) => ({
          id: book.id,
          image: book.image,
          description: book.description,
          title: book.title,
          genre: book.genre.name,
          publication_year: book.publicationYear,
          stock_quantity: book.stockQuantity,
          price: book.price,
          publisher: book.publisher,
          writer: book.writer,
        }))
      );
    return res;
  } catch (error) {
    res.withCode(500).withMessage('Internal server error');
    return res;
  }
};

export const getSingleBookService = async (id: string): Promise<HTTPResponse<GetBookResponse>> => {
  const res = new HTTPResponse<GetBookResponse>();
  try {
    const book = await getBookById(id);

    if (!book) {
      res.withCode(404).withMessage('Book not found');
      return res;
    }

    res.withCode(200).withMessage('Book retrieved successfully').withData({
      id: book.id,
      image: book.image,
      description: book.description,
      title: book.title,
      genre: book.genre.name,
      publication_year: book.publicationYear,
      stock_quantity: book.stockQuantity,
      price: book.price,
      publisher: book.publisher,
      writer: book.writer,
    });

    return res;
  } catch (error) {
    res.withCode(500).withMessage('Internal server error');
    return res;
  }
};

export const getBooksByGenreService = async (
  genreId: string,
  filter: BookFilterQuery
): Promise<HTTPResponse<GetBookResponseByGenre>> => {
  const res = new HTTPResponse<GetBookResponseByGenre>();
  try {
    const genre = await getGenreById(genreId);
    if (!genre) {
      res.withCode(404).withMessage('Genre not found');
      return res;
    }

    const { data, prev, next } = await getAllBooksByGenreIdPaginate(genreId, filter);
    res
      .withCode(200)
      .withMessage('Get all books by genre successfully')
      .withMeta({
        page: filter.page,
        limit: filter.limit,
        prev_page: prev,
        next_page: next,
      })
      .withData({
        genre_id: genre.id,
        genre_title: genre.name,
        books: data.map((book) => ({
          id: book.id,
          image: book.image,
          title: book.title,
          writer: book.writer,
          description: book.description,
          publication_year: book.publicationYear,
          stock_quantity: book.stockQuantity,
          price: book.price,
          publisher: book.publisher,
          genre: genre.name,
        })),
      });
    return res;
  } catch (error) {
    res.withCode(500).withMessage('Internal server error');
    return res;
  }
};

export const updateBookService = async (
  id: string,
  body: UpdateBookRequest
): Promise<HTTPResponse<UpdateBookResponse>> => {
  const res = new HTTPResponse<UpdateBookResponse>();
  try {
    const exists = await bookExistsById(id);
    if (!exists) {
      res.withCode(404).withMessage('Book not found');
      return res;
    }

    const book = await updateBookById(id, body);

    res.withCode(200).withMessage('Book updated successfully').withData({
      id: book.id,
      title: book.title,
      updated_at: book.updatedAt,
    });

    return res;
  } catch (error) {
    res.withCode(500).withMessage('Internal server error');
    return res;
  }
};

export const deleteBookService = async (id: string): Promise<HTTPResponse<never>> => {
  const res = new HTTPResponse<never>();
  try {
    const exists = await bookExistsById(id);
    if (!exists) {
      res.withCode(404).withMessage('Book not found');
      return res;
    }

    await deleteBookById(id);

    res.withCode(200).withMessage('Book deleted successfully');

    return res;
  } catch (error) {
    res.withCode(500).withMessage('Internal server error');
    return res;
  }
};
