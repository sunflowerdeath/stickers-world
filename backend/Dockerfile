FROM node:8.2.1

EXPOSE 80

WORKDIR /stickers-world-backend

COPY stickers-world-backend/package.json stickers-world-backend/package-lock.json ./
RUN npm install
COPY stickers-world-backend/src ./src
CMD node src/server.js
