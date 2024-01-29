/**
 * Author Service
 */
import { Author } from "@prisma/client";
import prisma from "../prisma";
import { CreateAuthor, UpdateAuthor } from "../types/Author_types";

/**
 * Get all authors
 */
export const getAuthors = async () => {
  return await prisma.author.findMany();
};

/**
 * Get a single author
 *
 * @param authorId The id of the author to get
 */
export const getAuthor = async (authorId: number) => {
  return await prisma.author.findUniqueOrThrow({
    where: {
      id: authorId,
    },
    include: {
      books: true,
    },
  });
};

/**
 * Create an author
 *
 */

export const createAuthor = async (data: CreateAuthor) => {
  return await prisma.author.create({
    data,
  });
};

/**
 * Update author
 */

export const updateAuthor = async (authorId: number, data: UpdateAuthor) => {
  return await prisma.author.update({
    where: {
      id: authorId,
    },
    data,
  });
};

/**
 * Delete an author
 *
 * @param authorId The id of the author to delete
 */
export const deleteAuthor = async (authorId: number) => {
  return await prisma.author.delete({
    where: {
      id: authorId,
    },
  });
};
