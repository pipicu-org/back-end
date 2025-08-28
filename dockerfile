FROM node:23-alpine as build
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build
FROM node:23-alpine as run
RUN getent group nodejs || addgroup -g 1001 -S nodejs
RUN id -u deploy || adduser -S deploy -u 1001
WORKDIR /app
COPY --from=build --chown=deploy:nodejs . .
USER deploy
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --spider http://localhost:3001 || exit 1
CMD [ "npm", "run", "start:dev" ]
