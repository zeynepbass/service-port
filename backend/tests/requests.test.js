import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { Conversation, ServiceRequest } from "../models/index.js";
import { useTestDatabase } from "./helpers/db.js";
import { createCategoryWithTemplate, createUser, loginAgent, validAnswers } from "./helpers/factory.js";

useTestDatabase();
const app = createApp();

async function setup() {
  const { category } = await createCategoryWithTemplate();
  const owner = await createUser({ email: `owner${Date.now()}@example.com` });
  const other = await createUser();
  const ownerAgent = await loginAgent(app, owner);
  const otherAgent = await loginAgent(app, other);
  return { category, owner, other, ownerAgent, otherAgent };
}

async function createRequest(agent, category, extra = {}) {
  const response = await agent
    .post("/api/requests")
    .send({ categoryId: category.id, answers: validAnswers(), ...extra });
  expect(response.status).toBe(201);
  return response.body.data;
}

describe("talep oluşturma", () => {
  it("sahibi token'dan alır, gövdeden gelen sahip bilgisini kabul etmez", async () => {
    const { category, other, ownerAgent, owner } = await setup();

    const spoofed = await ownerAgent
      .post("/api/requests")
      .send({ categoryId: category.id, answers: validAnswers(), ownerId: other.id });
    expect(spoofed.status).toBe(400);

    const created = await createRequest(ownerAgent, category, {
      phone: "+905551112233",
      location: { lat: 41.01, lng: 28.97 },
    });
    expect(created.owner.id).toBe(owner.id);
    expect(created.status).toBe("active");
    expect(created.location).toEqual({ lat: 41.01, lng: 28.97 });
  });

  it("şablonla eşleşmeyen cevapları reddeder", async () => {
    const { category, ownerAgent } = await setup();
    const response = await ownerAgent.post("/api/requests").send({
      categoryId: category.id,
      answers: [
        { question: "Kaç oda boyanacak?", selected: "100" },
        { question: "Tavan da boyanacak mı?", selected: "Evet" },
      ],
    });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_ANSWER");
  });

  it("geçmiş bitiş tarihini reddeder", async () => {
    const { category, ownerAgent } = await setup();
    const response = await ownerAgent
      .post("/api/requests")
      .send({ categoryId: category.id, answers: validAnswers(), endsAt: "2000-01-01" });
    expect(response.status).toBe(400);
  });
});

describe("kişisel verilerin korunması", () => {
  it("listede başkalarının e-posta ve telefonunu döndürmez", async () => {
    const { category, owner, ownerAgent, otherAgent } = await setup();
    await createRequest(ownerAgent, category, { phone: "+905551112233" });

    const response = await otherAgent.get(
      `/api/requests?scope=others&category=${category.slug}&status=active`,
    );

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].contact).toBeNull();
    const body = JSON.stringify(response.body);
    expect(body).not.toContain(owner.email);
    expect(body).not.toContain("5551112233");
  });

  it("detayda iletişim bilgisini yalnızca sahibi veya mesajlaşmış kullanıcı görür", async () => {
    const { category, owner, other, ownerAgent, otherAgent } = await setup();
    const created = await createRequest(ownerAgent, category, { phone: "+905551112233" });

    const before = await otherAgent.get(`/api/requests/${created.id}`);
    expect(before.body.data.contact).toBeNull();

    const conversation = await otherAgent
      .post("/api/messages/conversations")
      .send({ recipientId: owner.id, requestId: created.id });
    await otherAgent
      .post(`/api/messages/conversations/${conversation.body.data.id}/messages`)
      .send({ text: "Merhaba" });

    const after = await otherAgent.get(`/api/requests/${created.id}`);
    expect(after.body.data.contact).toEqual({ phone: "+905551112233", email: owner.email });

    const mine = await ownerAgent.get(`/api/requests/${created.id}`);
    expect(mine.body.data.contact.phone).toBe("+905551112233");
    expect(await Conversation.countDocuments({ participants: other._id })).toBe(1);
  });
});

