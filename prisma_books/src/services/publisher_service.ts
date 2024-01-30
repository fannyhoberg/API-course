import prisma from "../prisma";
import { CreatePublisher, UpdatePublisher } from "../types/Publisher_types";

/**
 * Get all publishers
 */
export const getPublishers = async () => {
  return await prisma.publisher.findMany();
};

/**
 * Get single publisher
 */
export const getPublisher = async (publisherId: number) => {
  return await prisma.publisher.findUniqueOrThrow({
    where: {
      id: publisherId,
    },
    include: {
      books: true,
    },
  });
};
/**
 * Create a publisher
 *
 */

export const createPublisher = async (data: CreatePublisher) => {
  return await prisma.publisher.create({
    data,
  });
};

/**
 * Update publisher
 */
export const updatePublisher = async (
  publisherId: number,
  data: UpdatePublisher
) => {
  return await prisma.publisher.update({
    where: {
      id: publisherId,
    },
    data,
  });
};

/**
 * Delete a publisher
 */
export const deletePublisher = async (publisherId: number) => {
  return await prisma.publisher.delete({
    where: {
      id: publisherId,
    },
  });
};
