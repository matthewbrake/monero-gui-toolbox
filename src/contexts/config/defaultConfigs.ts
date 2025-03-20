
import { MoneroConfig, StatusInfo, ConnectionTestResult } from '../../types/monero';

export const defaultConfig: MoneroConfig = {
  // Paths
  moneroPath: "./monero/bin/monerod",
  blockchainPath: "./blockchain",
  configPath: "./monero.conf",
  logPath: "./monero.log",
  dataDir: "./data",
  torPath: "./tor/tor",
  torrcPath: "./tor/config/torrc",
  torDataPath: "./tor/data",
  torLogPath: "./tor/logs/debug.log",
  i2pPath: "./i2p/i2pd",
  i2pDataPath: "./i2p/data",
  i2pConfigPath: "./i2p/config/i2pd.conf",
  i2pTunnelsPath: "./i2p/config/tunnels.conf",
  i2pLogPath: "./i2p/logs/i2pd.log",
  banList: "",
  
  // Network settings
  networkType: 'mainnet',
  
  // Node settings
  p2pBindIp: "0.0.0.0",
  p2pBindPort: 18080,
  rpcBindIp: "127.0.0.1",
  rpcBindPort: 18081,
  p2pExternalPort: 18080,
  
  // Proxy settings
  torEnabled: false,
  torProxyIp: "127.0.0.1",
  torProxyPort: 9050,
  torSocksPort: 9050,
  torOnionAddress: "",
  torOnly: false,
  txProxy: "tor,127.0.0.1:9050,10",
  anonymousInboundTor: "",
  
  i2pEnabled: false,
  i2pProxyIp: "127.0.0.1",
  i2pProxyPort: 4444,
  i2pSamPort: 7656,
  i2pProxy: "i2p,127.0.0.1:4447",
  i2pAddress: "",
  i2pOnly: false,
  anonymousInboundI2p: "",
  
  // Advanced settings
  limitRate: 2048,  // Changed from boolean to number
  limitRateUp: 2048,
  limitRateDown: 8192,
  disableRpcBan: false,
  maxConcurrency: 0,
  maxConcurrentConnections: 0,
  
  // ZMQ settings
  zmqEnabled: false,
  zmqBindIp: "127.0.0.1",
  zmqPubPort: 18082,
  zmqPort: 18082,
  noZmq: false,
  
  // RPC settings
  rpcEnabled: true,
  restrictRpc: false,
  publicNode: false,
  rpcLogin: "",
  rpcSsl: false,
  rpcSslCert: "",
  rpcSslKey: "",
  confirmExternalBind: false,
  rpcPaymentAllowFreeLoopback: true,
  
  // Flags
  pruningEnabled: false,
  pruning: false,
  pruningSize: 1000,
  pruneSize: 1000,
  syncPrunedBlocks: false,
  offlineMode: false,
  offline: false,
  disableIPv6: false,
  detach: false,
  syncMode: 'normal',
  fastSync: false,
  fastBlockSync: false,
  
  // Peer settings
  outPeers: 12,
  inPeers: -1,
  hideMyPort: false,
  noIgd: false,
  allowLocalIp: false,
  addPeer: "",
  seedNode: "",
  addPriorityNode: "",
  addExclusiveNode: "",
  
  // Log settings
  logLevel: 0,
  noConsoleLog: false,
  maxLogFileSize: 104850000,
  maxLogFiles: 50,
  
  // Blockchain settings
  blockSyncSize: 10,
  dbSyncMode: "fast",
  enforceCheckpoints: true,
  disableCheckpoints: false,
  enableDnsBlocklist: true,
  
  // Bootstrap settings
  useBootstrapDaemon: false,
  bootstrapDaemonAddress: "",
  checkUpdates: "enabled",
  
  // Extra args
  extraArgs: "",
  
  // Additional settings
  padTransactions: false
};

export const defaultStatusInfo: StatusInfo = {
  blockHeight: 0,
  connections: 0,
  networkHashrate: 0,
  miningStatus: false,
  syncStatus: 0,
  version: "Unknown",
  uptime: 0
};

export const defaultConnectionTestResults: ConnectionTestResult[] = [
  {
    port: 18080,
    service: "P2P Network",
    status: "closed",
    portStatus: "closed",
    message: "Not tested",
    timestamp: new Date().toISOString(),
    rpcConnectivity: false,
    torConnectivity: false,
    i2pConnectivity: false,
    daemonVersion: ""
  },
  {
    port: 18081,
    service: "RPC Interface",
    status: "closed",
    portStatus: "closed",
    message: "Not tested",
    timestamp: new Date().toISOString(),
    rpcConnectivity: false,
    torConnectivity: false,
    i2pConnectivity: false,
    daemonVersion: ""
  },
  {
    port: 18082,
    service: "ZMQ Interface",
    status: "closed",
    portStatus: "closed",
    message: "Not tested",
    timestamp: new Date().toISOString(),
    rpcConnectivity: false,
    torConnectivity: false,
    i2pConnectivity: false,
    daemonVersion: ""
  }
];
