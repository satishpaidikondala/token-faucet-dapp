# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
# Copy the build output from the first stage
COPY --from=build /app/dist ./dist
# Expose port 3000 as required
EXPOSE 3000
# Serve the build and allow health check route
CMD ["serve", "-s", "dist", "-l", "3000"]