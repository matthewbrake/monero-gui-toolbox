
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { MoneroConfig, StatusInfo } from '../../types/monero';
import { defaultStatusInfo } from '../config/defaultConfigs';

export const useMoneroManager = (
  config: MoneroConfig, 
  appendToConsoleLog: (logs: string[]) => void, 
  appendToLogFile: (logs: string[]) => void
) => {
  const [isRunning, setIsRunning] = useState(false);
  const [statusInfo, setStatusInfo] = useState<StatusInfo>(defaultStatusInfo);
  const [isDownloading, setIsDownloading] = useState(false);

  // Simulate status updates when daemon is running
  useEffect(() => {
    if (!isRunning) return;
    
    const logInterval = setInterval(() => {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      
      appendToConsoleLog([`[${timestamp}] Monero daemon processing block ${statusInfo.blockHeight + Math.floor(Math.random() * 10)}`]);
      appendToLogFile([`[${timestamp}] [info] Syncing blockchain data...`]);
      
      // Update status info periodically
      setStatusInfo(prev => ({
        ...prev,
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 10),
        connections: Math.floor(Math.random() * 20),
        syncStatus: Math.min(prev.syncStatus + Math.random() * 5, 100),
      }));
    }, 3000);
    
    return () => clearInterval(logInterval);
  }, [isRunning, statusInfo.blockHeight, appendToConsoleLog, appendToLogFile]);

  const startNode = () => {
    if (isRunning) return;
    
    try {
      // This would actually launch the monerod process
      // For now, we'll just simulate startup
      setIsRunning(true);
      
      appendToConsoleLog([
        '[INFO] Starting Monero daemon...', 
        `[INFO] Using binary: ${config.moneroPath}`, 
        '[INFO] Using config file...'
      ]);
      
      appendToLogFile([
        '[INFO] Monero daemon starting...', 
        '[INFO] Loading blockchain...'
      ]);
      
      setStatusInfo({
        ...defaultStatusInfo,
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
    
    appendToConsoleLog([
      '[INFO] Stopping Monero daemon...', 
      '[INFO] Daemon stopped successfully.'
    ]);
    
    appendToLogFile([
      '[INFO] Shutting down...', 
      '[INFO] Database saved.'
    ]);
    
    toast({
      title: "Monero Daemon Stopped",
      description: "The daemon has been stopped successfully.",
    });
  };

  const downloadLatestDaemon = async (platform: 'windows' | 'linux'): Promise<void> => {
    setIsDownloading(true);
    try {
      const { downloadLatestDaemon } = await import('../../utils/moneroUtils');
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

  return {
    isRunning,
    statusInfo,
    isDownloading,
    startNode,
    stopNode,
    downloadLatestDaemon
  };
};
