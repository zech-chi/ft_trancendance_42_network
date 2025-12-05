FROM node:22

WORKDIR /app

# Install build tools for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    g++ \
    make \
    libc6-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy only package.json & package-lock.json first
COPY package*.json ./

# Install dependencies inside container
RUN npm install --build-from-source --legacy-peer-deps

# Copy source code
COPY . .

EXPOSE 5000
# CMD ["npm", "run", "dev"]

RUN npm run build

CMD ["npm", "start"]
