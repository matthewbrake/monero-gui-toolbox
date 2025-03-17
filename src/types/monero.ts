
export interface MoneroConfig {
  // General/Basic settings
  moneroPath: string;  // Path to monerod executable
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
  
  // Tor settings
  torEnabled: boolean;
  torPath: string;          // Path to tor executable
  torrcPath: string;        // Path to torrc config file
  torDataPath: string;      // Path to tor data directory
  torLogPath: string;       // Path to tor log file
  torSocksPort: string;
  txProxy: string;
  torOnly: boolean;
  anonymousInboundTor: string;
  torOnionAddress: string;
  padTransactions: boolean;
  
  // I2P settings
  i2pEnabled: boolean;
  i2pPath: string;          // Path to i2p executable
  i2pDataPath: string;      // Path to i2p data directory
  i2pConfigPath: string;    // Path to i2pd.conf file
  i2pTunnelsPath: string;   // Path to tunnels.conf file
  i2pLogPath: string;       // Path to i2p log file
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

  refreshLogs?: () => void;
}

export interface ConnectionTestResult {
  torConnectivity: { tested: boolean, success?: boolean, output?: string };
  i2pConnectivity: { tested: boolean, success?: boolean, output?: string };
  rpcConnectivity: { tested: boolean, success?: boolean, output?: string };
  daemonVersion: { checked: boolean, current?: string, latest?: string, needsUpdate?: boolean };
  portStatus: {
    tor: { checked: boolean, open?: boolean, port?: string },
    i2p: { checked: boolean, open?: boolean, port?: string },
    monero: { checked: boolean, open?: boolean, port?: string }
  };
}

export interface LogData {
  console: string[];
  logFile: string[];
  torProxy: string[];
  i2pProxy: string[];
}

export interface StatusInfo {
  blockHeight: number;
  networkHashrate: string;
  connections: number;
  syncStatus: number;
  version?: string;
}

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
  downloadLatestDaemon: (platform: 'windows' | 'linux') => Promise<void>;
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
}
