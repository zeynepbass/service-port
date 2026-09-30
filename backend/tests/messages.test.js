import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { Message } from "../models/index.js";
import { useTestDatabase } from "./helpers/db.js";
import { createUser } from "./helpers/factory.js";
import { collect, connectSocket, loginWithCookie, startServer, wait } from "./helpers/socketServer.js";

useTestDatabase();

let server;
const sockets = [];

beforeAll(async () => {
  server = await startServer();
});

afterEach(() => {
  sockets.splice(0).forEach((socket) => socket.close());
});

afterAll(async () => {
  await server.close();
});

async function participant() {
  const user = await createUser();
  const session = await loginWithCookie(server.app, user);
  return { user, ...session };
}

async function openConversation(from, to) {
  const response = await from.agent.post("/api/messages/conversations").send({ recipientId: to.user.id });
  expect(response.status).toBe(200);
  return response.body.data;
}

describe("socket kimlik doğrulama", () => {
  it("çerezsiz bağlantıyı reddeder", async () => {
    await expect(connectSocket(server.url)).rejects.toThrow("UNAUTHORIZED");
  });

  it("sahte token ile bağlantıyı reddeder", async () => {
    await expect(connectSocket(server.url, "access_token=sahte.token.degeri")).rejects.toThrow(
      "UNAUTHORIZED",
    );
  });
});

describe("mesaj gönderimi", () => {
  it("mesajı bir kez kaydeder ve yalnızca ilgili kullanıcılara iletir", async () => {
    const alice = await participant();
    const bob = await participant();
    const eve = await participant();

    const aliceSocket = await connectSocket(server.url, alice.cookie);
    const bobSocket = await connectSocket(server.url, bob.cookie);
    const eveSocket = await connectSocket(server.url, eve.cookie);
    sockets.push(aliceSocket, bobSocket, eveSocket);

    const aliceEvents = collect(aliceSocket, "message:new");
    const bobEvents = collect(bobSocket, "message:new");
    const eveEvents = collect(eveSocket, "message:new");

    const conversation = await openConversation(alice, bob);
    const sent = await alice.agent
      .post(`/api/messages/conversations/${conversation.id}/messages`)
      .send({ text: "Merhaba Bob", senderId: eve.user.id });
    expect(sent.status).toBe(400);

    const response = await alice.agent
      .post(`/api/messages/conversations/${conversation.id}/messages`)
      .send({ text: "Merhaba Bob" });
    expect(response.status).toBe(201);
    expect(response.body.data.senderId).toBe(alice.user.id);

    await wait(150);

    expect(await Message.countDocuments()).toBe(1);
    expect(bobEvents).toHaveLength(1);
    expect(bobEvents[0].message.text).toBe("Merhaba Bob");
    expect(bobEvents[0].conversation.unreadCount).toBe(1);
    expect(aliceEvents).toHaveLength(1);
    expect(aliceEvents[0].conversation.unreadCount).toBe(0);
    expect(eveEvents).toHaveLength(0);
  });

  it("socket üzerinden gelen mesaj olayı kayıt oluşturmaz", async () => {
    const alice = await participant();
    const bob = await participant();
    const aliceSocket = await connectSocket(server.url, alice.cookie);
    sockets.push(aliceSocket);
    const conversation = await openConversation(alice, bob);

    aliceSocket.emit("sendMessage", { conversationId: conversation.id, text: "socket" });
    await wait(100);

    expect(await Message.countDocuments()).toBe(0);
  });

  it("katılımcı olmayan kullanıcı konuşmayı okuyamaz ve yazamaz", async () => {
    const alice = await participant();
    const bob = await participant();
    const eve = await participant();
    const conversation = await openConversation(alice, bob);

    expect((await eve.agent.get(`/api/messages/conversations/${conversation.id}/messages`)).status).toBe(404);
    expect(
      (await eve.agent.post(`/api/messages/conversations/${conversation.id}/messages`).send({ text: "x" }))
        .status,
    ).toBe(404);
  });

  it("kendisiyle konuşma açılmasını engeller", async () => {
    const alice = await participant();
    const response = await alice.agent
      .post("/api/messages/conversations")
      .send({ recipientId: alice.user.id });
    expect(response.status).toBe(400);
  });
});

describe("konuşmalar", () => {
  it("okunmamış sayısını tutar ve okundu bilgisini karşı tarafa iletir", async () => {
    const alice = await participant();
    const bob = await participant();
    const aliceSocket = await connectSocket(server.url, alice.cookie);
    sockets.push(aliceSocket);
    const readEvents = collect(aliceSocket, "conversation:read");

    const conversation = await openConversation(alice, bob);
    for (const text of ["bir", "iki"]) {
      await alice.agent.post(`/api/messages/conversations/${conversation.id}/messages`).send({ text });
    }

    const bobList = await bob.agent.get("/api/messages/conversations");
    expect(bobList.body.data[0].unreadCount).toBe(2);
    expect(bobList.body.data[0].lastMessage.text).toBe("iki");

    await bob.agent.post(`/api/messages/conversations/${conversation.id}/read`);
    await wait(100);

    expect((await bob.agent.get("/api/messages/conversations")).body.data[0].unreadCount).toBe(0);
    expect(readEvents).toHaveLength(1);
    expect(readEvents[0].readerId).toBe(bob.user.id);
    expect(await Message.countDocuments({ readAt: null })).toBe(0);
  });

  it("mesajları cursor ile sayfalar", async () => {
    const alice = await participant();
    const bob = await participant();
    const conversation = await openConversation(alice, bob);
    for (const text of ["1", "2", "3"]) {
      await alice.agent.post(`/api/messages/conversations/${conversation.id}/messages`).send({ text });
    }

    const first = await bob.agent.get(`/api/messages/conversations/${conversation.id}/messages?limit=2`);
    expect(first.body.data.map((message) => message.text)).toEqual(["3", "2"]);
    const second = await bob.agent.get(
      `/api/messages/conversations/${conversation.id}/messages?limit=2&cursor=${first.body.meta.nextCursor}`,
    );
    expect(second.body.data.map((message) => message.text)).toEqual(["1"]);
  });

  it("silme yalnızca kullanıcının kendi görünümünü temizler", async () => {
    const alice = await participant();
    const bob = await participant();
    const conversation = await openConversation(alice, bob);
    await alice.agent
      .post(`/api/messages/conversations/${conversation.id}/messages`)
      .send({ text: "eski mesaj" });

    expect((await bob.agent.delete(`/api/messages/conversations/${conversation.id}`)).status).toBe(204);

    expect((await bob.agent.get("/api/messages/conversations")).body.data).toHaveLength(0);
    expect((await alice.agent.get("/api/messages/conversations")).body.data).toHaveLength(1);
    expect(
      (await alice.agent.get(`/api/messages/conversations/${conversation.id}/messages`)).body.data,
    ).toHaveLength(1);

    await alice.agent
      .post(`/api/messages/conversations/${conversation.id}/messages`)
      .send({ text: "yeni mesaj" });

    const bobMessages = await bob.agent.get(`/api/messages/conversations/${conversation.id}/messages`);
    expect(bobMessages.body.data.map((message) => message.text)).toEqual(["yeni mesaj"]);
    expect((await bob.agent.get("/api/messages/conversations")).body.data).toHaveLength(1);
  });
});
