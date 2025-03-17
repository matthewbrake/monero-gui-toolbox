
# Stage 1: Build the application
FROM node:18-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create production image
FROM alpine:latest

# Install necessary utilities and binaries
RUN apk add --no-cache \
    nodejs \
    npm \
    tor \
    wget \
    curl \
    bash \
    su-exec \
    # Required for checking open ports
    net-tools \
    # Required for downloading Monero binaries
    tar \
    bzip2

# Create necessary directories
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

# Install a simple web server to serve the static files
RUN npm install -g serve

# Set the working directory
WORKDIR /app

# Expose the necessary ports
# Monero P2P
EXPOSE 18080
# Monero RPC
EXPOSE 18081
# Monero ZMQ
EXPOSE 18082
# Tor SOCKS proxy
EXPOSE 9050
# Tor control port
EXPOSE 9051
# I2P HTTP proxy
EXPOSE 4444
# I2P SOCKS proxy
EXPOSE 4447
# I2P SAM port
EXPOSE 7656
# Web UI port
EXPOSE 3000

# Create default configuration files
COPY docker/torrc.default /app/tor/config/torrc
COPY docker/i2pd.conf.default /app/i2p/config/i2pd.conf
COPY docker/tunnels.conf.default /app/i2p/config/tunnels.conf

# Set up the entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Default command to run the web server
CMD ["serve", "-s", "dist", "-l", "3000"]
