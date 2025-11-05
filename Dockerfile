# ---- Build stage ----
FROM node:18-alpine AS builder

# Install build tools (needed for some npm modules)
RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Optional: fix crypto issues in Node 18+
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build the Remix/Vite app
RUN npm run build


# ---- Runtime stage ----
FROM node:18-alpine

# Only install runtime dependencies
RUN apk add --no-cache openssl

WORKDIR /app
ENV NODE_ENV=production

# Copy only necessary files from builder
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built assets from builder stage
COPY --from=builder /app ./

EXPOSE 3000

# Start the app
CMD ["npm", "run", "docker-start"]
