import prisma from "../prisma";
import { CreateBook, UpdateBook } from "../types/Book_types";

/**
 * Get all Books
 */

export const getBooks = async () => {
  return await prisma.book.findMany();
};

/**
 * Show single Book
 */
export const getBook = async (bookId: number) => {
  return await prisma.book.findUniqueOrThrow({
    where: {
      id: bookId,
    },
    include: {
      authors: true,
    },
  });
};

/**
 * Create Book
 */

export const createBook = async (data: CreateBook) => {
  return await prisma.book.create({
    data,
  });
};

/**
 * Update Book
 */

export const updateBook = async (bookId: number, data: UpdateBook) => {
  return await prisma.book.update({
    where: {
      id: bookId,
    },
    data,
  });
};

/**
 * Delete a book
 */

export const deleteBook = async (bookId: number) => {
  return await prisma.book.delete({
    where: {
      id: bookId,
    },
  });
};

/**
 * Link book to author(s)
 */
// export const addAuthorToBook = async(bookId: number, data: UpdateBook) => {
//   return await prisma.book.update({
//     where: {
//       id: bookId,
//     },
//     data: {
//       authors: {
//         connect: data,
//       },
//     },
//     include: {
//       authors: true,
//     },
//   });
// }
