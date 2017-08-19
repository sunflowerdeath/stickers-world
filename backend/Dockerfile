FROM node:8.2.1

EXPOSE 80

WORKDIR /stickers-world-backend

COPY package.json package-lock.json ./
RUN npm install
COPY src/ ./src
CMD node src/server.js
