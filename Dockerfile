# Base image for all stages
FROM node:20-alpine3.17 AS base

# Set up a working directory
WORKDIR /app

# Install base dependencies for all stages
RUN apk add --no-cache libc6-compat openssl

# Install dependencies only when needed
FROM base AS deps
# Copy only the necessary files for dependency installation
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image
FROM base AS runner

# Use non-root user for security
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

ENV NODE_ENV production

# Copy only the necessary files for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set proper permissions
RUN mkdir .next && chown -R nextjs:nodejs .next public

USER nextjs

# Expose the application port
EXPOSE 3000
ENV PORT 3000

# Run the Next.js server
CMD ["node", "server.js"]
