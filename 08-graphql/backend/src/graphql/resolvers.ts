// Resolvers define how to fetch the types defined in your schema.

import prisma from "../prisma";

const resolvers = {
  Query: {
    publishers: () => {
      return prisma.publisher.findMany();
    },
    authors: () => {
      return prisma.author.findMany();
    },
    books: () => {
      return prisma.book.findMany();
    },
  },
};

export default resolvers;
