
import React, { createContext, useContext, useState } from 'react';
import { MoneroConfig, MoneroContextType, ConnectionTestResult, RpcCommandResult } from '../types/monero';
import { useLogsManager } from './logs/useLogsManager';
import { useConfigManager } from './config/useConfigManager';
import { useMoneroManager } from './monero/useMoneroManager';
import { useTorProxyManager } from './proxy/useTorProxyManager';
import { useI2pProxyManager } from './proxy/useI2pProxyManager';
import { useConnectivityTesting } from './connectivity/useConnectivityTesting';
import { defaultConnectionTestResults } from './config/defaultConfigs';

export const MoneroContext = createContext<MoneroContextType | undefined>(undefined);

export const MoneroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('config');
  
  // Initialize all the managers
  const { 
    logs, 
    appendToConsoleLog, 
    appendToLogFile, 
    appendToTorProxyLog, 
    appendToI2pProxyLog, 
    refreshLogs 
  } = useLogsManager();
  
  const { 
    config, 
    setConfig, 
    showBinaryConfig, 
    setShowBinaryConfig, 
    saveConfig, 
    loadConfig, 
    testPaths 
  } = useConfigManager();
  
  const { 
    isRunning, 
    statusInfo, 
    isDownloading,
    startNode, 
    stopNode, 
    downloadLatestDaemon 
  } = useMoneroManager(config, appendToConsoleLog, appendToLogFile);
  
  const { 
    torProxyRunning, 
    startTorProxy, 
    stopTorProxy 
  } = useTorProxyManager(config, setConfig, appendToTorProxyLog);
  
  const { 
    i2pProxyRunning, 
    startI2PProxy, 
    stopI2PProxy 
  } = useI2pProxyManager(config, setConfig, appendToI2pProxyLog);
  
  const { 
    connectionTestResults, 
    testConnectivity,
    checkPort,
    testRpcCommand
  } = useConnectivityTesting(config, isRunning);

  // Create a wrapper function to match the expected type signature
  const handleDownloadLatestDaemon = () => {
    // Default to Linux if platform is not specified
    downloadLatestDaemon('linux');
  };

  // Create a compatible wrapper for checkPortStatus function
  const checkPortStatus = async (port: number, service: string) => {
    await checkPort(port, service);
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
        downloadLatestDaemon: handleDownloadLatestDaemon,
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
        checkPortStatus,
        refreshLogs,
        testRpcCommand
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
