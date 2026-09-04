FROM node:22-alpine
WORKDIR /app
COPY server/contact.mjs ./contact.mjs
ENV NODE_ENV=production CONTACT_API_PORT=8787
USER node
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO- http://127.0.0.1:8787/healthz || exit 1
CMD ["node", "contact.mjs"]
