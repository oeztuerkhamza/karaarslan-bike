# syntax=docker/dockerfile:1.7
# =============================================
# Stage 1: Build Angular SSR
# =============================================
FROM node:20-alpine AS build
WORKDIR /app

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .
RUN npm run build -- --configuration production

# =============================================
# Stage 2: SSR Runtime
# =============================================
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=build /app/dist/bike-haus.homepage ./dist/bike-haus.homepage

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:4000/ || exit 1

CMD ["node", "dist/bike-haus.homepage/server/server.mjs"]
