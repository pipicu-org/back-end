FROM node:23-alpine as BUILD
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier
RUN npm run build
FROM node:23-alpine as RUN
COPY --from=build . .
WORKDIR /app
EXPOSE 3000
RUN npm run typeorm -- -d src/config/initializeDatabase.ts migration:run
CMD [ "npm", "run", "start:dev" ]
