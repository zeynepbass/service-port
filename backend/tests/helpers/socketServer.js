import http from "node:http";
import { io as connect } from "socket.io-client";
import request from "supertest";
import { createApp } from "../../app.js";
import { setSocketServer } from "../../sockets/emitter.js";
import { createSocketServer } from "../../sockets/index.js";
import { DEFAULT_PASSWORD } from "./factory.js";

export async function startServer() {
  const app = createApp();
  const server = http.createServer(app);
  const io = createSocketServer(server);
  await new Promise((resolve) => server.listen(0, resolve));
  const url = `http://127.0.0.1:${server.address().port}`;

  return {
    app,
    url,
    async close() {
      setSocketServer(null);
      await new Promise((resolve) => io.close(resolve));
    },
  };
}

export async function loginWithCookie(app, user) {
  const agent = request.agent(app);
  const response = await agent
    .post("/api/auth/login")
    .send({ email: user.email, password: DEFAULT_PASSWORD });
  const cookie = response.headers["set-cookie"]
    .find((entry) => entry.startsWith("access_token="))
    .split(";")[0];
  return { agent, cookie };
}

export function connectSocket(url, cookie) {
  return new Promise((resolve, reject) => {
    const socket = connect(url, {
      transports: ["websocket"],
      extraHeaders: cookie ? { Cookie: cookie } : {},
      reconnection: false,
      forceNew: true,
    });
    socket.on("connect", () => resolve(socket));
    socket.on("connect_error", (error) => {
      socket.close();
      reject(error);
    });
  });
}

export function collect(socket, event) {
  const received = [];
  socket.on(event, (payload) => received.push(payload));
  return received;
}

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
