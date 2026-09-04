FROM gcr.io/distroless/nodejs22-debian13:nonroot
WORKDIR /app
COPY server/contact.mjs ./contact.mjs
ENV NODE_ENV=production CONTACT_API_PORT=8787
EXPOSE 8787
CMD ["contact.mjs"]
