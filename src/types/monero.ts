
// MoneroConfig interface defines all the configuration parameters
export interface MoneroConfig {
  // General/Basic settings
  moneroPath: string;
  dataDir: string;
  logLevel: number;
  noConsoleLog: boolean;
  maxLogFileSize: string;
  maxLogFiles: string;
  
  // Checkpoints and security
  enforceCheckpoints: boolean;
  disableCheckpoints: boolean;
  banList: string;
  enableDnsBlocklist: boolean;
  
  // Blockchain settings
  pruning: boolean;
  pruningSize: string;
  syncPrunedBlocks: boolean;
  blockSyncSize: string;
  fastBlockSync: boolean;
  checkUpdates: string;
  useBootstrapDaemon: boolean;
  bootstrapDaemonAddress: string;
  dbSyncMode: string;
  
  // RPC settings
  rpcEnabled: boolean;
  rpcBindIp: string;
  rpcBindPort: string;
  restrictRpc: boolean;
  rpcLogin: string;
  rpcSsl: boolean;
  rpcSslCert: string;
  rpcSslKey: string;
  confirmExternalBind: boolean;
  rpcPaymentAllowFreeLoopback: boolean;
  publicNode: boolean;
  
  // P2P settings
  p2pBindIp: string;
  p2pBindPort: string;
  p2pExternalPort: string;
  hideMyPort: boolean;
  noIgd: boolean;
  offline: boolean;
  allowLocalIp: boolean;
  limitRate: string;
  limitRateUp: string;
  limitRateDown: string;
  outPeers: string;
  inPeers: string;
  addPriorityNode: string;
  addExclusiveNode: string;
  seedNode: string;
  
  // Additional properties for DaemonConfigTab
  zmqPort: string;
  maxConcurrentConnections: string;
  addPeer: string;
  pruneSize: string;
  fastSync: boolean;
  extraArgs: string;
  
  // Tor settings
  torEnabled: boolean;
  torPath: string;
  torrcPath: string;
  torDataPath: string;
  torLogPath: string;
  torSocksPort: string;
  txProxy: string;
  torOnly: boolean;
  anonymousInboundTor: string;
  torOnionAddress: string;
  padTransactions: boolean;
  
  // I2P settings
  i2pEnabled: boolean;
  i2pPath: string;
  i2pDataPath: string;
  i2pConfigPath: string;
  i2pTunnelsPath: string;
  i2pLogPath: string;
  i2pSamPort: string;
  i2pProxy: string;
  anonymousInboundI2p: string;
  i2pOnly: boolean;
  i2pAddress: string;
  
  // ZMQ settings
  zmqEnabled: boolean;
  zmqBindIp: string;
  zmqPubPort: string;
  noZmq: boolean;
  
  // Miscellaneous
  maxConcurrency: string;
}

// Interfaces for connection testing
export interface PortStatus {
  checked: boolean;
  open?: boolean;
  port?: string;
}

export interface TorConnectivity {
  tested: boolean;
  success?: boolean;
  output?: string;
  additionalTests?: {
    torProject?: {
      success: boolean;
      output: string;
    };
  };
}

export interface I2pConnectivity {
  tested: boolean;
  success?: boolean;
  output?: string;
  additionalTests?: {
    i2pSite?: {
      success: boolean;
      output: string;
    };
  };
}

export interface RpcConnectivity {
  tested: boolean;
  success?: boolean;
  output?: string;
}

export interface DaemonVersion {
  checked: boolean;
  current?: string;
  latest?: string;
  needsUpdate?: boolean;
}

export interface ConnectionTestResult {
  torConnectivity: TorConnectivity;
  i2pConnectivity: I2pConnectivity;
  rpcConnectivity: RpcConnectivity;
  daemonVersion: DaemonVersion;
  portStatus: {
    tor: PortStatus;
    i2p: PortStatus;
    monero: PortStatus;
  };
}

// Interface for status information
export interface StatusInfo {
  blockHeight: number;
  networkHashrate: string;
  connections: number;
  syncStatus: number;
  version: string;
}

// Define LogEntry and LogSource for the LogsManager
export type LogLevel = 'info' | 'warning' | 'error' | 'debug';
export type LogSource = 'console' | 'logFile' | 'torProxy' | 'i2pProxy';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  source: LogSource;
}

// Interface for log data
export interface LogData {
  console: string[];
  logFile: string[];
  torProxy: string[];
  i2pProxy: string[];
}

// Context interface that combines all of our state and functions
export interface MoneroContextType {
  config: MoneroConfig;
  setConfig: React.Dispatch<React.SetStateAction<MoneroConfig>>;
  isRunning: boolean;
  startNode: () => void;
  stopNode: () => void;
  logs: LogData;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  saveConfig: () => void;
  loadConfig: (configPath?: string) => void;
  statusInfo: StatusInfo;
  testConnectivity: () => Promise<void>;
  connectionTestResults: ConnectionTestResult;
  downloadLatestDaemon: () => void;
  isDownloading: boolean;
  torProxyRunning: boolean;
  i2pProxyRunning: boolean;
  startTorProxy: () => void;
  stopTorProxy: () => void;
  startI2PProxy: () => void;
  stopI2PProxy: () => void;
  showBinaryConfig: boolean;
  setShowBinaryConfig: React.Dispatch<React.SetStateAction<boolean>>;
  testPaths: () => Promise<void>;
  checkPortStatus: (type: 'tor' | 'i2p' | 'monero') => Promise<void>;
  refreshLogs: () => void;
  testRpcCommand: (proxyType: 'clearnet' | 'tor' | 'i2p') => Promise<{
    success: boolean;
    output: string;
  }>;
}
