
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { MoneroConfig, ConnectionTestResult } from '../../types/monero';
import { defaultConnectionTestResults } from '../config/defaultConfigs';

export const useConnectivityTesting = (config: MoneroConfig, isRunning: boolean) => {
  const [connectionTestResults, setConnectionTestResults] = useState<ConnectionTestResult>(defaultConnectionTestResults);

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
        const { testRpcConnectivity } = await import('../../utils/moneroUtils');
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
        const { testTorConnectivity } = await import('../../utils/moneroUtils');
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
        const { testI2PConnectivity } = await import('../../utils/moneroUtils');
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
      const { checkDaemonVersion } = await import('../../utils/moneroUtils');
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

  return {
    connectionTestResults,
    checkPortStatus,
    testConnectivity
  };
};
