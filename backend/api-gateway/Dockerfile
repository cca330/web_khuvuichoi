FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --retry 3 --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev --ignore-scripts --retry 3 --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000
COPY --from=build /app/dist ./dist
RUN mkdir -p uploads
EXPOSE 8000
CMD ["node", "dist/main"]
