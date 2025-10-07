FROM node:22-alpine

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose your service port
EXPOSE 5004

# Run in dev mode
CMD ["npm", "run", "dev"]
