
import { MoneroConfig, StatusInfo, ConnectionTestResult } from '../../types/monero';

export const defaultConfig: MoneroConfig = {
  // Paths
  moneroPath: '/app/monero/bin/linux/monerod',
  torPath: '/usr/bin/tor',
  i2pPath: '/usr/bin/i2pd',
  blockchainPath: '/app/monero/blockchain',
  configPath: '/app/monero/configs/monerod.conf',
  logPath: '/app/monero/logs/monerod.log',
  dataDir: '/app/monero/blockchain',
  torrcPath: '/app/tor/config/torrc',
  torDataPath: '/app/tor/data',
  torLogPath: '/app/tor/logs/tor.log',
  i2pDataPath: '/app/i2p/data',
  i2pConfigPath: '/app/i2p/config/i2pd.conf',
  i2pTunnelsPath: '/app/i2p/config/tunnels.conf',
  i2pLogPath: '/app/i2p/logs/i2pd.log',
  
  // Network settings
  networkType: 'mainnet',
  
  // Node settings
  p2pBindIp: '0.0.0.0',
  p2pBindPort: 18080,
  rpcBindIp: '127.0.0.1',
  rpcBindPort: 18081,
  
  // Proxy settings
  torEnabled: false,
  torProxyIp: '127.0.0.1',
  torProxyPort: 9050,
  torSocksPort: 9050,
  i2pEnabled: false,
  i2pProxyIp: '127.0.0.1',
  i2pProxyPort: 4444,
  i2pSamPort: 7656,
  
  // Advanced settings
  limitRate: false,
  limitRateUp: 2048,
  limitRateDown: 8192,
  disableRpcBan: false,
  maxConcurrency: 4,
  
  // ZMQ settings
  zmqEnabled: false,
  zmqBindIp: '127.0.0.1',
  zmqPubPort: 18082,
  zmqPort: 18082,
  
  // RPC settings
  rpcEnabled: true,
  
  // Flags
  pruningEnabled: false,
  pruning: false,
  offlineMode: false,
  offline: false,
  disableIPv6: false,
  detach: false,
  syncMode: 'normal',
  
  // Extra args
  extraArgs: '',
  
  // Log settings
  logLevel: 0,
};

export const defaultStatusInfo: StatusInfo = {
  blockHeight: 0,
  connections: 0,
  networkHashrate: 0,
  miningStatus: false,
  syncStatus: 0,
  version: 'v0.0.0',
  uptime: 0,
};

export const defaultConnectionTestResults: ConnectionTestResult[] = [];
