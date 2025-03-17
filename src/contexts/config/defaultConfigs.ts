
import { MoneroConfig, ConnectionTestResult, LogData, StatusInfo } from '../../types/monero';

export const defaultConfig: MoneroConfig = {
  // General/Basic settings
  moneroPath: './bin/monerod',
  dataDir: './blockchain',
  logLevel: 0,
  noConsoleLog: false,
  maxLogFileSize: '104850000',
  maxLogFiles: '50',
  
  // Checkpoints and security
  enforceCheckpoints: true,
  disableCheckpoints: false,
  banList: '',
  enableDnsBlocklist: true,
  
  // Blockchain settings
  pruning: false,
  pruningSize: '1000',
  syncPrunedBlocks: false,
  blockSyncSize: '10',
  fastBlockSync: true,
  checkUpdates: 'enabled',
  useBootstrapDaemon: false,
  bootstrapDaemonAddress: '',
  dbSyncMode: 'fast',
  
  // RPC settings
  rpcEnabled: true,
  rpcBindIp: '127.0.0.1',
  rpcBindPort: '18081',
  restrictRpc: true,
  rpcLogin: '',
  rpcSsl: false,
  rpcSslCert: '',
  rpcSslKey: '',
  confirmExternalBind: false,
  rpcPaymentAllowFreeLoopback: true,
  publicNode: false,
  
  // P2P settings
  p2pBindIp: '0.0.0.0',
  p2pBindPort: '18080',
  p2pExternalPort: '18080',
  hideMyPort: false,
  noIgd: false,
  offline: false,
  allowLocalIp: false,
  limitRate: '',
  limitRateUp: '2048',
  limitRateDown: '8192',
  outPeers: '12',
  inPeers: '-1',
  addPriorityNode: '',
  addExclusiveNode: '',
  seedNode: '',
  
  // Tor settings
  torEnabled: false,
  torPath: './tor/tor.exe',
  torrcPath: './tor/torrc',
  torDataPath: './tor/data',
  torLogPath: './tor/logs/tor.log',
  torSocksPort: '9050',
  txProxy: 'tor,127.0.0.1:9050,10',
  torOnly: false,
  anonymousInboundTor: '',
  torOnionAddress: '',
  padTransactions: false,
  
  // I2P settings
  i2pEnabled: false,
  i2pPath: './i2p/i2p.exe',
  i2pDataPath: './i2p/data',
  i2pConfigPath: './i2p/config/i2pd.conf',
  i2pTunnelsPath: './i2p/config/tunnels.conf',
  i2pLogPath: './i2p/logs/i2pd.log',
  i2pSamPort: '7656',
  i2pProxy: 'i2p,127.0.0.1:4447',
  anonymousInboundI2p: '',
  i2pOnly: false,
  i2pAddress: '',
  
  // ZMQ settings
  zmqEnabled: false,
  zmqBindIp: '127.0.0.1',
  zmqPubPort: '18082',
  noZmq: true,
  
  // Miscellaneous
  maxConcurrency: '4',
};

export const defaultConnectionTestResults: ConnectionTestResult = {
  torConnectivity: { 
    tested: false,
    additionalTests: {
      torProject: {
        success: false,
        output: ""
      }
    }
  },
  i2pConnectivity: { 
    tested: false,
    additionalTests: {
      i2pSite: {
        success: false,
        output: ""
      }
    }
  },
  rpcConnectivity: { tested: false },
  daemonVersion: { checked: false },
  portStatus: {
    tor: { checked: false },
    i2p: { checked: false },
    monero: { checked: false }
  }
};

export const defaultStatusInfo: StatusInfo = {
  blockHeight: 0,
  networkHashrate: '0 H/s',
  connections: 0,
  syncStatus: 0,
  version: 'v0.18.2.2',
};

export const defaultLogs: LogData = {
  console: [],
  logFile: [],
  torProxy: [],
  i2pProxy: []
};
