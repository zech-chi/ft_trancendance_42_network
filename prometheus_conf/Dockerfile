FROM alpine:3.19 AS builder

    RUN apk add --no-cache wget tar
    
    # Download Prometheus binary
    RUN wget https://github.com/prometheus/prometheus/releases/download/v2.54.0/prometheus-2.54.0.linux-amd64.tar.gz \
        && tar -xzf prometheus-2.54.0.linux-amd64.tar.gz \
        && mv prometheus-2.54.0.linux-amd64 /prom
    
    # -------------------
    # Final image
    # -------------------
    FROM alpine:3.19
    
    # Install ca-certificates for HTTPS connections (if needed)
    RUN apk add --no-cache ca-certificates tzdata
    
    # Copy binaries from builder
    COPY --from=builder /prom/prometheus /usr/local/bin/prometheus
    COPY --from=builder /prom/promtool /usr/local/bin/promtool
    COPY --from=builder /prom/consoles /usr/share/prometheus/consoles
    COPY --from=builder /prom/console_libraries /usr/share/prometheus/console_libraries
    
    # Create necessary directories
    RUN mkdir -p /etc/prometheus /prometheus
    
    # Copy config
    COPY prometheus.yml /etc/prometheus/prometheus.yml
    
    # Create user and set permissions
    RUN adduser -D -g '' promuser && \
        chown -R promuser:promuser /etc/prometheus /prometheus
    
    # Switch to non-root user
    USER promuser
    
    WORKDIR /prometheus
    
    EXPOSE 9090
    
    ENTRYPOINT ["/usr/local/bin/prometheus"]
    CMD ["--config.file=/etc/prometheus/prometheus.yml", \
         "--storage.tsdb.path=/prometheus", \
         "--storage.tsdb.retention.time=15d", \
         "--web.console.libraries=/usr/share/prometheus/console_libraries", \
         "--web.console.templates=/usr/share/prometheus/consoles", \
         "--web.enable-lifecycle"]