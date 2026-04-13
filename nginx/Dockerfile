FROM nginx:1.29.2-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Build argument to select environment (dev or prod)
ARG BUILD_ENV=dev

# Copy custom nginx configuration based on build environment
COPY nginx.${BUILD_ENV}.conf /etc/nginx/nginx.conf

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
