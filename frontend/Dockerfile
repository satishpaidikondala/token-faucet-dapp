FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .

# --- ADD THESE LINES ---
ARG VITE_RPC_URL
ARG VITE_TOKEN_ADDRESS
ARG VITE_FAUCET_ADDRESS

ENV VITE_RPC_URL=$VITE_RPC_URL
ENV VITE_TOKEN_ADDRESS=$VITE_TOKEN_ADDRESS
ENV VITE_FAUCET_ADDRESS=$VITE_FAUCET_ADDRESS
# -----------------------

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