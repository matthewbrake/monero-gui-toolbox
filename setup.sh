
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

# Create a simple README in the data directory
cat > data/README.md << 'EOF'
# Monero Suite Data Directory

This directory contains all persistent data and configuration files for Monero Suite.

## Directory Structure

- **monero/** - Monero daemon data and configurations
  - **blockchain/** - Blockchain data (can be large)
  - **logs/** - Monero daemon logs
  - **configs/** - Custom configuration files
  - **bin/** - Binary executables (linux/win)

- **tor/** - Tor proxy data and configurations
  - **data/** - Tor data directory
  - **logs/** - Tor logs
  - **config/** - Tor configuration
  - **hidden_service/** - Tor hidden service keys
  - **bin/** - Tor binaries (if not using system Tor)

- **i2p/** - I2P proxy data and configurations
  - **data/** - I2P data directory
  - **logs/** - I2P logs
  - **config/** - I2P configuration
  - **bin/** - I2P binaries (if not using system I2P)

## Binary Placement

To use custom binaries, place them in the appropriate directories:

- For Monero: `data/monero/bin/linux/` or `data/monero/bin/win/`
- For Tor: `data/tor/bin/`
- For I2P: `data/i2p/bin/`

## Configuration

The default configuration files are copied during setup. You can modify them:

- Tor: `data/tor/config/torrc`
- I2P: `data/i2p/config/i2pd.conf` and `data/i2p/config/tunnels.conf`
- Monero: Configure through the web UI, or directly in `data/monero/configs/`

EOF

echo "✅ Created documentation in data directory"

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
echo "Next steps:"
echo "1. Download Monero binaries or place custom binaries in the bin directories"
echo "2. Configure your node through the web interface"
echo "3. Start the Monero daemon and privacy services"
echo ""
echo "For more information, see README.md or data/README.md"
echo "===================================="

# Make sure the script is executable
chmod +x setup.sh
