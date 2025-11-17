# Start with the official Debian-based Nginx image
FROM nginx:latest

# Install OpenSSL using apt
RUN apt update && apt install -y openssl

# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for SSL certificates
RUN mkdir -p /etc/nginx/certs

# Generate self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/certs/localhost.key \
  -out /etc/nginx/certs/localhost.crt \
  -subj "/C=MA/ST=Beni-Mellal-Khenifra/L=Khouribga/O=1337Khouribga/OU=Development/CN=localhost"