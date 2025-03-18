
# Monero Suite - Privacy-focused Node Manager

Monero Suite is a comprehensive web application for managing Monero nodes with integrated Tor and I2P anonymity networks. This project provides an easy-to-use interface for running and monitoring a Monero daemon with privacy enhancements.

![Monero Suite](public/og-image.png)

## Features

- **Comprehensive Node Management**: Start, stop, and monitor your Monero daemon
- **Privacy Integration**: Built-in Tor and I2P proxy support
- **Configuration Flexibility**: Easily adjust all daemon settings through the UI
- **Docker Support**: Run everything in an isolated container
- **Logging & Monitoring**: Real-time logs and status information
- **Connectivity Testing**: Verify your privacy connections are working

## Quick Start

### Using Docker (Recommended)

The simplest way to run Monero Suite is using Docker:

```bash
# Clone the repository
git clone https://github.com/yourusername/monero-suite.git
cd monero-suite

# Create necessary data directories
mkdir -p data/monero/blockchain data/monero/logs data/monero/configs
mkdir -p data/tor/data data/tor/logs data/tor/config
mkdir -p data/i2p/data data/i2p/logs data/i2p/config

# Start the container
docker-compose up -d

# View logs
docker-compose logs -f
```

The web interface will be available at http://localhost:3000

### Running Locally

To run the application locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Directory Structure

```
monero-suite/
├── data/                 # Created when running docker-compose
│   ├── monero/           # Monero data and configs
│   ├── tor/              # Tor data and configs
│   └── i2p/              # I2P data and configs
├── docker/               # Docker configuration files
├── src/                  # Source code
│   ├── components/       # React components
│   ├── contexts/         # React contexts and hooks
│   └── utils/            # Utility functions
└── docker-compose.yml    # Docker Compose configuration
```

## Configuration

### Binary Paths

Configure paths to the Monero, Tor, and I2P binaries in the "Binary Paths" dialog:

1. Click the "Binary Paths" button in the top menu
2. Set the paths to your executables
3. Save the configuration

For Docker users, these paths are pre-configured.

### Tor Configuration

The default Tor configuration creates:
- A SOCKS proxy on port 9050
- A hidden service for your Monero node

You can adjust these settings in the Anonymity tab.

### I2P Configuration

The default I2P configuration:
- Creates tunnels for anonymous inbound connections
- Sets up SOCKS proxy on port 4447
- Enables SAM bridge for application integration

## Development

To contribute to the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Docker Notes

The Docker setup:

1. Automatically downloads Monero binaries if not present
2. Creates default configuration files
3. Persists blockchain data and configurations
4. Exposes all necessary ports

You can provide your own binaries by placing them in:
- `./data/monero/bin/linux/` - Linux binaries
- `./data/monero/bin/win/` - Windows binaries

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Monero Project
- The Tor Project
- The I2P Project
