# syntax=docker/dockerfile:1

# --- Build stage: compile packages and the static Storybook bundle ---
FROM node:25-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json tsconfig.base.json .npmrc ./
COPY scripts ./scripts
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile
RUN pnpm build && pnpm build:storybook

# --- Runtime stage: nginx serving the static showcase. No Node runtime. ---
# nginx-unprivileged runs as uid 101 and keeps its pid and temp files under
# /tmp, so the container needs no capabilities and works with a read-only
# root filesystem (base-service step-2 defaults). The numeric USER lets the
# kubelet verify runAsNonRoot.
FROM nginxinc/nginx-unprivileged:1.30-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/storybook/storybook-static /usr/share/nginx/html
USER 101:101
EXPOSE 8080
