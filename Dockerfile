FROM python:3.13-alpine AS build
WORKDIR /app
COPY site.config.json ./
COPY src ./src
COPY scripts/build.py ./scripts/build.py
ARG SITE_BASE_URL=http://localhost:8080
ARG PRODUCTION=0
ENV SITE_BASE_URL=$SITE_BASE_URL PRODUCTION=$PRODUCTION
RUN python3 ./scripts/build.py

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
