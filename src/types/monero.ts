
export interface MoneroConfig {
  // Paths
  moneroPath: string;
  torPath: string;
  i2pPath: string;
  blockchainPath: string;
  configPath: string;
  logPath: string;
  
  // Network settings
  networkType: 'mainnet' | 'testnet' | 'stagenet';
  
  // Node settings
  p2pBindIp: string;
  p2pBindPort: number;
  rpcBindIp: string;
  rpcBindPort: number;
  
  // Proxy settings
  torEnabled: boolean;
  torProxyIp: string;
  torProxyPort: number;
  i2pEnabled: boolean;
  i2pProxyIp: string;
  i2pProxyPort: number;
  
  // Advanced settings
  limitRate: boolean;
  limitRateUp: number;
  limitRateDown: number;
  disableRpcBan: boolean;  // Added this property
  maxConcurrency: number;
  
  // Flags
  pruningEnabled: boolean;
  offlineMode: boolean;
  disableIPv6: boolean;
  detach: boolean;
  syncMode: 'normal' | 'safe' | 'fast';
  
  // Extra args
  extraArgs: string;
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
}

export interface RpcCommandResult {
  success: boolean;
  result: any;
  error?: string;
}

export interface MoneroContextType {
  // Config management
  config: MoneroConfig;
  setConfig: (config: MoneroConfig) => void;
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
  checkPortStatus: (port: number, service: string) => Promise<void>;
  testRpcCommand: (command: string, params?: any) => Promise<RpcCommandResult>;
}
