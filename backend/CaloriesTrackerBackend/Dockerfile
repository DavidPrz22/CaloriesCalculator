FROM node:22-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY nodeApp ./nodeApp/
COPY Users ./Users/
COPY Calories ./Calories/
COPY scripts ./scripts/
COPY food_data ./food_data/

RUN npm install --include=dev
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public" npx prisma generate

ENV NODE_ENV=production
ENV FOOD_DATA_PATH=/app/food_data/foods_fdc
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/scripts/seed_demo.ts & exec npx tsx nodeApp/app.ts"]
