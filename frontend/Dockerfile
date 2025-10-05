# # # Stage 1: Builder
# FROM node:22 AS builder

# WORKDIR /app

# # Install dependencies
# COPY package*.json ./

# # If you have dependency conflicts, use:
# # RUN npm install --legacy-peer-deps
# RUN npm install

# # Copy the rest of the code
# COPY . .

# # Build Next.js
# RUN npm run build

# # Stage 2: Production
# FROM node:22

# WORKDIR /app

# # Copy package.json & install only production deps
# COPY --from=builder /app/package*.json ./
# RUN npm install --omit=dev

# # Copy built app
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/next.config.js ./next.config.js
# COPY --from=builder /app/package.json ./package.json

# EXPOSE 3000

# CMD ["npm", "start"]

FROM node:22
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
