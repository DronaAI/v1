# ----------------------------------
# Stage 1: Base Image
# ----------------------------------
  FROM node:20-alpine3.17 AS base

  # Set environment variables
  ENV NODE_ENV=production
  ENV PORT=3000
  
  # Create a group and user for running the app
  RUN addgroup --system --gid 1001 nodejs && \
      adduser --system --uid 1001 nextjs
  
  # Set working directory
  WORKDIR /app
  
  # ----------------------------------
  # Stage 2: Dependencies
  # ----------------------------------
  FROM base AS deps
  
  # Install system dependencies
  RUN apk add --no-cache libc6-compat
  
  # Copy dependency definitions
  COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
  
  # Install dependencies based on the available lock file
  RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi
  
  # ----------------------------------
  # Stage 3: Builder
  # ----------------------------------
  FROM base AS builder
  
  # Set working directory
  WORKDIR /app
  
  # Copy installed dependencies from deps stage
  COPY --from=deps /app/node_modules ./node_modules
  
  # Copy the rest of the application code
  COPY . .
  
  # Build the Next.js application
  RUN \
    if [ -f yarn.lock ]; then yarn build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi
  
  # ----------------------------------
  # Stage 4: Production Runner
  # ----------------------------------
  FROM base AS runner
  
  # Set working directory
  WORKDIR /app
  
  # Set environment variables
  ENV NODE_ENV=production
  ENV PORT=3000
  
  # Create necessary directories and set permissions
  RUN mkdir -p /app/.next && chown nextjs:nodejs /app/.next
  
  # Copy public assets
  COPY --from=builder /app/public ./public
  
  # Copy the standalone build output
  COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
  COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
  
  # Expose the application port
  EXPOSE 3000
  
  # Health check to ensure the app is running
  HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1
  
  # Switch to non-root user
  USER nextjs
  
  # Start the Next.js application using the standalone server
  CMD ["node", "server.js"]
  