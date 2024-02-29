/**
 * Socket Controller
 */
import Debug from "debug";
import { Server, Socket } from "socket.io";
import {
	ClientToServerEvents,
	ServerToClientEvents,
} from "@shared/types/SocketTypes";
import {
	createUser,
	deleteUser,
	getUser,
	getUsersInRoom,
} from "../services/UserService";
import { getRoom, getRooms } from "../services/RoomService";
import { createMessage, getLatestMessages } from "../services/MessageService";

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
		const allRooms = await getRooms();
		debug("These are the rooms: ", allRooms);

		callback(allRooms);
	});

	// Listen for incoming chat messages
	socket.on("sendChatMessage", async (msg) => {
		debug("📨 New chat message", socket.id, msg);

		// Broadcast message to everyone connected (in that toom) EXCEPT the sender
		socket.to(msg.roomId).emit("chatMessage", msg);

		// THEN we save the message to the database, so that message broadcasts faster
		// Save message to db
		await createMessage(msg);
		debug("🏊‍♀️ Saved chat message");
	});

	// Listen for a user join request
	socket.on("userJoinRequest", async (username, roomId, callback) => {
		debug("User %s wants to join the room %s", username, roomId);

		// Get room from database
		const room = await getRoom(roomId);

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
		const user = await createUser({
			id: socket.id,
			username: username,
			roomId: roomId,
		});

		debug("Created user: ", user);

		// Retreieve a list of Users for the Room
		const usersInRoom = await getUsersInRoom(roomId);

		// Retrieve messages sent to the Room
		const messages = await getLatestMessages(roomId, 1.25 * 60 * 60);

		// Respond with room info
		// (here we could also check the username and deny access if it was already in use)
		callback({
			success: true,
			room: {
				id: room.id,
				name: room.name,
				messages,
				users: usersInRoom, // Send the user the list of users in the room
			},
		});

		// Let everyone else in the room know that a new user has joined
		socket.to(roomId).emit("userJoined", username, Date.now());

		// Broadcast a new list of users in the room to everyone else
		socket.to(roomId).emit("onlineUsers", usersInRoom);
	});

	// Handle user disconnecting
	socket.on("disconnect", async () => {
		debug("👋🏻 A user disconnected", socket.id);

		// Find user in ordet to know wich room he/she was in
		const user = await getUser(socket.id);

		// If user didn't exist, do nothing
		if (!user) {
			return;
		}

		// remove user
		await deleteUser(socket.id);

		// Retreieve a list of Users for the Room
		const usersInRoom = await getUsersInRoom(user.roomId);

		// broadcast a notice to the room that the user has left
		io.to(user.roomId).emit("userLeft", user.username, Date.now());

		// Also broadcast a new list of users in the room
		io.to(user.roomId).emit("onlineUsers", usersInRoom);
	});
};
