import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import prisma from "@/config/database";
import { logger } from "@/utils/logger";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  userEmail?: string;
}

class ChatWebSocketManager {
  private io: Server | null = null;
  private userSockets: Map<string, Set<string>> = new Map();
  private adminSockets: Set<string> = new Set();
  private socketToRoom: Map<string, string> = new Map();

  initialize(server: HttpServer): Server {
    this.io = new Server(server, {
      cors: {
        origin: env.CORS_ORIGIN?.split(",") || ["http://localhost:4000"],
        credentials: true,
      },
      path: "/socket.io",
      maxHttpBufferSize: 1e8, // 100 MB (in bytes)
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.io.use(this.authenticateSocket.bind(this));

    this.io.on("connection", this.handleConnection.bind(this));

    logger.info("Chat WebSocket server initialized", {
      type: "WEBSOCKET",
      event: "INITIALIZED",
    });

    return this.io;
  }

  private async authenticateSocket(
    socket: AuthenticatedSocket,
    next: (err?: Error) => void,
  ): Promise<void> {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        socket.userId = `guest-${socket.id}`;
        socket.userRole = "GUEST";
        socket.userEmail = undefined;
        logger.debug("WebSocket: Guest connection", { socketId: socket.id });
        return next();
      }

      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.userEmail = decoded.email;

      logger.debug("WebSocket: Authenticated connection", {
        socketId: socket.id,
        userId: socket.userId,
        role: socket.userRole,
      });

      next();
    } catch (error) {
      logger.warn("WebSocket: Authentication failed", { error });
      next(new Error("Authentication error"));
    }
  }

  private async handleConnection(socket: AuthenticatedSocket): Promise<void> {
    const { userId, userRole, userEmail } = socket;

    logger.info("WebSocket: Client connected", {
      type: "WEBSOCKET",
      event: "CONNECT",
      socketId: socket.id,
      userId,
      role: userRole,
    });

    if (userRole === "ADMIN") {
      this.adminSockets.add(socket.id);
      this.emitAdminList();
      socket.emit("admin:connected", { socketId: socket.id });
      logger.debug("WebSocket: Admin connected", { socketId: socket.id });
    } else if (userId && !userId.startsWith("guest-")) {
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(socket.id);

      const activeRooms = await prisma.chatRoom.findMany({
        where: {
          userId,
          status: "OPEN",
          isActive: true,
        },
        orderBy: { createdAt: "desc" },
      });

      activeRooms.forEach((room) => {
        socket.join(`room:${room.id}`);
        this.socketToRoom.set(socket.id, room.id);
      });

      socket.emit("rooms:list", activeRooms);
    }

    socket.on("room:create", (data) => this.handleCreateRoom(socket, data));
    socket.on("room:join", (data) => this.handleJoinRoom(socket, data));
    socket.on("room:close", (data) => this.handleCloseRoom(socket, data));

    socket.on("message:send", (data) => this.handleSendMessage(socket, data));
    socket.on("message:read", (data) => this.handleReadMessage(socket, data));

    socket.on("typing:start", (data) => this.handleTypingStart(socket, data));
    socket.on("typing:stop", (data) => this.handleTypingStop(socket, data));

    socket.on("admin:assign", (data) => this.handleAdminAssign(socket, data));
    socket.on("admin:list", () => this.handleAdminList(socket));

    socket.on("disconnect", () => this.handleDisconnect(socket));

    socket.on("error", (error) => {
      logger.error("WebSocket: Socket error", {
        error: error.message,
        socketId: socket.id,
      });
    });
  }

