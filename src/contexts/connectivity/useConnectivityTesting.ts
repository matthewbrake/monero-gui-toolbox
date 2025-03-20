
import { useState } from 'react';
import { MoneroConfig, ConnectionTestResult, RpcCommandResult } from '../../types/monero';
import { toast } from '@/hooks/use-toast';
import { defaultConnectionTestResults } from '../config/defaultConfigs';

export const useConnectivityTesting = (config: MoneroConfig, isRunning: boolean) => {
  const [connectionTestResults, setConnectionTestResults] = useState<ConnectionTestResult[]>(defaultConnectionTestResults);

  const testConnectivity = async () => {
    // Clear previous results
    setConnectionTestResults([]);
    
    // Check basic connection ports
    await checkPort(config.p2pBindPort, 'P2P Network');
    await checkPort(config.rpcBindPort, 'RPC Interface');
    
    if (config.torEnabled) {
      await checkPort(config.torProxyPort, 'Tor Proxy');
    }
    
    if (config.i2pEnabled) {
      await checkPort(config.i2pProxyPort, 'I2P Proxy');
    }
    
    // If daemon is running, check daemon RPC
    if (isRunning) {
      await testRpcCommand('status');
    }
    
    toast({
      title: 'Connectivity Test Complete',
      description: 'Check results for details',
    });
  };

  const checkPort = async (port: number, service: string): Promise<ConnectionTestResult> => {
    try {
      // In a real app, this would perform an actual port check
      // For this demo, we'll simulate results
      const result: ConnectionTestResult = {
        port: port,
        service: service,
        status: Math.random() > 0.3 ? 'open' : 'closed',
        message: '',
        timestamp: new Date().toISOString(),
        portStatus: Math.random() > 0.3 ? 'open' : 'closed'
      };
      
      if (result.status === 'open') {
        result.message = `Port ${port} is open and ${service} is accessible.`;
      } else {
        result.message = `Port ${port} is closed or ${service} is not responding.`;
      }
      
      setConnectionTestResults(prev => [...prev, result]);
      return result;
    } catch (error) {
      const errorResult: ConnectionTestResult = {
        port: port,
        service: service,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error checking port',
        timestamp: new Date().toISOString(),
        portStatus: 'error'
      };
      
      setConnectionTestResults(prev => [...prev, errorResult]);
      return errorResult;
    }
  };

  const testRpcCommand = async (command: string, params?: any): Promise<RpcCommandResult> => {
    try {
      // In a real app, this would make an actual RPC call
      // For demo, simulate responses
      
      let testPort = 0;
      if (command === 'tor') {
        testPort = config.torSocksPort || 9050;
      } else if (command === 'i2p') {
        testPort = config.i2pSamPort || 7656;
      } else {
        // Test monero RPC by default
        testPort = config.rpcBindPort;
      }
      
      const result: RpcCommandResult = {
        success: Math.random() > 0.2,
        result: { status: 'OK', height: 2345678 }
      };
      
      if (!result.success) {
        result.error = `Failed to execute command "${command}": Connection refused`;
      }
      
      // Also record this in the test results for UI display
      const testResult: ConnectionTestResult = {
        port: testPort,
        service: `RPC: ${command}`,
        status: result.success ? 'open' : 'closed',
        message: result.success ? 'Command executed successfully' : result.error || 'Unknown error',
        timestamp: new Date().toISOString(),
        portStatus: result.success ? 'open' : 'closed'
      };
      
      if (command === 'status') {
        testResult.daemonVersion = 'v0.18.2.0';
        testResult.rpcConnectivity = result.success;
      } else if (command === 'tor') {
        testResult.torConnectivity = result.success;
      } else if (command === 'i2p') {
        testResult.i2pConnectivity = result.success;
      }
      
      setConnectionTestResults(prev => [...prev, testResult]);
      
      return result;
    } catch (error) {
      const errorResult: RpcCommandResult = {
        success: false,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown error executing RPC command'
      };
      
      return errorResult;
    }
  };

  return {
    connectionTestResults,
    testConnectivity,
    checkPort,
    testRpcCommand
  };
};
