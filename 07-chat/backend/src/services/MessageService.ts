/**
 * Message service
 */

import prisma from "../prisma";
import { ChatMessageData } from "@shared/types/SocketTypes";

/**
 * Get latest messages sent in a room
 */

export const getLatestMessages = (roomId: string, maxAge = 3600) => {
	const past = Date.now() - maxAge * 1000;

	return prisma.message.findMany({
		where: {
			roomId,
			timestamp: {
				gte: past,
			},
		},
		orderBy: {
			timestamp: "asc", // order in database might not be the same
		},
		take: 10, // get only the 10 latest messages
	});
};

/**
 * Create user
 */
export const createMessage = async (msg: ChatMessageData) => {
	// Fake latency (a slow database)
	// await new Promise(r => setTimeout(r, 500));

	return prisma.message.create({
		data: msg,
	});
};
