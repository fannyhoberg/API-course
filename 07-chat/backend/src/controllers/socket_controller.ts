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

		// Broadcast message to everyone connected (in that toom) EXCEPT the sender
		socket.to(msg.roomId).emit("chatMessage", msg);
	});

	// Listen for a user join request
	socket.on("userJoinRequest", async (username, roomId, callback) => {
		debug("User %s wants to join the room %s", username, roomId);

		// Get room from database
		const room = await prisma.room.findUnique({
			where: {
				id: roomId,
			},
		});

		// If room was not found, respond with success: false
		if (!room) {
			callback({
				success: false,
				room: null,
			});
			return;
		}

		// Join room `roomId`
		socket.join(roomId);

		// Create a User in the database and set roomId
		const user = await prisma.user.create({
			data: {
				id: socket.id,
				username: username,
				roomId: roomId,
			},
		});

		console.log("This is user: ", user);

		// Retreieve a list of Users for the Room
		const usersInRoom = await prisma.user.findMany({
			where: {
				roomId: roomId,
			},
		});
		console.log("This is usersInRoom: ", usersInRoom);

		// Respond with room info
		// (here we could check the username and deny access if it was already in use)
		callback({
			success: true,
			room: {
				id: room.id,
				name: room.name,
				users: usersInRoom, // send the user the list of users in the room
			},
		});

		// Let everyone else in the room know that a new user has joined
		socket.to(roomId).emit("userJoined", username, Date.now());
	});

	// Handle user disconnecting
	socket.on("disconnect", async () => {
		debug("👋🏻 A user disconnected", socket.id);

		// Find user in ordet to know wich room he/she was in
		const user = await prisma.user.findUnique({
			where: {
				id: socket.id,
			},
		});

		// If user didn't exist, do nothing
		if (!user) {
			return;
		}

		// remove user
		await prisma.user.delete({
			where: {
				id: socket.id,
			},
		});
	});
};
