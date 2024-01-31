/**
 * User service
 */
import prisma from "../prisma";
import { User } from "@prisma/client";
import { CreateUser } from "../types/User_types";

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
 * Create a user
 *
 *  * @param data User data
 */

export const createUser = async (data: CreateUser) => {
  return await prisma.user.create({
    data,
  });
};
