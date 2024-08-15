FROM node:22-alpine AS runner
WORKDIR /app
ARG RELEASE_VERSION="docker:latest"
ARG RELEASE_DIST="docker"
ENV NX_RELEASE_VERSION=$RELEASE_VERSION
ENV NX_RELEASE_DIST=$RELEASE_DIST
ENV NODE_ENV production

EXPOSE 3000

RUN apk add --no-cache libc6-compat git
RUN corepack enable
RUN pnpm config set store-dir .pnpm-store

COPY ./dist/apps/next-frontend/package*.json ./
COPY ./.npmrc /app/

RUN --mount=type=cache,target=/app/.pnpm-store pnpm install

# Enabling JSON logging
ENV NODE_OPTIONS '-r next-logger'
COPY dist/apps/next-frontend/ ./

CMD ["pnpm", "start"]
