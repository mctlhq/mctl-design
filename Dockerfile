# syntax=docker/dockerfile:1

# --- Build stage: compile packages and the static Storybook bundle ---
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json tsconfig.base.json .npmrc ./
COPY scripts ./scripts
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile
RUN pnpm build && pnpm build:storybook

# --- Runtime stage: nginx serving the static showcase. No Node runtime. ---
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/storybook/storybook-static /usr/share/nginx/html
EXPOSE 80
