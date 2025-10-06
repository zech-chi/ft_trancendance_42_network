FROM node:22-alpine

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install --legacy-peer-deps


# Copy all source code
COPY . .

# Expose your service port
EXPOSE 5002

# Run in dev mode
CMD ["npm", "run", "dev"]
