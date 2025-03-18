
#!/bin/bash

# Monero Suite Setup Script
# This script creates the necessary directory structure and template configurations

echo "===================================="
echo "Monero Suite - Setup Script"
echo "===================================="
echo "This script will create the recommended directory structure"
echo "and copy template configuration files for Monero Suite."
echo ""

# Create the main data directories
mkdir -p data/monero/blockchain data/monero/logs data/monero/configs data/monero/bin/linux data/monero/bin/win
mkdir -p data/tor/data data/tor/logs data/tor/config data/tor/hidden_service data/tor/bin
mkdir -p data/i2p/data data/i2p/logs data/i2p/config data/i2p/bin

echo "✅ Created directory structure"

# Copy template configuration files if they exist
if [ -f docker/torrc.default ]; then
  cp docker/torrc.default data/tor/config/torrc
  echo "✅ Copied Tor configuration template"
fi

if [ -f docker/i2pd.conf.default ]; then
  cp docker/i2pd.conf.default data/i2p/config/i2pd.conf
  echo "✅ Copied I2P configuration template"
fi

if [ -f docker/tunnels.conf.default ]; then
  cp docker/tunnels.conf.default data/i2p/config/tunnels.conf
  echo "✅ Copied I2P tunnels configuration template"
fi

# Set proper permissions
chmod -R 755 data

echo ""
echo "===================================="
echo "Setup complete!"
echo "===================================="
echo ""
echo "You can now start Monero Suite using Docker:"
echo "  docker-compose up -d"
echo ""
echo "Or run locally (after installing dependencies):"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "Access the web interface at:"
echo "  http://localhost:3000"
echo ""
echo "For more information, see README.md"
echo "===================================="
