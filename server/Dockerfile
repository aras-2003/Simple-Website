FROM gcr.io/distroless/nodejs22-debian13:nonroot@sha256:4e4fb0ce55fd73901600796ef079a9490369d2515d7da31633a91608c82ca13b
WORKDIR /app
COPY server/contact.mjs ./contact.mjs
ENV NODE_ENV=production CONTACT_API_PORT=8787
EXPOSE 8787
CMD ["contact.mjs"]
