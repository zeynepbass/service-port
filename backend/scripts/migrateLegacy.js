import mongoose from "mongoose";
import {
  Category,
  Conversation,
  Message,
  Review,
  ServiceRequest,
  ServiceTemplate,
  User,
  buildParticipantKey,
} from "../models/index.js";
import { recalculateRating } from "../services/review.service.js";
import { toSlug } from "../utils/slug.js";
import { isDirectRun, runScript } from "./runScript.js";

const STATUS_MAP = { aktif: "active", pasif: "passive", iptal: "cancelled" };
const LEGACY_MESSAGES = "legacy_messages";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value?.toString());
const toObjectId = (value) => new mongoose.Types.ObjectId(value.toString());

function parseLegacyLocation(value) {
  const match = typeof value === "string" && value.match(/Lat:\s*(-?[0-9.]+),\s*Lng:\s*(-?[0-9.]+)/);
  if (!match) return undefined;
  return { type: "Point", coordinates: [Number(match[2]), Number(match[1])] };
}

async function collectionExists(db, name) {
  return (await db.listCollections({ name }).toArray()).length > 0;
}

async function migrateUsers(db, report) {
  const seenEmails = new Set();
  for await (const legacy of db.collection("kullanicis").find()) {
    const email = legacy.email?.trim().toLowerCase();
    if (!email || !legacy.parola) {
      report.skippedUsers.push({ id: legacy._id.toString(), reason: "e-posta veya parola yok" });
      continue;
    }
    if (seenEmails.has(email)) {
      report.skippedUsers.push({ id: legacy._id.toString(), reason: "tekrarlanan e-posta" });
      continue;
    }
    seenEmails.add(email);

    await User.collection.updateOne(
      { _id: legacy._id },
      {
        $set: {
          firstName: legacy.ad?.trim() || "-",
          lastName: legacy.soyad?.trim() || "-",
          email,
          passwordHash: legacy.parola,
          phone: legacy.telefon || null,
          avatar: legacy.resim || null,
          isActive: !(legacy.hesap === false || legacy.hesap === "false"),
        },
        $setOnInsert: { role: "user", ratingAverage: 0, ratingCount: 0, createdAt: legacy._id.getTimestamp(), updatedAt: new Date() },
      },
      { upsert: true },
    );
    report.users += 1;

    if (Number(legacy.rating) > 0) {
      await Review.collection.updateOne(
        { target: legacy._id, legacy: true },
        {
          $set: {
            author: null,
            request: null,
            rating: Math.min(5, Math.max(1, Math.round(Number(legacy.rating)))),
            comment: legacy.comment || null,
            legacy: true,
            createdAt: legacy._id.getTimestamp(),
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );
      await recalculateRating(legacy._id);
      report.legacyReviews += 1;
    }
  }
}

async function migrateCategories(db, report) {
  const usedSlugs = new Set();
  for await (const legacy of db.collection("kategoris").find()) {
    let slug = toSlug(legacy.isim);
    for (let suffix = 2; usedSlugs.has(slug); suffix += 1) slug = `${toSlug(legacy.isim)}-${suffix}`;
    usedSlugs.add(slug);

    await Category.collection.updateOne(
      { _id: legacy._id },
      {
        $set: {
          name: legacy.isim,
          slug,
          description: legacy.aciklama || null,
          image: legacy.resim || null,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: legacy._id.getTimestamp() },
      },
      { upsert: true },
    );
    report.categories += 1;
  }
}

async function migrateTemplates(db, report) {
  const latestByCategory = new Map();
  for await (const legacy of db.collection("tadilats").find().sort({ _id: 1 })) {
    if (legacy.kategori) latestByCategory.set(legacy.kategori.toString(), legacy);
  }

  for (const [categoryId, legacy] of latestByCategory) {
    const steps = (legacy.adimlar ?? [])
      .filter((step) => step.baslik && step.secenekler?.length)
      .map((step) => ({ question: step.baslik, options: step.secenekler }));
    if (steps.length === 0) continue;

    await ServiceTemplate.collection.updateOne(
      { category: toObjectId(categoryId) },
      { $set: { steps, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
    report.templates += 1;
  }
}

async function resolveCategoryId(legacy) {
  if (isObjectId(legacy.primaryKey) && (await Category.exists({ _id: legacy.primaryKey }))) {
    return toObjectId(legacy.primaryKey);
  }
  const byName = await Category.findOne({ slug: toSlug(legacy.anaBaslik ?? "") }).select("_id");
  return byName?._id ?? null;
}

async function migrateRequests(db, report) {
  for await (const legacy of db.collection("aktifs").find()) {
    const ownerExists = isObjectId(legacy.kullaniciId) && (await User.exists({ _id: legacy.kullaniciId }));
    const categoryId = await resolveCategoryId(legacy);
    const answers = (legacy.veriler ?? [])
      .filter((answer) => answer.kategoriIsim && answer.secilen)
      .map((answer) => ({ question: answer.kategoriIsim, options: answer.secenekler ?? [], selected: answer.secilen }));

    if (!ownerExists || !categoryId || answers.length === 0) {
      report.skippedRequests.push({ id: legacy._id.toString(), reason: "sahip, kategori veya cevap bulunamadı" });
      continue;
    }

    const location = parseLegacyLocation(legacy.konum);
    await ServiceRequest.collection.updateOne(
      { _id: legacy._id },
      {
        $set: {
          owner: toObjectId(legacy.kullaniciId),
          category: categoryId,
          title: legacy.anaBaslik,
          answers,
          status: STATUS_MAP[legacy.durum] ?? "active",
          phone: legacy.telefonNo || null,
          ...(location && { location }),
          startsAt: legacy.baslangicTarihi ?? legacy._id.getTimestamp(),
          endsAt: legacy.bitisTarihi ?? null,
          cancelledAt: legacy.durum === "iptal" ? new Date() : null,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: legacy._id.getTimestamp() },
      },
      { upsert: true },
    );
    report.requests += 1;
  }
}

async function moveLegacyMessages(db) {
  if (!(await collectionExists(db, "messages"))) return false;
  const legacySample = await db.collection("messages").findOne({ gonderenId: { $exists: true } });
  if (!legacySample) return collectionExists(db, LEGACY_MESSAGES);
  if (await collectionExists(db, LEGACY_MESSAGES)) {
    throw new Error(`${LEGACY_MESSAGES} koleksiyonu zaten var; messages koleksiyonu karışık veri içeriyor`);
  }
  await db.collection("messages").rename(LEGACY_MESSAGES);
  return true;
}

async function migrateMessages(db, report) {
  if (!(await moveLegacyMessages(db))) return;

  for await (const legacy of db.collection(LEGACY_MESSAGES).find().sort({ time: 1, _id: 1 })) {
    const sender = legacy.gonderenId;
    const recipient = legacy.aliciId;
    if (!sender || !recipient || sender.toString() === recipient.toString()) continue;

    const participantKey = buildParticipantKey(sender, recipient);
    const createdAt = legacy.time ?? legacy._id.getTimestamp();
    const conversation = await Conversation.findOneAndUpdate(
      { participantKey },
      {
        $setOnInsert: {
          participants: [sender, recipient],
          participantKey,
          states: [{ user: sender }, { user: recipient }],
        },
      },
      { upsert: true, new: true },
    );

    const inserted = await Message.collection.updateOne(
      { _id: legacy._id },
      {
        $setOnInsert: {
          conversation: conversation._id,
          sender,
          recipient,
          text: legacy.text,
          readAt: createdAt,
          createdAt,
          updatedAt: createdAt,
        },
      },
      { upsert: true },
    );

    if (inserted.upsertedCount > 0) {
      await Conversation.updateOne(
        { _id: conversation._id },
        { $set: { lastMessage: { text: legacy.text, sender, createdAt } } },
      );
      report.messages += 1;
    }
  }
}

export async function migrateLegacy(db = mongoose.connection.db) {
  const report = {
    users: 0,
    legacyReviews: 0,
    categories: 0,
    templates: 0,
    requests: 0,
    messages: 0,
    skippedUsers: [],
    skippedRequests: [],
  };

  await Promise.all([User, Category, ServiceTemplate, ServiceRequest, Conversation, Message, Review].map((model) => model.init()));

  await migrateUsers(db, report);
  await migrateCategories(db, report);
  await migrateTemplates(db, report);
  await migrateRequests(db, report);
  await migrateMessages(db, report);

  return report;
}

if (isDirectRun(import.meta.url)) {
  runScript("Legacy migration", () => migrateLegacy());
}
