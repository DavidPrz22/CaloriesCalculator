FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
RUN pnpm install --frozen-lockfile

FROM base AS generate
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY prisma.config.ts prisma.config.js prisma.config.d.ts prisma.config.d.ts.map ./
COPY tsconfig.json ./
COPY nodeApp ./nodeApp/
COPY Users ./Users/
COPY Calories ./Calories/
COPY scripts ./scripts/
RUN pnpm prisma generate

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=generate /app/prisma ./prisma
COPY --from=generate /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=generate /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma.config.ts prisma.config.js prisma.config.d.ts prisma.config.d.ts.map ./
COPY tsconfig.json ./
COPY nodeApp ./nodeApp/
COPY Users ./Users/
COPY Calories ./Calories/
COPY scripts ./scripts/
RUN pnpm tsc || true

FROM base AS production
ENV NODE_ENV=production
ENV FOOD_DATA_PATH=/app/food_data/foods_fdc
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=generate /app/prisma ./prisma
COPY --from=generate /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=generate /app/node_modules/@prisma ./node_modules/@prisma
COPY package.json ./

COPY --from=build /app/nodeApp/*.js ./nodeApp/
COPY --from=build /app/Users/*.js ./Users/
COPY --from=build /app/Users/services/*.js ./Users/services/
COPY --from=build /app/Calories/*.js ./Calories/
COPY --from=build /app/Calories/services/*.js ./Calories/services/
COPY --from=build /app/scripts/*.js ./scripts/
COPY --from=build /app/prisma/scripts/*.js ./prisma/scripts/
COPY --from=build /app/prisma.config.js ./

COPY --from=build /app/nodeApp/apis/foodApi/*.js ./nodeApp/apis/foodApi/

COPY food_data/foods_fdc /app/food_data/foods_fdc

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node prisma/scripts/seed_demo.js && node nodeApp/app.js"]
