# ── Single HTML Deployment ────────────────────────────────────────────────
FROM nginx:stable-alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy the standalone HTML file directly
COPY index.html /usr/share/nginx/html/index.html

# nginx config for SPA (client-side routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run listens on 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