  private async handleCreateRoom(
    socket: AuthenticatedSocket,
    data: { message?: string },
  ): Promise<void> {
    try {
      const room = await prisma.chatRoom.create({
        data: {
          userId: socket.userId?.startsWith("guest-") ? null : socket.userId!,
          userEmail: socket.userEmail || data.message,
          userName: socket.userEmail,
          status: "OPEN",
        },
      });

      socket.join(`room:${room.id}`);
      this.socketToRoom.set(socket.id, room.id);

      const message = await prisma.chatMessage.create({
        data: {
          roomId: room.id,
          senderType: "USER",
          senderId: socket.userId!,
          content: data.message || "Started a chat",
        },
      });

      await prisma.chatRoom.update({
        where: { id: room.id },
        data: {
          lastMessage: data.message || "Started a chat",
          lastMessageAt: new Date(),
        },
      });

      socket.emit("room:created", room);
      socket.to(`room:${room.id}`).emit("room:updated", room);

      this.adminSockets.forEach((adminSocketId) => {
        this.io?.to(adminSocketId).emit("room:new", room);
      });

      logger.info("WebSocket: Room created", {
        type: "CHAT",
        event: "ROOM_CREATED",
        roomId: room.id,
        userId: socket.userId,
      });
    } catch (error) {
      logger.error("WebSocket: Failed to create room", {
        error: (error as Error).message,
      });
      socket.emit("error", { message: "Failed to create chat room" });
    }
  }

