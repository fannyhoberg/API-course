import { io, Socket } from "socket.io-client";
import {
  ChatMessageData,
  ClientToServerEvents,
  ServerToClientEvents,
  UserJoinResponse,
} from "@shared/types/SocketTypes";
import "./assets/scss/style.scss";
import { Room, User } from "@shared/types/Models";

const SOCKET_HOST = import.meta.env.VITE_SOCKET_HOST;
console.log("SOCKET_HOST:", SOCKET_HOST);

// Forms
const messageEl = document.querySelector("#message") as HTMLInputElement;
const messageFormEl = document.querySelector(
  "#message-form"
) as HTMLFormElement;
const userNameFormEl = document.querySelector(
  "#username-form"
) as HTMLFormElement;
const usernameInputEl = document.querySelector("#username") as HTMLInputElement;
const roomsEl = document.querySelector("#room") as HTMLSelectElement;

// Lists
const messagesEl = document.querySelector("#messages") as HTMLDivElement;

// Views
const chatView = document.querySelector("#chat-wrapper") as HTMLDivElement;
const startView = document.querySelector("#start") as HTMLDivElement;

// User Details
let username: string | null = null;
let roomId: string | null = null;

// Connect to Socket.IO Server
const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  io(SOCKET_HOST);

// Add multiple messages to the chat
const addMessagesToChat = (msgs: ChatMessageData[]) => {
  console.log("Adding messages to chat...");

  // Clear any previous messages from the chat
  (messageEl.innerHTML = ""),
    // Loop over messages and add them to the chat
    msgs.forEach((msg) => {
      addMessageToChat(msg);
    });
};

const addMessageToChat = (msg: ChatMessageData, ownMessage = false) => {
  const msgEl = document.createElement("li");

  // Set class of LI to "message"
  msgEl.classList.add("message");

  // Get read-able time
  const time = new Date(msg.timestamp).toLocaleTimeString();

  // If the message is from the user add class "own-message"
  if (ownMessage) {
    msgEl.classList.add("own-message");

    // Set text content of the LI element to the message
    msgEl.textContent = msg.content;

    // Set content of the LI element to the message
    msgEl.innerHTML = `<span class="content">${msg.content}</span><br><span class="time">${time}</span>`;
  } else {
    // Set text content of the LI element to the message
    msgEl.textContent = msg.content;

    // Set content of the LI element to the message
    msgEl.innerHTML = `<span class="user">${msg.username}</span><span class="content">${msg.content}</span><br><span class="time">${time}</span>`;
  }

  // Append the LI element to the messages element
  messagesEl.appendChild(msgEl);

  // scroll to bottom of the messages list
  msgEl.scrollIntoView({ behavior: "smooth" });
};

const addNoticeToChat = (msg: string, timestamp: number) => {
  const noticeEl = document.createElement("li");

  // Set class of LI to "message"
  noticeEl.classList.add("notice");

  // Get read-able time
  const time = new Date(timestamp).toLocaleTimeString();

  // Set content of the LI element to the message
  noticeEl.innerHTML = `
			<span class="content">${msg}</span>
			<span class="time">${time}</span>
		`;

  // Append the LI element to the messages element
  messagesEl.appendChild(noticeEl);

  // scroll to bottom of the messages list
  noticeEl.scrollIntoView({ behavior: "smooth" });
};

// Update online userslist

const updateOnlineUsers = (users: User[]) => {
  // list online users
  const usersOnlineEl = document.querySelector(
    "#online-users"
  ) as HTMLUListElement;

  usersOnlineEl.innerHTML = users
    // .sort((a) => (a.id === socket.id ? 1 : 0))
    .map((user) =>
      user.id === socket.id
        ? `<li class="me"><span>&#x1f9b8;</span>${user.username}</li>`
        : `<li><span>&#x1f47d;</span>${user.username}</li>`
    )
    .join("");
};

// Show chat view
const showChatView = () => {
  startView.classList.add("hide");
  chatView.classList.remove("hide");
};

// Show welcome/Start view
const showWelcomeView = () => {
  const connectBtnEl = document.querySelector(
    "#connectBtn"
  ) as HTMLButtonElement;

  connectBtnEl.disabled = true;
  roomsEl.innerHTML = `<option value="" selected>Loading...</option>`;

  // Request a list of rooms from the server

  socket.emit("getRoomList", (rooms: Room[]) => {
    // console.log("These are the rooms:", rooms);

    // Once we get them, populate the dropdown with rooms
    roomsEl.innerHTML = rooms
      .map((room) => `<option value="${room.id}">${room.name}</option>`)
      .join("");
  });

  // After that, enable the connect button
  connectBtnEl.disabled = false;

  // Show and remove classlist hide
  startView.classList.remove("hide");
  chatView.classList.add("hide");
};

