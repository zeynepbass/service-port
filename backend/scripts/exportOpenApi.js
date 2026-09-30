import fs from "node:fs/promises";
import { buildOpenApiDocument } from "../docs/openapi.js";

const target = new URL("../docs/openapi.json", import.meta.url);
await fs.writeFile(target, `${JSON.stringify(buildOpenApiDocument(), null, 2)}\n`);
process.stdout.write(`OpenAPI dokümanı yazıldı: ${target.pathname}\n`);
