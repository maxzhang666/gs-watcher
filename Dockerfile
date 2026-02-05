FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Build stage
FROM base AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Nuxt app
RUN pnpm build

# Production stage
FROM base AS production

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files and install production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/.output /app/.output

# Create symlink so node_modules can be found
RUN ln -s /app/node_modules /app/.output/server/node_modules
    
# Create .data directory for SQLite
RUN mkdir -p /app/.data && chown -R node:node /app/.data /app/node_modules /app/.output

# Use non-root user
USER node

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Start application
CMD ["node", ".output/server/index.mjs"]
