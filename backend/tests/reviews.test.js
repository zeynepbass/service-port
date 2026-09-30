import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { useTestDatabase } from "./helpers/db.js";
import { createCategoryWithTemplate, createUser, loginAgent, validAnswers } from "./helpers/factory.js";

useTestDatabase();
const app = createApp();

async function chattingPair() {
  const author = await createUser();
  const target = await createUser();
  const authorAgent = await loginAgent(app, author);
  const targetAgent = await loginAgent(app, target);
  const { category } = await createCategoryWithTemplate();
  const requestResponse = await targetAgent
    .post("/api/requests")
    .send({ categoryId: category.id, answers: validAnswers() });
  const conversation = await authorAgent
    .post("/api/messages/conversations")
    .send({ recipientId: target.id, requestId: requestResponse.body.data.id });
  await authorAgent
    .post(`/api/messages/conversations/${conversation.body.data.id}/messages`)
    .send({ text: "Merhaba" });
  return { author, target, authorAgent, targetAgent, requestId: requestResponse.body.data.id };
}

describe("değerlendirmeler", () => {
  it("kendini değerlendirmeyi engeller", async () => {
    const user = await createUser();
    const agent = await loginAgent(app, user);
    const response = await agent.post("/api/reviews").send({ targetId: user.id, rating: 5 });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("SELF_REVIEW");
  });

  it("mesajlaşmadığı kullanıcıyı değerlendirmeyi engeller", async () => {
    const agent = await loginAgent(app, await createUser());
    const stranger = await createUser();
    const response = await agent.post("/api/reviews").send({ targetId: stranger.id, rating: 5 });
    expect(response.status).toBe(403);
  });

  it("aynı talep için tek değerlendirmeye izin verir", async () => {
    const { target, authorAgent, requestId } = await chattingPair();
    const payload = { targetId: target.id, requestId, rating: 4, comment: "İyi iş" };

    expect((await authorAgent.post("/api/reviews").send(payload)).status).toBe(201);
    const duplicate = await authorAgent.post("/api/reviews").send({ ...payload, rating: 1 });
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.code).toBe("REVIEW_EXISTS");
  });

  it("ortalama puanı ve sayıyı profilde günceller", async () => {
    const { target, authorAgent, requestId } = await chattingPair();
    const second = await createUser();
    const secondAgent = await loginAgent(app, second);
    const conversation = await secondAgent.post("/api/messages/conversations").send({ recipientId: target.id });
    await secondAgent.post(`/api/messages/conversations/${conversation.body.data.id}/messages`).send({ text: "Selam" });

    await authorAgent.post("/api/reviews").send({ targetId: target.id, requestId, rating: 5 });
    await secondAgent.post("/api/reviews").send({ targetId: target.id, rating: 2 });

    const profile = await authorAgent.get(`/api/users/${target.id}`);
    expect(profile.body.data).toMatchObject({ ratingAverage: 3.5, ratingCount: 2 });

    const list = await authorAgent.get(`/api/reviews?user=${target.id}`);
    expect(list.body.data).toHaveLength(2);
    expect(JSON.stringify(list.body)).not.toContain("email");
  });

  it("ilgisiz talep ile değerlendirmeyi reddeder", async () => {
    const { target, authorAgent } = await chattingPair();
    const outsider = await createUser();
    const outsiderAgent = await loginAgent(app, outsider);
    const { category } = await createCategoryWithTemplate();
    const unrelated = await outsiderAgent.post("/api/requests").send({ categoryId: category.id, answers: validAnswers() });

    const response = await authorAgent
      .post("/api/reviews")
      .send({ targetId: target.id, requestId: unrelated.body.data.id, rating: 3 });
    expect(response.status).toBe(400);
  });

  it("puanı 1-5 aralığında doğrular", async () => {
    const { target, authorAgent } = await chattingPair();
    expect((await authorAgent.post("/api/reviews").send({ targetId: target.id, rating: 6 })).status).toBe(400);
  });
});
