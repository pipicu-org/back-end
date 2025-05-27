FROM node:23-alpine as BUILD
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier
RUN npm run build
RUN npm run lint
FROM node:23-alpine as RUN
COPY --from=build . .
WORKDIR /app
EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]
