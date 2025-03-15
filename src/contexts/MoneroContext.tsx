
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface MoneroConfig {
  // Network settings
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
  
  // Tor & I2P settings
  torEnabled: boolean;
  torPath: string;
  torrcPath: string;
  torDataPath: string;
  torSocksPort: string;
  txProxy: string;
  torOnly: boolean;
  torOnionAddress: string;
  
  i2pEnabled: boolean;
  i2pPath: string;
  i2pDataPath: string;
  i2pSamPort: string;
  i2pAnonymousInbound: string;
  i2pOnly: boolean;
  i2pAddress: string;
  
  // Blockchain settings
  dataDir: string;
  pruning: boolean;
  pruningSize: string;
  blockSyncSize: string;
  fastBlockSync: boolean;
  checkUpdates: string;
  useBootstrapDaemon: boolean;
  bootstrapDaemonAddress: string;
  
  // ZMQ settings
  zmqEnabled: boolean;
  zmqBindIp: string;
  zmqPubPort: string;
  
  // Miscellaneous
  logLevel: number;
  noConsoleLog: boolean;
  maxConcurrency: string;
  dbSyncMode: string;
}

export interface LogData {
  console: string[];
  logFile: string[];
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
}

const defaultConfig: MoneroConfig = {
  // Network settings
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
  
  // P2P settings
  p2pBindIp: '0.0.0.0',
  p2pBindPort: '18080',
  p2pExternalPort: '18080',
  hideMyPort: false,
  noIgd: false,
  offline: false,
  allowLocalIp: false,
  limitRate: '',
  limitRateUp: '',
  limitRateDown: '',
  
  // Tor & I2P settings
  torEnabled: false,
  torPath: './tor/tor.exe',
  torrcPath: './tor/torrc',
  torDataPath: './tor/data',
  torSocksPort: '9050',
  txProxy: 'tor,127.0.0.1:9050,10',
  torOnly: false,
  torOnionAddress: '',
  
  i2pEnabled: false,
  i2pPath: './i2p/i2p.exe',
  i2pDataPath: './i2p/data',
  i2pSamPort: '7656',
  i2pAnonymousInbound: '',
  i2pOnly: false,
  i2pAddress: '',
  
  // Blockchain settings
  dataDir: './blockchain',
  pruning: false,
  pruningSize: '1000',
  blockSyncSize: '10',
  fastBlockSync: true,
  checkUpdates: 'enabled',
  useBootstrapDaemon: false,
  bootstrapDaemonAddress: '',
  
  // ZMQ settings
  zmqEnabled: false,
  zmqBindIp: '127.0.0.1',
  zmqPubPort: '18082',
  
  // Miscellaneous
  logLevel: 0,
  noConsoleLog: false,
  maxConcurrency: '4',
  dbSyncMode: 'fast',
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
};

export const MoneroContext = createContext<MoneroContextType | undefined>(undefined);

export const MoneroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<MoneroConfig>(defaultConfig);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogData>(defaultLogs);
  const [activeTab, setActiveTab] = useState('config');
  const [statusInfo, setStatusInfo] = useState(defaultStatus);

  // Simulating logs updating when daemon is running
  useEffect(() => {
    if (!isRunning) return;
    
    const logInterval = setInterval(() => {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      setLogs(prev => ({
        console: [...prev.console, `[${timestamp}] Monero daemon processing block ${statusInfo.blockHeight + Math.floor(Math.random() * 10)}`].slice(-100),
        logFile: [...prev.logFile, `[${timestamp}] [info] Syncing blockchain data...`].slice(-100),
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

  const startNode = () => {
    if (isRunning) return;
    
    try {
      // This would actually launch the monerod process
      // For now, we'll just simulate startup
      setIsRunning(true);
      setLogs({
        console: ['[INFO] Starting Monero daemon...', '[INFO] Using config file...'],
        logFile: ['[INFO] Monero daemon starting...', '[INFO] Loading blockchain...'],
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
