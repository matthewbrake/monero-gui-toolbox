
# Monero Suite Docker Setup

This directory contains the Docker configuration for running Monero Suite in a containerized environment.

## Directory Structure

```
docker/
├── entrypoint.sh           - Container startup script
├── torrc.default           - Default Tor configuration
├── i2pd.conf.default       - Default I2P daemon configuration
├── tunnels.conf.default    - Default I2P tunnels configuration
└── README.md               - This file
```

## Getting Started

1. Build and start the container using docker-compose:

```bash
docker-compose up -d
```

2. Access the Monero Suite web interface at http://localhost:3000

## Data Persistence

The docker-compose.yml mounts these directories from your host to the container:

- `./data/monero/blockchain` - Blockchain data
- `./data/monero/logs` - Monero daemon logs
- `./data/tor/logs` - Tor logs
- `./data/i2p/logs` - I2P logs
- `./data/tor/data` - Tor data directory
- `./data/tor/hidden_service` - Tor hidden service configuration
- `./data/i2p/data` - I2P data directory
- `./data/monero/configs` - Monero configuration files
- `./data/tor/config` - Tor configuration files
- `./data/i2p/config` - I2P configuration files
- `./data/monero/bin` - Monero binaries (optional, for custom binaries)
- `./data/tor/bin` - Tor binaries (optional, for custom binaries)
- `./data/i2p/bin` - I2P binaries (optional, for custom binaries)

## Exposed Ports

The container exposes the following ports:

- `3000` - Web UI
- `18080` - Monero P2P
- `18081` - Monero RPC
- `18082` - Monero ZMQ
- `9050` - Tor SOCKS proxy
- `9051` - Tor control port
- `4444` - I2P HTTP proxy
- `4447` - I2P SOCKS proxy
- `7656` - I2P SAM port

## Configuration

You can modify the default configurations by editing the following files:

- `docker/torrc.default` - Default Tor configuration
- `docker/i2pd.conf.default` - Default I2P configuration
- `docker/tunnels.conf.default` - Default I2P tunnels configuration

After making changes, rebuild the container:

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

## Custom Binaries

If you want to use your own binaries instead of the downloaded ones:

1. Place your binaries in the appropriate directory:
   - `./data/monero/bin/linux/` or `./data/monero/bin/win/`
   - `./data/tor/bin/linux/` or `./data/tor/bin/win/`
   - `./data/i2p/bin/linux/` or `./data/i2p/bin/win/`

2. Make sure they have the correct names:
   - For Monero: `monerod` and `monero-wallet-rpc`
   - For Tor: `tor`
   - For I2P: `i2pd`

3. Ensure the binaries are executable:
   ```bash
   chmod +x ./data/monero/bin/linux/monerod
   ```
