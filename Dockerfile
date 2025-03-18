
# Stage 1: Build the application
FROM node:18-alpine as builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create production image
FROM alpine:latest as runtime

LABEL maintainer="Monero Suite <info@monerosuite.org>"
LABEL description="Privacy-focused Monero node management with Tor and I2P support"

# Install required packages
RUN apk add --no-cache \
    # Base requirements
    nodejs \
    npm \
    tor \
    bash \
    su-exec \
    # Network utilities
    curl \
    wget \
    net-tools \
    socat \
    iputils \
    # Archive handling 
    tar \
    bzip2 \
    # For better logging
    jq \
    # For debugging
    lsof \
    procps

# Create directory structure
RUN mkdir -p /app/monero/bin/linux \
    /app/monero/bin/win \
    /app/monero/blockchain \
    /app/monero/configs \
    /app/monero/logs \
    /app/tor/bin \
    /app/tor/data \
    /app/tor/hidden_service \
    /app/tor/config \
    /app/tor/logs \
    /app/i2p/bin \
    /app/i2p/data \
    /app/i2p/config \
    /app/i2p/logs

# Copy the built app from the builder stage
COPY --from=builder /app/dist /app/dist

# Copy template configuration files
COPY docker/torrc.default /app/tor/config/torrc.default
COPY docker/i2pd.conf.default /app/i2p/config/i2pd.conf.default
COPY docker/tunnels.conf.default /app/i2p/config/tunnels.conf.default

# Add a README inside the container
COPY docker/README.md /app/README.md

# Install a web server to serve the static files
RUN npm install -g serve

# Add startup script for services
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create a script to check service status
RUN echo '#!/bin/bash\n\
echo "=== Service Status ==="\n\
echo "Tor: $(pgrep -x tor > /dev/null && echo Running || echo Stopped)"\n\
echo "I2P: $(pgrep -x i2pd > /dev/null && echo Running || echo Stopped)"\n\
echo "Monero: $(pgrep -x monerod > /dev/null && echo Running || echo Stopped)"\n\
echo "Web UI: $(pgrep -f "serve -s dist" > /dev/null && echo Running || echo Stopped)"\n\
' > /app/status.sh && chmod +x /app/status.sh

# Set the working directory
WORKDIR /app

# Expose ports
# Monero P2P and RPC
EXPOSE 18080 18081 18082
# I2P specific ports
EXPOSE 18085 18089
# Tor SOCKS and control
EXPOSE 9050 9051
# I2P proxies, SAM and web console
EXPOSE 4444 4447 7656 7070
# Web UI
EXPOSE 3000

# Set the entrypoint and default command
ENTRYPOINT ["/entrypoint.sh"]
CMD ["serve", "-s", "dist", "-l", "3000"]
