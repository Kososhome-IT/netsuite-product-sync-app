# ---- Build stage ----
FROM node:18-alpine AS builder

# Install build tools (needed for some npm modules)
RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install all deps (including dev) for build
RUN npm ci

# Copy the rest of the source code
COPY . .

# Optional: fix crypto issues in Node 18+
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build the Remix/Vite app
RUN npm run build


# ---- Runtime stage ----
FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copy only package files and install prod deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy only what is needed at runtime from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/app ./app
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/remix.config.* ./
COPY --from=builder /app/vite.config.* ./
COPY --from=builder /app/tsconfig.* ./

EXPOSE 8080

# Uses your existing script:
# "docker-start": "npm run setup && npm run start"
CMD ["npm", "run", "docker-start"]
