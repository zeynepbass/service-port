import { parse } from "cookie";
import { Server } from "socket.io";
import { logger } from "../config/logger.js";
import { corsOptions } from "../config/cors.js";
import { ACCESS_COOKIE, verifyAccessToken } from "../utils/tokens.js";
import { setSocketServer, userRoom } from "./emitter.js";

export function authenticateSocket(socket, next) {
  const cookies = parse(socket.handshake.headers.cookie ?? "");
  const token = cookies[ACCESS_COOKIE];

  if (!token) {
    return next(new Error("UNAUTHORIZED"));
  }

  try {
    socket.data.user = verifyAccessToken(token);
    return next();
  } catch {
    return next(new Error("UNAUTHORIZED"));
  }
}

export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: corsOptions,
    serveClient: false,
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const { id: userId } = socket.data.user;
    socket.join(userRoom(userId));
    logger.debug({ userId, socketId: socket.id }, "Socket bağlandı");

    socket.on("disconnect", (reason) => {
      logger.debug({ userId, socketId: socket.id, reason }, "Socket ayrıldı");
    });
  });

  setSocketServer(io);
  return io;
}
