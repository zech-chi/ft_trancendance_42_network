FROM docker.elastic.co/kibana/kibana:8.15.0

USER root

COPY dashboard.ndjson /usr/share/kibana/dashboard.ndjson
COPY import.sh /usr/share/kibana/import.sh

RUN chmod +x /usr/share/kibana/import.sh

USER kibana
