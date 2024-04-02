# reference
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

### 1st layer
# step 1. node-alpine(lighting image size)
FROM node:18-alpine AS base

# step 2. add libc6-compat (generally needed for process.dlopen)
FROM base AS deps
RUN apk add --no-cache libc6-compat
# step 3. Install dependencies if not cached
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

### 2st layer
# step 4. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# disable telemetry(https://nextjs.org/telemetry)
ENV NEXT_TELEMETRY_DISABLED 1
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

### 3st layer
# step 5. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
# add system group to container
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# note! : need to set the config "standalone" on the next.config.js
# read here : https://nextjs.org/docs/pages/api-reference/next-config-js/output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD [ "node", "server.js" ]