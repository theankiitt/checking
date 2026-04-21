# WebSocket Chat System

## Overview

The API includes a real-time WebSocket chat system that allows customers to chat with administrators in real-time.

## Features

- **Real-time messaging** - Instant message delivery via WebSocket
- **Multiple chat rooms** - Support for multiple concurrent conversations
- **User authentication** - JWT-based authentication for WebSocket connections
- **Admin dashboard** - Admins can view and respond to all chat rooms
- **Typing indicators** - Real-time typing status
- **Read receipts** - Track when messages are read
- **Persistent storage** - All messages stored in PostgreSQL

## Architecture

```
┌──────────────┐         WebSocket         ┌──────────────┐
│  Customer    │ ◄──────────────────────► │   WebSocket  │
│  (Browser)  │                           │   Server     │
└──────────────┘                           └──────┬───────┘
                                                  │
                                                  │ Socket.IO
                                                  │
                     ┌──────────────┐              │
                     │    Admin    │ ◄────────────┘
                     │  (Browser)  │
                     └──────────────┘
```

## Database Schema

### ChatRoom

Stores chat room sessions.

```prisma
model ChatRoom {
  id            String        @id @default(cuid())
  userId       String?
  userEmail    String?
  userName     String?
  adminId      String?
  status       ChatRoomStatus @default(OPEN)
  isActive     Boolean       @default(true)
  lastMessage  String?
  lastMessageAt DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  messages     ChatMessage[]
}
```

### ChatMessage

Stores individual messages.

```prisma
model ChatMessage {
  id        String            @id @default(cuid())
  roomId    String
  senderId  String?
  senderType ChatMessageSender
  content   String
  isRead    Boolean           @default(false)
  readAt    DateTime?
  createdAt DateTime          @default(now())
  room      ChatRoom          @relation(...)
}
```

## WebSocket Events

### Client → Server

#### room:create

Create a new chat room.

```javascript
socket.emit("room:create", { message: "Hello, I need help" });
```

**Response:**

```javascript
socket.on("room:created", (room) => {
  console.log("Room created:", room.id);
});
```

#### room:join

Join an existing chat room.

```javascript
socket.emit("room:join", { roomId: "room_id_here" });
```

#### message:send

Send a message to a chat room.

```javascript
socket.emit("message:send", {
  roomId: "room_id_here",
  content: "Hello!",
});
```

#### typing:start / typing:stop

Indicate typing status.

```javascript
socket.emit("typing:start", { roomId: "room_id_here" });
socket.emit("typing:stop", { roomId: "room_id_here" });
```

### Server → Client

#### room:new (Admin only)

New chat room created (notifies admins).

```javascript
socket.on("room:new", (room) => {
  console.log("New chat room:", room.id);
});
```

#### message:received

New message received.

```javascript
socket.on("message:received", (message) => {
  console.log("New message:", message.content);
});
```

#### typing:started / typing:stopped

Other user is typing.

```javascript
socket.on("typing:started", ({ roomId, userId }) => {
  console.log("User is typing...");
});
```

#### room:closed

Chat room has been closed.

```javascript
socket.on("room:closed", (room) => {
  console.log("Room closed:", room.id);
});
```

## Authentication

WebSocket connections support two authentication methods:

1. **Token in auth object:**

```javascript
const socket = io("http://localhost:4444", {
  auth: {
    token: "your_jwt_token",
  },
});
```

2. **Bearer token in header:**

```javascript
const socket = io("http://localhost:4444", {
  extraHeaders: {
    Authorization: "Bearer your_jwt_token",
  },
});
```

Guest users (no token) can create chat rooms but won't have full functionality.

## Usage Examples

### Customer (Web Frontend)

```javascript
import { io } from "socket.io-client";

class ChatService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io("http://localhost:4444", {
      auth: { token },
    });

    this.socket.on("message:received", (message) => {
      console.log("New message:", message);
    });

    this.socket.on("typing:started", ({ roomId }) => {
      console.log("Admin is typing...");
    });
  }

  startChat(initialMessage) {
    this.socket.emit("room:create", { message: initialMessage });
  }

  sendMessage(roomId, content) {
    this.socket.emit("message:send", { roomId, content });
  }

  sendTyping(roomId) {
    this.socket.emit("typing:start", { roomId });
    setTimeout(() => {
      this.socket.emit("typing:stop", { roomId });
    }, 2000);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
```

### Admin (Admin Dashboard)

```javascript
import { io } from "socket.io-client";

class AdminChatService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io("http://localhost:4444", {
      auth: { token },
    });

    // Get list of active chat rooms
    this.socket.emit("admin:list");
    this.socket.on("admin:rooms", (rooms) => {
      console.log("Active rooms:", rooms);
    });

    // New chat room notification
    this.socket.on("room:new", (room) => {
      console.log("New chat room:", room);
      // Show notification, update UI
    });

    // New message notification
    this.socket.on("notification:new_message", ({ roomId, message }) => {
      console.log("New message in room:", roomId);
      // Show notification, update badge
    });
  }

  assignRoom(roomId) {
    this.socket.emit("admin:assign", { roomId });
  }

  joinRoom(roomId) {
    this.socket.emit("room:join", { roomId });
  }

  sendMessage(roomId, content) {
    this.socket.emit("message:send", { roomId, content });
  }

  closeRoom(roomId) {
    this.socket.emit("room:close", { roomId });
  }
}
```

## REST API Endpoints

### User Endpoints

#### GET /api/v1/chat/rooms

Get user's chat rooms.

**Requires:** Authentication

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "room_id",
      "status": "OPEN",
      "lastMessage": "Hello!",
      "messages": [...]
    }
  ]
}
```

#### GET /api/v1/chat/rooms/:id

Get chat room with messages.

**Requires:** Authentication

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "room_id",
    "status": "OPEN",
    "messages": [
      {
        "id": "msg_id",
        "content": "Hello!",
        "senderType": "USER",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Admin Endpoints

#### GET /api/v1/chat/admin/rooms

Get all active chat rooms (admin only).

**Requires:** Admin role

#### PATCH /api/v1/chat/rooms/:id/close

Close a chat room.

**Requires:** Authentication

### Public Endpoints

#### GET /api/v1/chat/status

Check if chat service is available.

**Response:**

```json
{
  "success": true,
  "data": {
    "online": true
  }
}
```

## Environment Variables

No additional environment variables required for WebSocket functionality.

## WebSocket Configuration

WebSocket is configured in `src/websocket/chatWebSocket.ts` with the following settings:

- **CORS**: Enabled for configured origins
- **Path**: `/socket.io`
- **Transports**: WebSocket (default)
- **Authentication**: JWT-based

## Best Practices

1. **Reconnection**: Implement automatic reconnection logic
2. **Error handling**: Handle connection errors gracefully
3. **Typing indicators**: Debounce typing events
4. **Message queuing**: Queue messages when disconnected
5. **Token refresh**: Handle token expiration during connection

## Troubleshooting

### Connection refused

- Check if server is running on correct port
- Verify CORS settings allow your origin
- Check firewall/proxy settings

### Authentication errors

- Ensure JWT token is valid and not expired
- Verify token is passed correctly (auth object or header)

### Messages not delivered

- Check if user is connected to correct room
- Verify room exists and is active
- Check network connectivity

### Admin not receiving notifications

- Ensure admin is connected and authenticated
- Check admin role permissions

## Related Files

- `src/websocket/chatWebSocket.ts` - WebSocket server implementation
- `src/routes/chat.ts` - REST API endpoints
- `prisma/schema.prisma` - Database schema
