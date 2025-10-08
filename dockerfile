FROM node:23-alpine3.22 as build
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force
COPY . .
USER root
RUN npm run build

FROM node:24-alpine3.22 as run

WORKDIR /app
COPY --from=build . .

# Crear directorio logs y dar permisos
RUN mkdir -p logs && chmod 755 logs

# Dar permisos de ejecución al entrypoint
RUN chmod +x entrypoint.sh

EXPOSE 3001
CMD ["sh", "./entrypoint.sh"]
