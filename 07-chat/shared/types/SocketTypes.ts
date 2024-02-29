export {};
import { Room, User } from "./Models";

// Events emitted by the server to the client
export interface ServerToClientEvents {
  hello: () => void;
  chatMessage: (msg: ChatMessageData) => void;
  onlineUsers: (users: User[]) => void;
  userJoined: (username: string, timestamp: number) => void;
  userLeft: (username: string, timestamp: number) => void;
}

// Events emitted by the client to the server
export interface ClientToServerEvents {
  getRoomList: (callback: (rooms: Room[]) => void) => void;
  sendChatMessage: (msg: ChatMessageData) => void;
  userJoinRequest: (
    username: string,
    roomId: string,
    callback: (result: UserJoinResponse) => void
  ) => void;
}

// Message payload
export interface ChatMessageData {
  // id: string;
  username: string;
  content: string;
  timestamp: number;
  roomId: string;
}

// Room with users
export interface RoomWithUsers extends Room {
  users: User[];
}

// User join Response
export interface UserJoinResponse {
  success: boolean;
  room: RoomWithUsers | null;
}
