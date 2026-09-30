import mongoose from "mongoose";
import { describe, expect, it } from "vitest";
import { Category, Conversation, Message, Review, ServiceRequest, ServiceTemplate, User } from "../models/index.js";
import { migrateLegacy } from "../scripts/migrateLegacy.js";
import { seed } from "../scripts/seed.js";
import { useTestDatabase } from "./helpers/db.js";

useTestDatabase();

async function insertLegacyData() {
  const db = mongoose.connection.db;
  const userA = new mongoose.Types.ObjectId();
  const userB = new mongoose.Types.ObjectId();
  const categoryId = new mongoose.Types.ObjectId();

  await Message.collection.drop().catch(() => {});

  await db.collection("kullanicis").insertMany([
    { _id: userA, ad: "Ali", soyad: "Veli", email: "Ali@Example.com", parola: "$2b$10$hash", hesap: "true", rating: 4, comment: "iyi" },
    { _id: userB, ad: "Ayşe", soyad: "Kaya", email: "ayse@example.com", parola: "$2b$10$hash", hesap: false },
    { _id: new mongoose.Types.ObjectId(), kullaniciAdi: "misafir", parola: "$2b$10$hash" },
  ]);
  await db.collection("kategoris").insertOne({ _id: categoryId, isim: "Boya Badana", resim: "https://x/y.jpg" });
  await db.collection("tadilats").insertOne({
    kategori: categoryId,
    adimlar: [{ baslik: "Kaç oda?", secenekler: ["1", "2"], secilen: null }],
  });
  await db.collection("aktifs").insertMany([
    {
      primaryKey: categoryId.toString(),
      anaBaslik: "Boya Badana",
      durum: "pasif",
      veriler: [{ kategoriIsim: "Kaç oda?", secenekler: ["1", "2"], secilen: "2" }],
      konum: "Lat: 41.01, Lng: 28.97",
      telefonNo: "+905551112233",
      ad: "Ali",
      email: "ali@example.com",
      kullaniciId: userA.toString(),
    },
    { primaryKey: "x", anaBaslik: "Yok", veriler: [], kullaniciId: "gecersiz" },
  ]);
  await db.collection("messages").insertMany([
    { gonderenId: userA, aliciId: userB, text: "Merhaba", time: new Date("2025-01-01") },
    { gonderenId: userB, aliciId: userA, text: "Selam", time: new Date("2025-01-02") },
  ]);
  return { userA, userB, categoryId };
}

describe("legacy migration", () => {
  it("eski koleksiyonları yeni modele taşır", async () => {
    const { userA, userB, categoryId } = await insertLegacyData();

    const report = await migrateLegacy();

    expect(report).toMatchObject({ users: 2, categories: 1, templates: 1, requests: 1, messages: 2, legacyReviews: 1 });
    expect(report.skippedUsers).toHaveLength(1);
    expect(report.skippedRequests).toHaveLength(1);

    const ali = await User.findById(userA);
    expect(ali).toMatchObject({ email: "ali@example.com", isActive: true, ratingAverage: 4, ratingCount: 1 });
    expect((await User.findById(userB)).isActive).toBe(false);
    expect(await Review.countDocuments({ legacy: true })).toBe(1);

    expect((await Category.findById(categoryId)).slug).toBe("boya-badana");
    expect((await ServiceTemplate.findOne({ category: categoryId })).steps[0].question).toBe("Kaç oda?");

    const request = await ServiceRequest.findOne();
    expect(request.owner.toString()).toBe(userA.toString());
    expect(request.status).toBe("passive");
    expect(request.location.coordinates).toEqual([28.97, 41.01]);

    const conversation = await Conversation.findOne();
    expect(conversation.lastMessage.text).toBe("Selam");
    expect(await Message.countDocuments({ conversation: conversation._id })).toBe(2);
  });

  it("tekrar çalıştırıldığında kayıtları çoğaltmaz", async () => {
    await insertLegacyData();
    await migrateLegacy();
    const second = await migrateLegacy();

    expect(second.messages).toBe(0);
    expect(await Message.countDocuments()).toBe(2);
    expect(await User.countDocuments()).toBe(2);
  });
});

describe("seed", () => {
  it("kategorileri, şablonları ve kullanıcıları idempotent oluşturur", async () => {
    await seed({ password: "Demo12345" });
    await seed({ password: "Demo12345" });

    expect(await Category.countDocuments()).toBe(6);
    expect(await ServiceTemplate.countDocuments()).toBe(6);
    expect(await User.countDocuments({ role: "admin" })).toBe(1);
    expect((await seed({ onlyIfEmpty: true })).skipped).toBe(true);
  });
});
