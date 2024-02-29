/**
 * Room service
 */

import prisma from "../prisma";

/**
 * Get all Rooms
 */
export const getRooms = () => {
	return prisma.room.findMany({
		orderBy: {
			name: "asc",
		},
	});
};

/**
 * Get single Room
 */

export const getRoom = (roomId: string) => {
	return prisma.room.findUnique({
		where: {
			id: roomId,
		},
	});
};
