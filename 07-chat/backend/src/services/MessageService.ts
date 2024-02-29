/**
 * Message service
 */

import prisma from "../prisma";
import { ChatMessageData } from "@shared/types/SocketTypes";

/**
 * Get messages in room
 */

export const getMessagesInRoom = (roomId: string) => {
	return prisma.message.findMany({
		where: {
			roomId,
		},
	});
};

/**
 * Create user
 */
export const createMessage = (data: ChatMessageData) => {
	return prisma.message.create({
		data,
	});
};
