#!/bin/bash

echo "⏳ Waiting for Kibana to be ready..."

until curl -s -o /dev/null "http://localhost:5601/api/status"; do
  sleep 3
done

echo "✅ Kibana is ready, importing dashboard..."

curl -X POST "http://localhost:5601/api/saved_objects/_import" \
  -H "kbn-xsrf: true" \
  --form file=@/usr/share/kibana/dashboard.ndjson

echo "🎉 Dashboard imported successfully!"
