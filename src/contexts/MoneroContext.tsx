import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

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
  statusInfo: {
    blockHeight: number;
    networkHashrate: string;
    connections: number;
    syncStatus: number;
    version?: string;
  };
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
}

const defaultConfig: MoneroConfig = {
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

const defaultConnectionTestResults: ConnectionTestResult = {
  torConnectivity: { tested: false },
  i2pConnectivity: { tested: false },
  rpcConnectivity: { tested: false },
  daemonVersion: { checked: false },
  portStatus: {
    tor: { checked: false },
    i2p: { checked: false },
    monero: { checked: false }
  }
};

const defaultStatus = {
  blockHeight: 0,
  networkHashrate: '0 H/s',
  connections: 0,
  syncStatus: 0,
  version: 'v0.18.2.2',
};

const defaultLogs: LogData = {
  console: [],
  logFile: [],
  torProxy: [],
  i2pProxy: []
};

export const MoneroContext = createContext<MoneroContextType | undefined>(undefined);

export const MoneroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<MoneroConfig>(defaultConfig);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogData>(defaultLogs);
  const [activeTab, setActiveTab] = useState('config');
  const [statusInfo, setStatusInfo] = useState(defaultStatus);
  const [connectionTestResults, setConnectionTestResults] = useState<ConnectionTestResult>(defaultConnectionTestResults);
  const [isDownloading, setIsDownloading] = useState(false);
  const [torProxyRunning, setTorProxyRunning] = useState(false);
  const [i2pProxyRunning, setI2pProxyRunning] = useState(false);
  const [showBinaryConfig, setShowBinaryConfig] = useState(false);

  // Simulating logs updating when daemon is running
  useEffect(() => {
    if (!isRunning) return;
    
    const logInterval = setInterval(() => {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      setLogs(prev => ({
        console: [...prev.console, `[${timestamp}] Monero daemon processing block ${statusInfo.blockHeight + Math.floor(Math.random() * 10)}`].slice(-100),
        logFile: [...prev.logFile, `[${timestamp}] [info] Syncing blockchain data...`].slice(-100),
        torProxy: prev.torProxy,
        i2pProxy: prev.i2pProxy,
      }));
      
      // Update status info periodically
      setStatusInfo(prev => ({
        ...prev,
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 10),
        connections: Math.floor(Math.random() * 20),
        syncStatus: Math.min(prev.syncStatus + Math.random() * 5, 100),
      }));
    }, 3000);
    
    return () => clearInterval(logInterval);
  }, [isRunning, statusInfo.blockHeight]);

  // Generate onion address and I2P address when starting
  useEffect(() => {
    if (isRunning) {
      if (config.torEnabled && !config.torOnionAddress) {
        // Simulate generating/reading Tor onion address
        setTimeout(() => {
          setConfig(prev => ({
            ...prev,
            torOnionAddress: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}.onion`
          }));
        }, 5000);
      }
      
      if (config.i2pEnabled && !config.i2pAddress) {
        // Simulate generating/reading I2P address
        setTimeout(() => {
          setConfig(prev => ({
            ...prev,
            i2pAddress: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}.b32.i2p`
          }));
        }, 7000);
      }
    }
  }, [isRunning, config.torEnabled, config.i2pEnabled]);

  // Simulate Tor proxy logs when running
  useEffect(() => {
    if (!torProxyRunning) return;
    
    const torLogInterval = setInterval(() => {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      setLogs(prev => ({
        ...prev,
        console: prev.console,
        logFile: prev.logFile,
        torProxy: [...prev.torProxy, `[${timestamp}] [info] Bootstrapping Tor network: ${Math.min(100, prev.torProxy.length)}%`].slice(-100),
        i2pProxy: prev.i2pProxy,
      }));
      
      // Generate onion address after some time
      if (logs.torProxy.length > 15 && !config.torOnionAddress) {
        setConfig(prev => ({
          ...prev,
          torOnionAddress: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}.onion`
        }));
        
        setLogs(prev => ({
          ...prev,
          console: prev.console,
          logFile: prev.logFile,
          torProxy: [...prev.torProxy, `[${timestamp}] [notice] Onion address generated: ${config.torOnionAddress}`].slice(-100),
          i2pProxy: prev.i2pProxy,
        }));
      }
    }, 1500);
    
    return () => clearInterval(torLogInterval);
  }, [torProxyRunning, logs.torProxy.length, config.torOnionAddress]);

  // Simulate I2P proxy logs when running
  useEffect(() => {
    if (!i2pProxyRunning) return;
    
    const i2pLogInterval = setInterval(() => {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      setLogs(prev => ({
        ...prev,
        console: prev.console,
        logFile: prev.logFile,
        torProxy: prev.torProxy,
        i2pProxy: [...prev.i2pProxy, `[${timestamp}] * Starting I2P router: initialization ${Math.min(100, prev.i2pProxy.length)}%`].slice(-100),
      }));
      
      // Generate I2P address after some time
      if (logs.i2pProxy.length > 15 && !config.i2pAddress) {
        setConfig(prev => ({
          ...prev,
          i2pAddress: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}.b32.i2p`
        }));
        
        setLogs(prev => ({
          ...prev,
          console: prev.console,
          logFile: prev.logFile,
          torProxy: prev.torProxy,
          i2pProxy: [...prev.i2pProxy, `[${timestamp}] * I2P address generated: ${config.i2pAddress}`].slice(-100),
        }));
      }
    }, 1500);
    
    return () => clearInterval(i2pLogInterval);
  }, [i2pProxyRunning, logs.i2pProxy.length, config.i2pAddress]);

  // Test if binary paths exist and are executable
  const testPaths = async () => {
    try {
      // In a real app, this would check if files exist and are executable
      // For this demo, we'll just simulate a check
      
      const pathsToCheck = [
        { name: 'Monero daemon', path: config.moneroPath },
        { name: 'Tor executable', path: config.torPath, enabled: config.torEnabled },
        { name: 'I2P executable', path: config.i2pPath, enabled: config.i2pEnabled }
      ];
      
      let allValid = true;
      let invalidPaths: string[] = [];
      
      // Simulate path checking
      pathsToCheck.forEach(item => {
        if (item.enabled === false) return; // Skip if not enabled
        
        const exists = item.path && item.path.length > 0;
        const isExecutable = item.path.endsWith('.exe') || !item.path.includes('.');
        
        if (!exists || !isExecutable) {
          allValid = false;
          invalidPaths.push(item.name);
        }
      });
      
      if (allValid) {
        toast({
          title: "Path Validation Successful",
          description: "All binary paths are valid.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Paths Detected",
          description: `The following paths may be invalid: ${invalidPaths.join(', ')}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Path Validation Error",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const checkPortStatus = async (type: 'tor' | 'i2p' | 'monero'): Promise<void> => {
    try {
      // In a real app, this would use port scanning techniques
      // For this demo, we'll simulate port checking
      
      let port = '';
      switch (type) {
        case 'tor':
          port = config.torSocksPort;
          break;
        case 'i2p':
          port = config.i2pSamPort;
          break;
        case 'monero':
          port = config.rpcBindPort;
          break;
      }
      
      // Simulate port checking (in a real app, this would use something like netstat)
      const portOpen = Math.random() > 0.2; // 80% chance port is open for demo
      
      setConnectionTestResults(prev => ({
        ...prev,
        portStatus: {
          ...prev.portStatus,
          [type]: { 
            checked: true, 
            open: portOpen,
            port
          }
        }
      }));
    } catch (error) {
      console.error(`Error checking ${type} port:`, error);
    }
  };

  const startNode = () => {
    if (isRunning) return;
    
    try {
      // This would actually launch the monerod process
      // For now, we'll just simulate startup
      setIsRunning(true);
      setLogs({
        console: ['[INFO] Starting Monero daemon...', `[INFO] Using binary: ${config.moneroPath}`, '[INFO] Using config file...'],
        logFile: ['[INFO] Monero daemon starting...', '[INFO] Loading blockchain...'],
        torProxy: [],
        i2pProxy: [],
      });
      setStatusInfo({
        ...defaultStatus,
        blockHeight: 2800000 + Math.floor(Math.random() * 10000),
      });
      toast({
        title: "Monero Daemon Started",
        description: "The daemon is now running.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Starting Daemon",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const stopNode = () => {
    if (!isRunning) return;
    
    // This would actually stop the monerod process
    setIsRunning(false);
    setLogs(prev => ({
      console: [...prev.console, '[INFO] Stopping Monero daemon...', '[INFO] Daemon stopped successfully.'],
      logFile: [...prev.logFile, '[INFO] Shutting down...', '[INFO] Database saved.'],
      torProxy: prev.torProxy,
      i2pProxy: prev.i2pProxy,
    }));
    
    toast({
      title: "Monero Daemon Stopped",
      description: "The daemon has been stopped successfully.",
    });
  };

  const saveConfig = () => {
    // This would actually save to a file
    // For demo purposes, we'll store it in localStorage
    localStorage.setItem('monero-config', JSON.stringify(config));
    
    toast({
      title: "Configuration Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const loadConfig = (configPath?: string) => {
    try {
      // In a real app, this would load from a file
      // For demo, we'll load from localStorage
      const savedConfig = localStorage.getItem('monero-config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
        toast({
          title: "Configuration Loaded",
          description: "Settings loaded successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Load Failed",
          description: "No saved configuration found.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Loading Configuration",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const testConnectivity = async () => {
    // Reset all test results
    setConnectionTestResults({
      torConnectivity: { tested: false },
      i2pConnectivity: { tested: false },
      rpcConnectivity: { tested: false },
      daemonVersion: { checked: false },
      portStatus: {
        tor: { checked: false },
        i2p: { checked: false },
        monero: { checked: false }
      }
    });
    
    // Only test if daemon is running
    if (!isRunning) {
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: "Daemon must be running to test connectivity.",
      });
      return;
    }

    toast({
      title: "Testing Connections",
      description: "Running connectivity tests...",
    });
    
    // Check port status
    await checkPortStatus('monero');
    if (config.torEnabled) await checkPortStatus('tor');
    if (config.i2pEnabled) await checkPortStatus('i2p');
    
    // Test RPC if enabled
    if (config.rpcEnabled) {
      try {
        const { testRpcConnectivity } = await import('@/utils/moneroUtils');
        const rpcUrl = `http://${config.rpcBindIp}:${config.rpcBindPort}/json_rpc`;
        const result = await testRpcConnectivity(rpcUrl);
        setConnectionTestResults(prev => ({
          ...prev,
          rpcConnectivity: { 
            tested: true, 
            success: result.success, 
            output: result.output 
          }
        }));
      } catch (error) {
        setConnectionTestResults(prev => ({
          ...prev,
          rpcConnectivity: { 
            tested: true, 
            success: false, 
            output: error instanceof Error ? error.message : "Unknown error" 
          }
        }));
      }
    }

    // Test Tor if enabled
    if (config.torEnabled) {
      try {
        const { testTorConnectivity } = await import('@/utils/moneroUtils');
        const result = await testTorConnectivity();
        setConnectionTestResults(prev => ({
          ...prev,
          torConnectivity: { 
            tested: true, 
            success: result.success, 
            output: result.output 
          }
        }));
      } catch (error) {
        setConnectionTestResults(prev => ({
          ...prev,
          torConnectivity: { 
            tested: true, 
            success: false, 
            output: error instanceof Error ? error.message : "Unknown error" 
          }
        }));
      }
    }

    // Test I2P if enabled
    if (config.i2pEnabled) {
      try {
        const { testI2PConnectivity } = await import('@/utils/moneroUtils');
        const result = await testI2PConnectivity();
        setConnectionTestResults(prev => ({
          ...prev,
          i2pConnectivity: { 
            tested: true, 
            success: result.success, 
            output: result.output 
          }
        }));
      } catch (error) {
        setConnectionTestResults(prev => ({
          ...prev,
          i2pConnectivity: { 
            tested: true, 
            success: false, 
            output: error instanceof Error ? error.message : "Unknown error" 
          }
        }));
      }
    }

    // Check daemon version
    try {
      const { checkDaemonVersion } = await import('@/utils/moneroUtils');
      const result = await checkDaemonVersion();
      setConnectionTestResults(prev => ({
        ...prev,
        daemonVersion: { 
          checked: true, 
          current: result.current, 
          latest: result.latest, 
          needsUpdate: result.needsUpdate 
        }
      }));
    } catch (error) {
      setConnectionTestResults(prev => ({
        ...prev,
        daemonVersion: { 
          checked: true, 
          current: "Unknown", 
          latest: "Unknown", 
          needsUpdate: false 
        }
      }));
    }

    toast({
      title: "Tests Completed",
      description: "Connectivity tests have completed.",
    });
  };

  const downloadLatestDaemon = async (platform: 'windows' | 'linux') => {
    setIsDownloading(true);
    try {
      const { downloadLatestDaemon } = await import('@/utils/moneroUtils');
      const result = await downloadLatestDaemon(platform);
      
      if (result.success) {
        toast({
          title: "Download Complete",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Download Failed",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const startTorProxy = () => {
    if (torProxyRunning) return;
    
    try {
      // This would actually launch the Tor process using the command:
      // config.torPath --config config.torrcPath --DataDirectory config.torDataPath --Log "notice file config.torLogPath"
      
      // For now, we'll just simulate startup
      setTorProxyRunning(true);
      setLogs(prev => ({
        ...prev,
        console: prev.console,
        logFile: prev.logFile,
        torProxy: [
          '[INFO] Starting Tor...',
          `[INFO] Command: ${config.torPath} --config ${config.torrcPath} --DataDirectory ${config.torDataPath} --Log "notice file ${config.torLogPath}"`,
          '[INFO] Using configuration file...',
          '[INFO] Bootstrapping Tor network...'
        ],
        i2pProxy: prev.i2pProxy,
      }));
      
      toast({
        title: "Tor Started",
        description: "Tor proxy is now running.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Starting Tor",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const stopTorProxy = () => {
    if (!torProxyRunning) return;
    
    // This would actually stop the Tor process
    setTorProxyRunning(false);
    setLogs(prev => ({
      ...prev,
      console: prev.console,
      logFile: prev.logFile,
      torProxy: [...prev.torProxy, '[INFO] Stopping Tor...', '[INFO] Tor stopped successfully.'],
      i2pProxy: prev.i2pProxy,
    }));
    
    toast({
      title: "Tor Stopped",
      description: "Tor proxy has been stopped successfully.",
    });
  };

  const startI2PProxy = () => {
    if (i2pProxyRunning) return;
    
    try {
      // This would actually launch the I2P process using the command:
      // config.i2pPath --datadir=config.i2pDataPath --conf=config.i2pConfigPath --tunconf=config.i2pTunnelsPath --log=config.i2pLogPath
      
      // For now, we'll just simulate startup
      setI2pProxyRunning(true);
      setLogs(prev => ({
        ...prev,
        console: prev.console,
        logFile: prev.logFile,
        torProxy: prev.torProxy,
        i2pProxy: [
          '[INFO] Starting I2P router...',
          `[INFO] Command: ${config.i2pPath} --datadir=${config.i2pDataPath} --conf=${config.i2pConfigPath} --tunconf=${config.i2pTunnelsPath} --log=${config.i2pLogPath}`,
          '[INFO] Using configuration file...',
          '[INFO] Initializing I2P network...'
        ],
      }));
      
      toast({
        title: "I2P Started",
        description: "I2P router is now running.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Starting I2P",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const stopI2PProxy = () => {
    if (!i2pProxyRunning) return;
    
    // This would actually stop the I2P process
    setI2pProxyRunning(false);
    setLogs(prev => ({
      ...prev,
      console: prev.console,
      logFile: prev.logFile,
      torProxy: prev.torProxy,
      i2pProxy: [...prev.i2pProxy, '[INFO] Stopping I2P router...', '[INFO] I2P router stopped successfully.'],
    }));
    
    toast({
      title: "I2P Stopped",
      description: "I2P router has been stopped successfully.",
    });
  };

  return (
    <MoneroContext.Provider
      value={{
        config,
        setConfig,
        isRunning,
        startNode,
        stopNode,
        logs,
        activeTab,
        setActiveTab,
        saveConfig,
        loadConfig,
        statusInfo,
        testConnectivity,
        connectionTestResults,
        downloadLatestDaemon,
        isDownloading,
        torProxyRunning,
        i2pProxyRunning,
        startTorProxy,
        stopTorProxy,
        startI2PProxy,
        stopI2PProxy,
        showBinaryConfig,
        setShowBinaryConfig,
        testPaths,
        checkPortStatus
      }}
    >
      {children}
    </MoneroContext.Provider>
  );
};

export const useMonero = (): MoneroContextType => {
  const context = useContext(MoneroContext);
  if (!context) {
    throw new Error('useMonero must be used within a MoneroProvider');
  }
  return context;
};
