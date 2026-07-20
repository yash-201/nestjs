# Stage 1: Build the NestJS app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace configurations and package files
COPY package*.json tsconfig.base.json nx.json ./
COPY product-service ./product-service

# Install dependencies
RUN npm ci

# Build the product-service using Nx
RUN npx nx build product-service

# Stage 2: Runner image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package configuration to install production-only dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /app/product-service/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "dist/main.js"]
