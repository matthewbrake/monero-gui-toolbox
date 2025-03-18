
# Monero Suite Docker Configuration

This directory contains Docker configuration files for running Monero Suite in a containerized environment with Tor and I2P integration.

## Directory Structure

```
docker/
├── entrypoint.sh           - Container startup script
├── torrc.default           - Default Tor configuration
├── i2pd.conf.default       - Default I2P daemon configuration
├── tunnels.conf.default    - Default I2P tunnels configuration for Monero
└── README.md               - This documentation file
```

## Quick Start

From the project root directory:

```bash
# Create required data directories
mkdir -p data/monero/blockchain data/monero/logs data/monero/configs
mkdir -p data/tor/data data/tor/logs data/tor/config
mkdir -p data/i2p/data data/i2p/logs data/i2p/config

# Start the container
docker-compose up -d

# Access the web interface
# Open http://localhost:3000 in your browser
```

## Volume Mounts

The Docker setup mounts these directories from your host to the container:

| Host Directory | Container Directory | Purpose |
|----------------|---------------------|---------|
| `./data/monero/blockchain` | `/app/monero/blockchain` | Monero blockchain data |
| `./data/monero/logs` | `/app/monero/logs` | Monero daemon logs |
| `./data/monero/configs` | `/app/monero/configs` | Monero configuration files |
| `./data/tor/data` | `/app/tor/data` | Tor data directory |
| `./data/tor/hidden_service` | `/app/tor/hidden_service` | Tor hidden service (onion) |
| `./data/tor/logs` | `/app/tor/logs` | Tor log files |
| `./data/tor/config` | `/app/tor/config` | Tor configuration files |
| `./data/i2p/data` | `/app/i2p/data` | I2P data directory |
| `./data/i2p/logs` | `/app/i2p/logs` | I2P log files |
| `./data/i2p/config` | `/app/i2p/config` | I2P configuration files |
| `./data/monero/bin` | `/app/monero/bin` | Custom Monero binaries (optional) |
| `./data/tor/bin` | `/app/tor/bin` | Custom Tor binaries (optional) |
| `./data/i2p/bin` | `/app/i2p/bin` | Custom I2P binaries (optional) |

## Port Mappings

The container exposes these ports:

| Host Port | Container Port | Service |
|-----------|----------------|---------|
| 3000 | 3000 | Web UI |
| 18080 | 18080 | Monero P2P (blockchain sync) |
| 18081 | 18081 | Monero RPC |
| 18082 | 18082 | Monero ZMQ |
| 18085 | 18085 | I2P anonymous inbound |
| 18089 | 18089 | I2P RPC port |
| 9050 | 9050 | Tor SOCKS proxy |
| 9051 | 9051 | Tor control port |
| 4444 | 4444 | I2P HTTP proxy |
| 4447 | 4447 | I2P SOCKS proxy |
| 7656 | 7656 | I2P SAM port |
| 7070 | 7070 | I2P web console |

## Custom Binaries

If you want to use your own binaries instead of the downloaded ones:

1. Place your binaries in the appropriate directories:
   - `./data/monero/bin/linux/monerod` - Linux Monero daemon
   - `./data/monero/bin/linux/monero-wallet-rpc` - Linux Monero wallet RPC

2. Make sure they have proper permissions:
   ```bash
   chmod +x ./data/monero/bin/linux/monerod
   chmod +x ./data/monero/bin/linux/monero-wallet-rpc
   ```

3. Restart the container:
   ```bash
   docker-compose restart
   ```

## Configuration Templates

The container automatically creates default configuration files if they don't exist:

- `torrc` - Tor configuration file
- `i2pd.conf` - I2P daemon configuration
- `tunnels.conf` - I2P tunnels for Monero services

You can edit these files in the mounted volumes:

```bash
# Edit Tor configuration
nano ./data/tor/config/torrc

# Edit I2P configuration
nano ./data/i2p/config/i2pd.conf

# Edit I2P tunnels configuration
nano ./data/i2p/config/tunnels.conf
```

## Accessing Hidden Services

### Finding your Tor .onion address

After starting Tor in the web UI, your .onion address can be found in:
```bash
cat ./data/tor/hidden_service/hostname
```

### Finding your I2P address

After starting I2P in the web UI, your I2P address can be displayed with:
```bash
docker-compose exec monero-suite curl -s http://127.0.0.1:7070/?page=i2p_tunnels | grep -Eo "[a-zA-Z0-9./?=_%:-]*" | grep "18089"
```

## Troubleshooting

If you encounter issues:

1. Check container logs:
   ```bash
   docker-compose logs -f
   ```

2. Verify directory permissions:
   ```bash
   sudo chown -R 1000:1000 ./data
   ```

3. Rebuild the container:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```
