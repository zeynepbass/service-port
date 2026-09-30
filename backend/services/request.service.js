import { Category, Conversation, ServiceRequest, ServiceTemplate } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { cursorFilter, paginate } from "../utils/pagination.js";
import { effectiveStatus } from "../utils/serializers.js";
import { getCategoryByKey } from "./category.service.js";

const EARTH_RADIUS_KM = 6378.1;

const TRANSITIONS = {
  active: ["passive", "cancelled"],
  passive: ["active", "cancelled"],
  cancelled: [],
};

const OWNER_FIELDS = "firstName lastName avatar ratingAverage ratingCount email";

export function canTransition(from, to) {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

function toPoint(location) {
  if (!location) return undefined;
  return { type: "Point", coordinates: [location.lng, location.lat] };
}

function statusFilter(status, now = new Date()) {
  if (status === "active") {
    return { status: "active", $or: [{ endsAt: null }, { endsAt: { $gte: now } }] };
  }
  if (status === "passive") {
    return { $or: [{ status: "passive" }, { status: "active", endsAt: { $lt: now } }] };
  }
  if (status === "cancelled") {
    return { status: "cancelled" };
  }
  return {};
}

function buildAnswers(template, answers) {
  if (answers.length !== template.steps.length) {
    throw AppError.badRequest("Tüm soruları cevaplamalısınız", { code: "INCOMPLETE_ANSWERS" });
  }

  return template.steps.map((step, index) => {
    const answer = answers[index];
    if (answer.question !== step.question || !step.options.includes(answer.selected)) {
      throw AppError.badRequest("Cevaplar talep şablonuyla eşleşmiyor", { code: "INVALID_ANSWER" });
    }
    return { question: step.question, options: [...step.options], selected: answer.selected };
  });
}

export async function createRequest(ownerId, { categoryId, answers, phone, location, endsAt }) {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw AppError.notFound("Kategori bulunamadı");
  }

  const template = await ServiceTemplate.findOne({ category: category._id });
  if (!template) {
    throw AppError.notFound("Bu kategori için talep şablonu bulunamadı");
  }

  const request = await ServiceRequest.create({
    owner: ownerId,
    category: category._id,
    title: category.name,
    answers: buildAnswers(template, answers),
    phone: phone ?? null,
    location: toPoint(location),
    endsAt: endsAt ?? null,
  });

  return request.populate([
    { path: "category", select: "name slug" },
    { path: "owner", select: OWNER_FIELDS },
  ]);
}

export async function listRequests(viewer, query) {
  const filter = { ...cursorFilter(query.cursor, query.sort === "oldest" ? "asc" : "desc") };
  const and = [];

  if (query.scope === "mine") filter.owner = viewer.id;
  if (query.scope === "others") filter.owner = { $ne: viewer.id };

  if (query.category) {
    const category = await getCategoryByKey(query.category);
    filter.category = category._id;
  }

  if (query.status) and.push(statusFilter(query.status));

  if (query.lat !== undefined && query.lng !== undefined) {
    filter.location = {
      $geoWithin: { $centerSphere: [[query.lng, query.lat], query.radiusKm / EARTH_RADIUS_KM] },
    };
  }

  if (and.length > 0) filter.$and = and;

  const documents = await ServiceRequest.find(filter)
    .sort({ _id: query.sort === "oldest" ? 1 : -1 })
    .limit(query.limit + 1)
    .populate("category", "name slug")
    .populate("owner", OWNER_FIELDS);

  return paginate(documents, query.limit);
}

async function findRequestOrFail(id) {
  const request = await ServiceRequest.findById(id)
    .populate("category", "name slug")
    .populate("owner", OWNER_FIELDS);
  if (!request) {
    throw AppError.notFound("Talep bulunamadı");
  }
  return request;
}

function isOwnerOrAdmin(viewer, request) {
  return viewer.role === "admin" || request.owner?._id?.toString() === viewer.id;
}

async function assertCanManage(viewer, id) {
  const request = await findRequestOrFail(id);
  if (!isOwnerOrAdmin(viewer, request)) {
    throw AppError.forbidden("Bu talep üzerinde işlem yapma yetkiniz yok");
  }
  return request;
}

export async function canSeeContact(viewer, request) {
  if (isOwnerOrAdmin(viewer, request)) return true;
  if (!request.owner?._id) return false;
  const conversation = await Conversation.exists({
    participants: { $all: [viewer.id, request.owner._id] },
    lastMessage: { $ne: null },
  });
  return Boolean(conversation);
}

export async function getRequest(viewer, id) {
  const request = await findRequestOrFail(id);
  return { request, includeContact: await canSeeContact(viewer, request) };
}

export async function updateRequest(viewer, id, changes) {
  const request = await assertCanManage(viewer, id);

  if (request.status === "cancelled") {
    throw AppError.unprocessable("İptal edilen talep güncellenemez", { code: "REQUEST_CANCELLED" });
  }

  if ("phone" in changes) request.phone = changes.phone;
  if ("location" in changes) request.location = toPoint(changes.location);
  if ("endsAt" in changes) request.endsAt = changes.endsAt;

  await request.save();
  return request;
}

export async function changeStatus(viewer, id, nextStatus) {
  const request = await assertCanManage(viewer, id);
  const current = effectiveStatus(request);

  if (!canTransition(current, nextStatus)) {
    throw AppError.unprocessable(`Talep "${current}" durumundan "${nextStatus}" durumuna geçemez`, {
      code: "INVALID_TRANSITION",
    });
  }

  if (nextStatus === "active" && request.endsAt && request.endsAt < new Date()) {
    throw AppError.unprocessable("Süresi dolan talebi aktifleştirmek için yeni bir bitiş tarihi belirleyin", {
      code: "REQUEST_EXPIRED",
    });
  }

  request.status = nextStatus;
  request.cancelledAt = nextStatus === "cancelled" ? new Date() : null;
  await request.save();
  return request;
}
