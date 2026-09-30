import request from "supertest";
import { Category, ServiceTemplate, User } from "../../models/index.js";
import { hashPassword } from "../../services/auth.service.js";

export const DEFAULT_PASSWORD = "Parola123";

let counter = 0;

export async function createUser(overrides = {}) {
  counter += 1;
  return User.create({
    firstName: "Ayşe",
    lastName: `Yılmaz${counter}`,
    email: `user${counter}@example.com`,
    passwordHash: await hashPassword(overrides.password ?? DEFAULT_PASSWORD),
    ...overrides,
  });
}

export async function loginAgent(app, user, password = DEFAULT_PASSWORD) {
  const agent = request.agent(app);
  const response = await agent.post("/api/auth/login").send({ email: user.email, password });
  if (response.status !== 200) {
    throw new Error(`Giriş başarısız: ${response.status} ${JSON.stringify(response.body)}`);
  }
  return agent;
}

export async function createCategoryWithTemplate(overrides = {}) {
  counter += 1;
  const category = await Category.create({
    name: `Boya Badana ${counter}`,
    slug: `boya-badana-${counter}`,
    image: "/images-slider/slide1.jpg",
    ...overrides,
  });
  const template = await ServiceTemplate.create({
    category: category._id,
    steps: [
      { question: "Kaç oda boyanacak?", options: ["1", "2", "3+"] },
      { question: "Tavan da boyanacak mı?", options: ["Evet", "Hayır"] },
    ],
  });
  return { category, template };
}

export function validAnswers() {
  return [
    { question: "Kaç oda boyanacak?", selected: "2" },
    { question: "Tavan da boyanacak mı?", selected: "Evet" },
  ];
}

export function cookieNames(response) {
  return (response.headers["set-cookie"] ?? []).map((cookie) => cookie.split("=")[0]);
}

export function findCookie(response, name) {
  return (response.headers["set-cookie"] ?? []).find((cookie) => cookie.startsWith(`${name}=`));
}
