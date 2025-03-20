
export interface MoneroConfig {
  // Paths
  moneroPath: string;
  torPath: string;
  i2pPath: string;
  blockchainPath: string;
  configPath: string;
  logPath: string;
  dataDir: string;
  torrcPath: string;
  torDataPath: string;
  torLogPath: string;
  i2pDataPath: string;
  i2pConfigPath: string;
  i2pTunnelsPath: string;
  i2pLogPath: string;
  banList?: string;
  
  // Network settings
  networkType: 'mainnet' | 'testnet' | 'stagenet';
  
  // Node settings
  p2pBindIp: string;
  p2pBindPort: number;
  rpcBindIp: string;
  rpcBindPort: number;
  p2pExternalPort?: number;
  
  // Proxy settings
  torEnabled: boolean;
  torProxyIp: string;
  torProxyPort: number;
  torSocksPort: number;
  torOnionAddress?: string;
  torOnly?: boolean;
  txProxy?: string;
  anonymousInboundTor?: string;
  
  i2pEnabled: boolean;
  i2pProxyIp: string;
  i2pProxyPort: number;
  i2pSamPort: number;
  i2pProxy?: string;
  i2pAddress?: string;
  i2pOnly?: boolean;
  anonymousInboundI2p?: string;
  
  // Advanced settings
  limitRate: boolean;
  limitRateUp: number;
  limitRateDown: number;
  disableRpcBan: boolean;
  maxConcurrency: number;
  maxConcurrentConnections?: number;
  
  // ZMQ settings
  zmqEnabled: boolean;
  zmqBindIp: string;
  zmqPubPort: number;
  zmqPort: number;
  noZmq?: boolean;
  
  // RPC settings
  rpcEnabled: boolean;
  restrictRpc?: boolean;
  publicNode?: boolean;
  rpcLogin?: string;
  rpcSsl?: boolean;
  rpcSslCert?: string;
  rpcSslKey?: string;
  confirmExternalBind?: boolean;
  rpcPaymentAllowFreeLoopback?: boolean;
  
  // Flags
  pruningEnabled: boolean;
  pruning: boolean;
  pruningSize?: number;
  pruneSize?: number;
  syncPrunedBlocks?: boolean;
  offlineMode: boolean;
  offline: boolean;
  disableIPv6: boolean;
  detach: boolean;
  syncMode: 'normal' | 'safe' | 'fast';
  fastSync?: boolean;
  fastBlockSync?: boolean;
  
  // Peer settings
  outPeers?: number | string;
  inPeers?: number | string;
  hideMyPort?: boolean;
  noIgd?: boolean;
  allowLocalIp?: boolean;
  addPeer?: string;
  seedNode?: string;
  addPriorityNode?: string;
  addExclusiveNode?: string;
  
  // Log settings
  logLevel: number;
  noConsoleLog?: boolean;
  maxLogFileSize?: number | string;
  maxLogFiles?: number | string;
  
  // Blockchain settings
  blockSyncSize?: number | string;
  dbSyncMode?: string;
  enforceCheckpoints?: boolean;
  disableCheckpoints?: boolean;
  enableDnsBlocklist?: boolean;
  
  // Bootstrap settings
  useBootstrapDaemon?: boolean;
  bootstrapDaemonAddress?: string;
  checkUpdates?: string;
  
  // Extra args
  extraArgs: string;
  
  // Additional settings
  padTransactions?: boolean;
}

export interface StatusInfo {
  blockHeight: number;
  connections: number;
  networkHashrate: number;
  miningStatus: boolean;
  syncStatus: number; // percentage (0-100)
  version: string;
  uptime: number; // in seconds
}

export interface ConnectionTestResult {
  port: number;
  service: string;
  status: 'open' | 'closed' | 'timeout' | 'error';
  message: string;
  timestamp: string;
  portStatus: 'open' | 'closed' | 'timeout' | 'error';
  rpcConnectivity?: boolean;
  torConnectivity?: boolean;
  i2pConnectivity?: boolean;
  daemonVersion?: string;
}

export interface RpcCommandResult {
  success: boolean;
  result: any;
  error?: string;
}

export interface MoneroContextType {
  // Config management
  config: MoneroConfig;
  setConfig: (config: MoneroConfig | ((prev: MoneroConfig) => MoneroConfig)) => void;
  saveConfig: () => void;
  loadConfig: (configPath?: string) => void;
  showBinaryConfig: boolean;
  setShowBinaryConfig: (show: boolean) => void;
  testPaths: () => Promise<void>;
  
  // Daemon control
  isRunning: boolean;
  startNode: () => void;
  stopNode: () => void;
  statusInfo: StatusInfo;
  downloadLatestDaemon: () => void;
  isDownloading: boolean;
  
  // Proxy control
  torProxyRunning: boolean;
  i2pProxyRunning: boolean;
  startTorProxy: () => void;
  stopTorProxy: () => void;
  startI2PProxy: () => void;
  stopI2PProxy: () => void;
  
  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Logs
  logs: {
    console: string[];
    logFile: string[];
    torProxy: string[];
    i2pProxy: string[];
  };
  refreshLogs: () => void;
  
  // Connectivity testing
  testConnectivity: () => Promise<void>;
  connectionTestResults: ConnectionTestResult[];
  checkPortStatus: (port: number, service: string) => Promise<ConnectionTestResult>;
  testRpcCommand: (command: string, params?: any) => Promise<RpcCommandResult>;
}
