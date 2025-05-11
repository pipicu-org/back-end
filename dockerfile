FROM node:23-alpine as build
RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run lint
FROM node:23-alpine as run
COPY --from=build . .
WORKDIR /app
EXPOSE 3000
CMD [ "npm", "run", "start" ]
