import { z } from "zod";

const url = (name) => z.url({ error: `${name} geçerli bir adres olmalıdır` });

const publicSchema = z.object({
  NEXT_PUBLIC_API_URL: url("NEXT_PUBLIC_API_URL"),
  NEXT_PUBLIC_SOCKET_URL: url("NEXT_PUBLIC_SOCKET_URL").optional(),
});

const serverSchema = z.object({
  API_INTERNAL_URL: url("API_INTERNAL_URL").optional(),
});

function parse(schema, values, scope) {
  const result = schema.safeParse(values);
  if (!result.success) {
    const details = result.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`);
    throw new Error(`Geçersiz ${scope} ortam değişkenleri:\n${details.join("\n")}`);
  }
  return result.data;
}

const publicValues = parse(
  publicSchema,
  {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || undefined,
  },
  "public",
);

export const clientEnv = {
  apiUrl: publicValues.NEXT_PUBLIC_API_URL.replace(/\/$/, ""),
  socketUrl: (publicValues.NEXT_PUBLIC_SOCKET_URL ?? publicValues.NEXT_PUBLIC_API_URL).replace(/\/$/, ""),
};

export function getServerEnv() {
  const values = parse(serverSchema, { API_INTERNAL_URL: process.env.API_INTERNAL_URL || undefined }, "sunucu");
  return { apiInternalUrl: (values.API_INTERNAL_URL ?? clientEnv.apiUrl).replace(/\/$/, "") };
}
