FROM node:22-alpine

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install --legacy-peer-deps


# Copy all source code
COPY . .

# Expose your service port
EXPOSE 5001

# Run in dev mode
# CMD ["npm", "run", "dev"]
# Run in production mode
#build the TypeScript code first
RUN npm run build
CMD ["npm", "start"]