  private async handleJoinRoom(
    socket: AuthenticatedSocket,
    data: { roomId: string },
  ): Promise<void> {
    try {
      const room = await prisma.chatRoom.findUnique({
        where: { id: data.roomId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      socket.join(`room:${room.id}`);
      this.socketToRoom.set(socket.id, room.id);

      socket.emit("room:joined", room);

      logger.debug("WebSocket: Joined room", {
        roomId: room.id,
        socketId: socket.id,
        userId: socket.userId,
      });
    } catch (error) {
      logger.error("WebSocket: Failed to join room", {
        error: (error as Error).message,
      });
      socket.emit("error", { message: "Failed to join chat room" });
    }
  }

  private async handleCloseRoom(
    socket: AuthenticatedSocket,
    data: { roomId: string },
  ): Promise<void> {
    try {
      const room = await prisma.chatRoom.update({
        where: { id: data.roomId },
        data: { status: "CLOSED" },
      });

      this.io?.to(`room:${room.id}`).emit("room:closed", room);

      logger.info("WebSocket: Room closed", {
        type: "CHAT",
        event: "ROOM_CLOSED",
        roomId: room.id,
        closedBy: socket.userId,
      });
    } catch (error) {
      logger.error("WebSocket: Failed to close room", {
        error: (error as Error).message,
      });
      socket.emit("error", { message: "Failed to close chat room" });
    }
  }

  private async handleSendMessage(
    socket: AuthenticatedSocket,
    data: { roomId: string; content: string },
  ): Promise<void> {
    try {
      const room = await prisma.chatRoom.findUnique({
        where: { id: data.roomId },
      });

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      const senderType = socket.userRole === "ADMIN" ? "ADMIN" : "USER";
      const senderId = socket.userId!;

      const message = await prisma.chatMessage.create({
        data: {
          roomId: data.roomId,
          senderType,
          senderId,
          content: data.content,
        },
      });

      await prisma.chatRoom.update({
        where: { id: data.roomId },
        data: {
          lastMessage: data.content,
          lastMessageAt: new Date(),
          adminId: senderType === "ADMIN" ? senderId : room.adminId,
        },
      });

      this.io?.to(`room:${data.roomId}`).emit("message:received", message);

      if (senderType === "USER") {
        this.adminSockets.forEach((adminSocketId) => {
          this.io?.to(adminSocketId).emit("notification:new_message", {
            roomId: data.roomId,
            message,
          });
        });
      }

      logger.debug("WebSocket: Message sent", {
        type: "CHAT",
        event: "MESSAGE_SENT",
        roomId: data.roomId,
        messageId: message.id,
        senderType,
      });
    } catch (error) {
      logger.error("WebSocket: Failed to send message", {
        error: (error as Error).message,
      });
      socket.emit("error", { message: "Failed to send message" });
    }
  }

  private async handleReadMessage(
    socket: AuthenticatedSocket,
    data: { roomId: string; messageId?: string },
  ): Promise<void> {
    try {
      if (data.messageId) {
        await prisma.chatMessage.update({
          where: { id: data.messageId },
          data: { isRead: true, readAt: new Date() },
        });
      } else {
        await prisma.chatMessage.updateMany({
          where: {
            roomId: data.roomId,
            senderType: socket.userRole === "ADMIN" ? "USER" : "ADMIN",
            isRead: false,
          },
          data: { isRead: true, readAt: new Date() },
        });
      }

      socket.to(`room:${data.roomId}`).emit("message:read", {
        roomId: data.roomId,
        messageId: data.messageId,
        readBy: socket.userId,
      });

      logger.debug("WebSocket: Messages marked as read", {
        roomId: data.roomId,
        readBy: socket.userId,
      });
    } catch (error) {
      logger.error("WebSocket: Failed to mark message as read", {
        error: (error as Error).message,
      });
    }
  }

  private async handleTypingStart(
    socket: AuthenticatedSocket,
    data: { roomId: string },
  ): Promise<void> {
    socket.to(`room:${data.roomId}`).emit("typing:started", {
      roomId: data.roomId,
      userId: socket.userId,
      userRole: socket.userRole,
    });
  }

  private async handleTypingStop(
    socket: AuthenticatedSocket,
    data: { roomId: string },
  ): Promise<void> {
    socket.to(`room:${data.roomId}`).emit("typing:stopped", {
      roomId: data.roomId,
      userId: socket.userId,
    });
  }

  private async handleAdminAssign(
    socket: AuthenticatedSocket,
    data: { roomId: string },
  ): Promise<void> {
    try {
      if (socket.userRole !== "ADMIN") {
        socket.emit("error", { message: "Unauthorized" });
        return;
      }

      const room = await prisma.chatRoom.update({
        where: { id: data.roomId },
        data: { adminId: socket.userId! },
      });

      this.io?.to(`room:${data.roomId}`).emit("admin:assigned", {
        roomId: data.roomId,
        adminId: socket.userId,
      });

      logger.info("WebSocket: Admin assigned to room", {
        type: "CHAT",
        event: "ADMIN_ASSIGNED",
        roomId: data.roomId,
        adminId: socket.userId,
      });
    } catch (error) {
      logger.error("WebSocket: Failed to assign admin", {
        error: (error as Error).message,
      });
    }
  }

  private async handleAdminList(socket: AuthenticatedSocket): Promise<void> {
    try {
      const rooms = await prisma.chatRoom.findMany({
        where: {
          status: "OPEN",
          isActive: true,
        },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { lastMessageAt: "desc" },
      });

      socket.emit("admin:rooms", rooms);
    } catch (error) {
      logger.error("WebSocket: Failed to get admin rooms", {
        error: (error as Error).message,
      });
    }
  }

  private async emitAdminList(): Promise<void> {
    const rooms = await prisma.chatRoom.findMany({
      where: {
        status: "OPEN",
        isActive: true,
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    this.adminSockets.forEach((adminSocketId) => {
      this.io?.to(adminSocketId).emit("admin:rooms", rooms);
    });
  }

  private async handleDisconnect(socket: AuthenticatedSocket): Promise<void> {
    logger.info("WebSocket: Client disconnected", {
      type: "WEBSOCKET",
      event: "DISCONNECT",
      socketId: socket.id,
      userId: socket.userId,
    });

    if (socket.userRole === "ADMIN") {
      this.adminSockets.delete(socket.id);
    } else if (socket.userId) {
      const userSocketSet = this.userSockets.get(socket.userId);
      if (userSocketSet) {
        userSocketSet.delete(socket.id);
        if (userSocketSet.size === 0) {
          this.userSockets.delete(socket.userId);
        }
      }
    }

    this.socketToRoom.delete(socket.id);
  }

  getIO(): Server | null {
    return this.io;
  }

  isAdminOnline(): boolean {
    return this.adminSockets.size > 0;
  }

  getOnlineAdmins(): number {
    return this.adminSockets.size;
  }
}

export const chatWebSocket = new ChatWebSocketManager();
