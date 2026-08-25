# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for @nestjs/cli)
RUN npm install --retry 3 --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage - Non-root user
FROM node:20-alpine
WORKDIR /app

# Tạo user không phải root để bảo mật
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy only production dependencies and built files
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules

# Install production dependencies only
RUN npm install --omit=dev --ignore-scripts --retry 3 --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000 && \
    npm cache clean --force

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
  CMD node -e "require('http').get('http://localhost:3002', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1));"

CMD ["node", "dist/main"]
