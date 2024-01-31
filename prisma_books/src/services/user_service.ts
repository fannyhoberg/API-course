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
 * Get Users book
 *
 */

export const getUserBooks = async (userId: number) => {
  return await prisma.user.findUnique({
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

export const addUserToBook = async (
  userId: number,
  bookIds: BookId | BookId[]
) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      books: {
        connect: bookIds,
      },
    },
    include: {
      books: true,
    },
  });
};
