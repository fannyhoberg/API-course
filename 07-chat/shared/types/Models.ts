export {};

export interface Room {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  roomId: string;
}

// export interface Message {
//   id: string;
//   username: string;
//   content: string;
//   roomId: string;
//   timestamp: string;
// }
