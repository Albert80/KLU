# Multistage build - Etapa de construcción
FROM node:20-alpine AS builder

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_DISABLE_ESLINT=true

WORKDIR /build

RUN apk add --no-cache libc6-compat

COPY package*.json ./
COPY .npmrc* ./

RUN npm ci

COPY . .

RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    apk add --no-cache curl

WORKDIR /app

COPY --from=builder --chown=nextjs:nodejs /build/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /build/.npmrc* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=nextjs:nodejs /build/.next/ ./.next
COPY --from=builder --chown=nextjs:nodejs /build/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /build/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /build/public ./.next/standalone/public
COPY --from=builder --chown=nextjs:nodejs /build/public ./public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl --silent --fail http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
