FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app
COPY package.json astro.config.mjs tsconfig.json ./
COPY scripts ./scripts
RUN npm install --no-audit --no-fund
COPY public ./public
COPY src ./src
ARG SITE_BASE_URL
RUN test -n "$SITE_BASE_URL" || (echo "SITE_BASE_URL build arg is required" >&2 && exit 1)
ENV SITE_BASE_URL=$SITE_BASE_URL
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.30.4-alpine3.24
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
