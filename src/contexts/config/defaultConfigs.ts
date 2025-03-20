
import { MoneroConfig, StatusInfo } from '../../types/monero';

export const defaultConfig: MoneroConfig = {
  // Paths
  moneroPath: '/app/monero/bin/linux/monerod',
  torPath: '/usr/bin/tor',
  i2pPath: '/usr/bin/i2pd',
  blockchainPath: '/app/monero/blockchain',
  configPath: '/app/monero/configs/monerod.conf',
  logPath: '/app/monero/logs/monerod.log',
  
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
  i2pEnabled: false,
  i2pProxyIp: '127.0.0.1',
  i2pProxyPort: 4444,
  
  // Advanced settings
  limitRate: false,
  limitRateUp: 2048,
  limitRateDown: 8192,
  disableRpcBan: false,
  maxConcurrency: 4,
  
  // Flags
  pruningEnabled: false,
  offlineMode: false,
  disableIPv6: false,
  detach: false,
  syncMode: 'normal',
  
  // Extra args
  extraArgs: '',
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
