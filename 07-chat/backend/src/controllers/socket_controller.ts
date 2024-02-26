/**
 * Socket Controller
 */
import Debug from "debug";
import { Server, Socket } from "socket.io";
import {
	ClientToServerEvents,
	ServerToClientEvents,
} from "@shared/types/SocketTypes";
import { Room } from "@prisma/client";
import prisma from "../prisma";

// Create a new debug instance
const debug = Debug("chat:socket_controller");

// Handle a user connecting
export const handleConnection = (
	socket: Socket<ClientToServerEvents, ServerToClientEvents>,
	io: Server<ClientToServerEvents, ServerToClientEvents>
) => {
	debug("🙋 A user connected", socket.id);

	// Say hello to the user
	socket.emit("hello");
	debug("🤩 Said hello to the nice user", socket.id);

	// Listen for room list request
	socket.on("getRoomList", async (callback) => {
		const allRooms = await prisma.room.findMany({
			orderBy: {
				name: "asc",
			},
		});
		debug("These are the rooms: ", allRooms);

		callback(allRooms);
	});

	// Listen for incoming chat messages
	socket.on("sendChatMessage", (msg) => {
		debug("📨 New chat message", socket.id, msg);

		// Broadcast message to everyone connected EXCEPT the sender
		socket.to(msg.roomId).emit("chatMessage", msg);
	});

	// Listen for a user join request
	socket.on("userJoinRequest", (username, roomId, callback) => {
		debug("User %s wants to join the room %s", username, roomId);

		// Join room `roomId`
		socket.join(roomId);

		// Always let the user in (for now 😈)
		// (here we could check the username and deny access if it was already in use)
		callback(true);

		// Let everyone else in the room know that a new user has joined
		socket.to(roomId).emit("userJoined", username, Date.now());
	});

	// Handle user disconnecting
	socket.on("disconnect", () => {
		debug("👋🏻 A user disconnected", socket.id);
	});
};
