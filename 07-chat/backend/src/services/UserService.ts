/**
 * User service
 */

import { User } from "@shared/types/Models";
import prisma from "../prisma";

/**
 * Get users currently online in a room
 *
 * @param roomId ID of room
 * @returns List of users
 */
export const getUsersInRoom = (roomId: string) => {
	return prisma.user.findMany({
		where: {
			roomId,
		},
	});
};

/**
 * Get single user
 */
export const getUser = (userId: string) => {
	return prisma.user.findUnique({
		where: {
			id: userId,
		},
	});
};

/**
 * Create user
 */
export const createUser = (data: User) => {
	return prisma.user.create({
		data,
	});
};

/**
 * Delete single user
 */
export const deleteUser = (userId: string) => {
	return prisma.user.delete({
		where: {
			id: userId,
		},
	});
};

/**
 * Delete all the users
 */
export const deleteAllUsers = () => {
	return prisma.user.deleteMany();
};
