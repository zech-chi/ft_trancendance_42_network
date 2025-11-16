# Start with the official Nginx image
FROM nginx:alpine

# Install OpenSSL for generating certificates
RUN apk add --no-cache openssl

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom configuration into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for certificates
RUN mkdir -p /etc/nginx/certs

    # Generate self-signed SSL certificate inside the container
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/localhost.key \
    -out /etc/nginx/certs/localhost.crt \
    -subj "/C=MA/ST=Beni-Mellal-Khenifra/L=Khouribga/O=1337Khouribga/OU=Development/CN=localhost"