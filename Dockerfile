# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PROJECT_ID

RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

RUN npm install -g serve

COPY --from=builder /app/dist /app

EXPOSE 3000

CMD ["serve", "-s", "/app", "-l", "3000"]