/**
 * Socket handlers
 */
const handleUserJoinRequestCallback = (response: UserJoinResponse) => {
  console.log("Join was successful?", response);

  if (!response.success || !response.room) {
    alert("Could not join room for some reason");
    return;
  }

  // Update chat view title with room name
  const chatTitleEl = document.querySelector(
    "#chat-title"
  ) as HTMLHeadingElement;

  chatTitleEl.innerText = response.room.name;

  // Add message history to chat
  console.log("Message history: ", response.room.messages);
  addMessagesToChat(response.room.messages);

  updateOnlineUsers(response.room.users);

  // Show chat view
  showChatView();
};

// Listen for when connection is established
socket.on("connect", () => {
  console.log("💥 Connected to the server", socket.id);
  // Show welcome view
  showWelcomeView();
});

// Listen for when we're reconnected (either due to our or the servers connection)
socket.io.on("reconnect", () => {
  console.log("Reconnected to the server");

  // Emit `userJoinRequest`event, but only if we were in the chat previously
  if (username && roomId) {
    socket.emit(
      "userJoinRequest",
      username,
      roomId,
      handleUserJoinRequestCallback
    );
    addNoticeToChat("You're reconnected", Date.now());
  }
});

// Listen for when server got tired of us
socket.on("disconnect", () => {
  console.log("💀 Disconnected from the server");
});

// Listen for when the nice server says hello
socket.on("hello", () => {
  console.log("🤩 Hello! Is it me you're looking for?");
});

// Listen for new chat messages
socket.on("chatMessage", (msg) => {
  console.log("📨 YAY SOMEONE WROTE SOMETHING!!!!!!!", msg);

  /**
   * @todo 1
   * Create a function `addMessageToChat` that takes the
   * `msg` object as a parameter and creates a new LI-element,
   * sets the content + styling and appends it to `messagesEl`
   */
  addMessageToChat(msg);
});

// Listen for an updated list of online users
socket.on("onlineUsers", (users) => {
  updateOnlineUsers(users);
});

// Listen for when a new user joins the chat
socket.on("userJoined", (username, timestamp) => {
  console.log("👶🏻 A new user has joined the chat:", username, timestamp);

  addNoticeToChat(`${username} has joined the chat`, timestamp);
});

// Listen for when a new user leaves chat
socket.on("userLeft", (username, timestamp) => {
  console.log("👋🏻 A user has left the chat:", username, timestamp);

  addNoticeToChat(`${username} has left the chat`, timestamp);
});

// Get username from form and then show chat
userNameFormEl.addEventListener("submit", (e) => {
  e.preventDefault();

  // get username and room
  roomId = roomsEl.value;
  username = usernameInputEl.value.trim();

  // If no username or room, no join
  if (!username || !roomId) {
    return;
  }

  // Emit `userJoinRequest`-event to the server and wait for acknowledgement
  // BEFORE showing the chat view
  socket.emit(
    "userJoinRequest",
    username,
    roomId,
    handleUserJoinRequestCallback
  );
  console.log(
    `Emitted 'userJoinRequest' event to server, username=${username}, roomId=${roomId}`
  );
});

// Send a message to the server when form is submitted
messageFormEl.addEventListener("submit", (e) => {
  e.preventDefault();

  // 💇
  const trimmedMessage = messageEl.value.trim();

  // If no message, no send
  if (!trimmedMessage || !username || !roomId) {
    return;
  }

  // Construct message payload
  const msg: ChatMessageData = {
    username,
    content: trimmedMessage,
    timestamp: Date.now(),
    roomId,
  };

  // Send (emit) the message to the server
  socket.emit("sendChatMessage", msg);

  console.log("Emitted 'sendChatMessage' event to server", msg);

  /**
   * @todo 2
   * Extend the `addMessageToChat` function to know if the msg
   * was sent by us, and if so add `.own-message` class to the
   * LI-element before appending it to `messagesEl`
   */
  addMessageToChat(msg, true);

  // Clear the input field
  messageEl.value = "";
  messageEl.focus();
});
