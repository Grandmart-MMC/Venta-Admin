# Build 
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production 
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Port & host 
ENV PORT 3006
ENV HOST 0.0.0.0
EXPOSE 3006

CMD ["npm", "start"]