FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install express 
COPY --from=build /app/dist ./dist
COPY server.js .

EXPOSE 3000
CMD ["node", "server.js"]