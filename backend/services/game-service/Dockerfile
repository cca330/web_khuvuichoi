# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage - Non-root user
FROM node:20-alpine
WORKDIR /app

# Tạo user không phải root để bảo mật
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy files
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3005

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e require('http').get('http://localhost:3005', (r)=>process.exit(r.statusCode===200?0:1))

CMD ["node", "dist/main"]
