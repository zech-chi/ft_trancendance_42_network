# FROM node:22-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --legacy-peer-deps

# COPY . .

# RUN npm run build

# EXPOSE 3000
# CMD ["npm", "run", "start"]
# # CMD ["npm", "run", "dev"]

FROM node:22-alpine AS build

#ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
 CMD ["npm", "run", "dev"]
# Use Webpack instead of Turbopack to reduce build memory usage
# RUN npm run build

# FROM node:22-alpine
# ENV NEXT_TELEMETRY_DISABLED=1

# WORKDIR /app
# COPY --from=build /app ./

# EXPOSE 3000
# CMD ["npm", "start"]
