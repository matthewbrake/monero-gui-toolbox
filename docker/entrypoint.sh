
#!/bin/bash
set -e

# Create default configuration files if they don't exist
if [ ! -f /app/tor/config/torrc ]; then
  echo "Creating default Tor configuration..."
  cp /app/tor/config/torrc.default /app/tor/config/torrc
fi

if [ ! -f /app/i2p/config/i2pd.conf ]; then
  echo "Creating default I2P configuration..."
  cp /app/i2p/config/i2pd.conf.default /app/i2p/config/i2pd.conf
fi

if [ ! -f /app/i2p/config/tunnels.conf ]; then
  echo "Creating default I2P tunnels configuration..."
  cp /app/i2p/config/tunnels.conf.default /app/i2p/config/tunnels.conf
fi

# Check if monerod binary exists, if not, download it
if [ ! -f /app/monero/bin/linux/monerod ]; then
  echo "Monero daemon not found, downloading..."
  MONERO_VERSION="v0.18.3.1"
  MONERO_URL="https://downloads.getmonero.org/cli/monero-linux-x64-${MONERO_VERSION}.tar.bz2"
  
  wget -q -O /tmp/monero.tar.bz2 ${MONERO_URL}
  tar -xjf /tmp/monero.tar.bz2 -C /tmp
  cp /tmp/monero-x86_64-linux-gnu-*/monerod /app/monero/bin/linux/
  cp /tmp/monero-x86_64-linux-gnu-*/monero-wallet-rpc /app/monero/bin/linux/
  chmod +x /app/monero/bin/linux/monerod
  chmod +x /app/monero/bin/linux/monero-wallet-rpc
  rm -rf /tmp/monero.tar.bz2 /tmp/monero-x86_64-linux-gnu-*
  echo "Monero daemon downloaded and installed."
fi

# Set permissions
chown -R 1000:1000 /app/monero
chown -R 1000:1000 /app/tor
chown -R 1000:1000 /app/i2p

# Display welcome message
echo "========================================="
echo "Monero Suite Docker Container"
echo "========================================="
echo "Web UI: http://localhost:3000"
echo "Monero RPC: http://localhost:18081"
echo "Tor SOCKS: socks5://localhost:9050"
echo "I2P HTTP Proxy: http://localhost:4444"
echo "I2P SOCKS: socks5://localhost:4447"
echo "========================================="

# Execute the CMD
exec "$@"
