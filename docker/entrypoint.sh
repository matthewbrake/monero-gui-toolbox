
#!/bin/bash
set -e

echo "=============================================="
echo "🚀 Starting Monero Suite Docker Environment"
echo "=============================================="

# Create directories if they don't exist
mkdir -p /app/monero/blockchain /app/monero/logs /app/monero/configs
mkdir -p /app/tor/data /app/tor/hidden_service /app/tor/logs /app/tor/config
mkdir -p /app/i2p/data /app/i2p/logs /app/i2p/config

# Create default configuration files if they don't exist
if [ ! -f /app/tor/config/torrc ]; then
  echo "📄 Creating default Tor configuration..."
  cp /app/tor/config/torrc.default /app/tor/config/torrc
  echo "✅ Tor configuration created successfully"
fi

if [ ! -f /app/i2p/config/i2pd.conf ]; then
  echo "📄 Creating default I2P configuration..."
  cp /app/i2p/config/i2pd.conf.default /app/i2p/config/i2pd.conf
  echo "✅ I2P configuration created successfully"
fi

if [ ! -f /app/i2p/config/tunnels.conf ]; then
  echo "📄 Creating default I2P tunnels configuration..."
  cp /app/i2p/config/tunnels.conf.default /app/i2p/config/tunnels.conf
  echo "✅ I2P tunnels configuration created successfully"
fi

# Check if monerod binary exists, if not, download it
if [ ! -f /app/monero/bin/linux/monerod ]; then
  echo "📥 Monero daemon not found, downloading latest version..."
  MONERO_VERSION="v0.18.3.1"
  MONERO_URL="https://downloads.getmonero.org/cli/monero-linux-x64-${MONERO_VERSION}.tar.bz2"
  
  echo "   Downloading from: ${MONERO_URL}"
  wget -q -O /tmp/monero.tar.bz2 ${MONERO_URL}
  echo "   Extracting files..."
  tar -xjf /tmp/monero.tar.bz2 -C /tmp
  mkdir -p /app/monero/bin/linux
  cp /tmp/monero-x86_64-linux-gnu-*/monerod /app/monero/bin/linux/
  cp /tmp/monero-x86_64-linux-gnu-*/monero-wallet-rpc /app/monero/bin/linux/
  chmod +x /app/monero/bin/linux/monerod
  chmod +x /app/monero/bin/linux/monero-wallet-rpc
  rm -rf /tmp/monero.tar.bz2 /tmp/monero-x86_64-linux-gnu-*
  echo "✅ Monero daemon downloaded and installed successfully"
fi

# Set permissions
chown -R 1000:1000 /app/monero
chown -R 1000:1000 /app/tor
chown -R 1000:1000 /app/i2p
echo "🔒 Permissions set correctly"

# Display welcome message and available services
echo ""
echo "=============================================="
echo "🧅 Monero Suite Docker Container Ready"
echo "=============================================="
echo "📊 Web UI: http://localhost:3000"
echo "🔗 Monero RPC: http://localhost:18081"
echo "🧅 Tor SOCKS: socks5://localhost:9050"
echo "🌐 I2P HTTP Proxy: http://localhost:4444"
echo "🌐 I2P SOCKS: socks5://localhost:4447"
echo ""
echo "The container is now starting the web interface."
echo "Use the web UI to start/stop services as needed."
echo "=============================================="
echo ""

# Execute the CMD
exec "$@"
