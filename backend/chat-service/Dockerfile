FROM node:22

WORKDIR /app

# Install build tools
RUN apt-get update && apt-get install -y \
    python3 \
    g++ \
    make \
    libc6-dev \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only package.json & package-lock.json first
COPY package*.json ./

# Use the image's Node headers when compiling native dependencies.
RUN npm_config_nodedir=/usr/local npm install --build-from-source --legacy-peer-deps

# Copy all source code including src
COPY . .

EXPOSE 5002
# CMD ["npm", "run", "dev"]

RUN npm run build

CMD ["npm", "start"]
