FROM node:26-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS runtime
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p uploads && chown -R node:node uploads
USER node
EXPOSE 6398
HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||6398)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["sh", "-c", "node scripts/seed.js --if-empty && node index.js"]
