/**
 * User service
 */
import prisma from "../prisma";
import { User } from "@prisma/client";
import { CreateUser, UpdateUser } from "../types/User_types";
import { BookId } from "../types/Book_types";

/**
 * Get a User by email
 *
 * @param email Email of user to get
 */

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

/**
 * Get a User by id
 *
 * @param email id of user to get
 */

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

/**
 * Get user
 *
 */
export const getUser = async () => {
  return await prisma.user.findMany();
};

/**
 * Create a user
 *
 *  * @param data User data
 */

export const createUser = async (data: CreateUser) => {
  return await prisma.user.create({
    data,
  });
};

/**
 * Update Users profile
 *
 */
export const updateProfile = async (userId: number, data: UpdateUser) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
};

/**
 * Get Users book
 *
 */

export const getUserBooks = async (userId: number) => {
  return await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      books: true,
    },
  });
};

/**
 * Add User to book
 *
 */

export const addUserBooks = async (
  userId: number,
  bookIds: BookId | BookId[]
) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      books: {
        connect: bookIds,
      },
    },
    select: {
      // select gör att det endast är books vi kommer att se, tillskillnad från include där vi även får med profile
      books: true,
    },
  });
  return user.books;
};

/**
 * Remove book from User
 *
 */

export const deleteUserBook = async (userId: number, bookId: number) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      books: {
        disconnect: {
          id: bookId,
        },
      },
    },
    select: {
      // select gör att det endast är books vi kommer att se, tillskillnad från include där vi även får med profile
      books: true,
    },
  });
};
