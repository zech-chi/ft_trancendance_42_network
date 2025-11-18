FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
# CMD ["npm", "run", "dev"]

# ############
# # BUILDER  #
# ############
# FROM node:22-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --legacy-peer-deps
# COPY . .
# RUN npm run build


# #############
# # RUNNER    #
# #############
# FROM node:22-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --production --legacy-peer-deps

# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public

# EXPOSE 3000
# CMD ["npm", "start"]