describe("sahiplik", () => {
  it("başkasının talebini güncelleyemez veya durumunu değiştiremez", async () => {
    const { category, ownerAgent, otherAgent } = await setup();
    const created = await createRequest(ownerAgent, category);

    expect(
      (await otherAgent.patch(`/api/requests/${created.id}`).send({ phone: "+905550000000" })).status,
    ).toBe(403);
    expect(
      (await otherAgent.patch(`/api/requests/${created.id}/status`).send({ status: "cancelled" })).status,
    ).toBe(403);
  });

  it("admin başkasının talebini yönetebilir", async () => {
    const { category, ownerAgent } = await setup();
    const created = await createRequest(ownerAgent, category);
    const adminAgent = await loginAgent(app, await createUser({ role: "admin" }));

    const response = await adminAgent.patch(`/api/requests/${created.id}/status`).send({ status: "passive" });
    expect(response.status).toBe(200);
  });
});

describe("durum geçişleri", () => {
  it("aktif → pasif → aktif → iptal geçişlerine izin verir", async () => {
    const { category, ownerAgent } = await setup();
    const created = await createRequest(ownerAgent, category);
    const url = `/api/requests/${created.id}/status`;

    expect((await ownerAgent.patch(url).send({ status: "passive" })).body.data.status).toBe("passive");
    expect((await ownerAgent.patch(url).send({ status: "active" })).body.data.status).toBe("active");
    expect((await ownerAgent.patch(url).send({ status: "cancelled" })).body.data.status).toBe("cancelled");
  });

  it("iptal edilen talep yeniden açılamaz ve güncellenemez", async () => {
    const { category, ownerAgent } = await setup();
    const created = await createRequest(ownerAgent, category);
    await ownerAgent.patch(`/api/requests/${created.id}/status`).send({ status: "cancelled" });

    const reopen = await ownerAgent.patch(`/api/requests/${created.id}/status`).send({ status: "active" });
    expect(reopen.status).toBe(422);
    expect(reopen.body.error.code).toBe("INVALID_TRANSITION");

    const update = await ownerAgent.patch(`/api/requests/${created.id}`).send({ phone: "+905550000000" });
    expect(update.status).toBe(422);
  });

  it("süresi dolan talep sorgu anında pasif sayılır", async () => {
    const { category, ownerAgent } = await setup();
    const created = await createRequest(ownerAgent, category);
    await ServiceRequest.updateOne({ _id: created.id }, { $set: { endsAt: new Date(Date.now() - 60000) } });

    const active = await ownerAgent.get("/api/requests?scope=mine&status=active");
    const passive = await ownerAgent.get("/api/requests?scope=mine&status=passive");
    expect(active.body.data).toHaveLength(0);
    expect(passive.body.data).toHaveLength(1);
    expect(passive.body.data[0]).toMatchObject({ status: "passive", isExpired: true });

    const reactivate = await ownerAgent
      .patch(`/api/requests/${created.id}/status`)
      .send({ status: "active" });
    expect(reactivate.status).toBe(422);
    expect(reactivate.body.error.code).toBe("REQUEST_EXPIRED");

    const extended = await ownerAgent
      .patch(`/api/requests/${created.id}`)
      .send({ endsAt: new Date(Date.now() + 86400000).toISOString() });
    expect(extended.body.data.status).toBe("active");
  });
});

describe("listeleme", () => {
  it("cursor ile sayfalar ve sıralar", async () => {
    const { category, ownerAgent } = await setup();
    const ids = [];
    for (let i = 0; i < 3; i += 1) {
      ids.push((await createRequest(ownerAgent, category)).id);
    }

    const first = await ownerAgent.get("/api/requests?scope=mine&limit=2");
    expect(first.body.data.map((item) => item.id)).toEqual([ids[2], ids[1]]);

    const second = await ownerAgent.get(
      `/api/requests?scope=mine&limit=2&cursor=${first.body.meta.nextCursor}`,
    );
    expect(second.body.data.map((item) => item.id)).toEqual([ids[0]]);

    const oldest = await ownerAgent.get("/api/requests?scope=mine&sort=oldest&limit=1");
    expect(oldest.body.data[0].id).toBe(ids[0]);
  });

  it("konuma göre filtreler", async () => {
    const { category, ownerAgent } = await setup();
    await createRequest(ownerAgent, category, { location: { lat: 41.0082, lng: 28.9784 } });
    await createRequest(ownerAgent, category, { location: { lat: 39.9334, lng: 32.8597 } });

    const nearIstanbul = await ownerAgent.get("/api/requests?scope=mine&lat=41.0&lng=29.0&radiusKm=30");
    expect(nearIstanbul.body.data).toHaveLength(1);
  });

  it("geçersiz cursor için 400 döner", async () => {
    const { ownerAgent } = await setup();
    expect((await ownerAgent.get("/api/requests?cursor=bozuk")).status).toBe(400);
  });
});
