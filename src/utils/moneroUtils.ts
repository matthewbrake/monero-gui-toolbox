
// We need to handle both environments - web and electron
let app, dialog, fs, path;
try {
  const remote = require('@electron/remote');
  app = remote.app;
  dialog = remote.dialog;
  fs = require('fs');
  path = require('path');
} catch (error) {
  console.log('Not running in Electron environment');
  app = null;
  dialog = null;
  fs = null;
  path = null;
}

/**
 * Generates the command line arguments for monerod based on the provided configuration.
 * @param config - The Monero daemon configuration object.
 * @returns A string representing the command line arguments.
 */
export const generateCommandLine = (config: any): string => {
  let command = './monerod';
  const args: string[] = [];

  // Helper function to add arguments based on config values
  const addArg = (arg: string, value: any, condition: boolean = true) => {
    if (condition) {
      if (typeof value === 'boolean') {
        args.push(arg);
      } else if (typeof value === 'string' && value.trim() !== '') {
        args.push(`${arg}=${value}`);
      } else if (typeof value === 'number') {
        args.push(`${arg}=${value}`);
      }
    }
  };

  // General/Basic settings
  addArg('--data-dir', config.dataDir);
  addArg('--log-level', config.logLevel);
  addArg('--no-console', config.noConsoleLog);
  addArg('--max-log-file-size', config.maxLogFileSize);
  addArg('--max-log-files', config.maxLogFiles);

  // Checkpoints and security
  addArg('--enforce-dns-checkpoints', config.enforceCheckpoints);
  addArg('--disable-dns-checkpoints', config.disableCheckpoints);
  addArg('--ban-list', config.banList);
  addArg('--enable-dns-blocklist', config.enableDnsBlocklist);

  // Blockchain settings
  addArg('--prune-blockchain', config.pruning);
  addArg('--pruning-keep-blocks', config.pruningSize, config.pruning);
  addArg('--sync-pruned-blocks', config.syncPrunedBlocks, config.pruning);
  addArg('--block-sync-size', config.blockSyncSize);
  addArg('--fast-block-sync', config.fastBlockSync);
  addArg('--check-updates', config.checkUpdates !== 'disabled');
  addArg('--db-sync-mode', config.dbSyncMode);
  addArg('--bootstrap-daemon-address', config.bootstrapDaemonAddress, config.useBootstrapDaemon);

  // RPC settings
  addArg('--rpc-bind-ip', config.rpcBindIp, config.rpcEnabled);
  addArg('--rpc-bind-port', config.rpcBindPort, config.rpcEnabled);
  addArg('--rpc-restricted-bind', config.restrictRpc, config.rpcEnabled);
  addArg('--rpc-login', config.rpcLogin, config.rpcLogin && config.rpcEnabled);
  addArg('--rpc-ssl', config.rpcSsl, config.rpcEnabled);
  addArg('--rpc-ssl-cert', config.rpcSslCert, config.rpcSsl && config.rpcEnabled);
  addArg('--rpc-ssl-key', config.rpcSslKey, config.rpcSsl && config.rpcEnabled);
  addArg('--confirm-external-bind', config.confirmExternalBind, config.rpcEnabled);
  addArg('--rpc-payment-allow-free-loopback', config.rpcPaymentAllowFreeLoopback, config.rpcEnabled);
  addArg('--public-node', config.publicNode, config.rpcEnabled);

  // P2P settings
  addArg('--p2p-bind-ip', config.p2pBindIp);
  addArg('--p2p-bind-port', config.p2pBindPort);
  addArg('--p2p-external-port', config.p2pExternalPort);
  addArg('--hide-my-port', config.hideMyPort);
  addArg('--no-igd', config.noIgd);
  addArg('--offline', config.offline);
  addArg('--allow-local-ip', config.allowLocalIp);
  addArg('--limit-rate', config.limitRate);
  addArg('--limit-rate-up', config.limitRateUp);
  addArg('--limit-rate-down', config.limitRateDown);
  addArg('--out-peers', config.outPeers);
  addArg('--in-peers', config.inPeers);
  addArg('--add-priority-node', config.addPriorityNode);
  addArg('--add-exclusive-node', config.addExclusiveNode);
  addArg('--seed-node', config.seedNode);

  // Tor settings
  addArg('--tx-proxy', config.txProxy, config.torEnabled);
  addArg('--socks-proxy', `127.0.0.1:${config.torSocksPort}`, config.torEnabled);
  addArg('--tor-only', config.torOnly, config.torEnabled);
  addArg('--anonymous-inbound', config.anonymousInboundTor, config.torEnabled && config.anonymousInboundTor);
  addArg('--pad-transactions', config.padTransactions, config.torEnabled);

  // I2P settings
  addArg('--i2p-proxy', config.i2pProxy, config.i2pEnabled);
  addArg('--i2p-sam-port', config.i2pSamPort, config.i2pEnabled);
  addArg('--anonymous-inbound', config.anonymousInboundI2p, config.i2pEnabled && config.anonymousInboundI2p);
  addArg('--i2p-only', config.i2pOnly, config.i2pEnabled);

  // ZMQ settings
  addArg('--zmq-bind-ip', config.zmqBindIp, config.zmqEnabled);
  addArg('--zmq-pub', `tcp://127.0.0.1:${config.zmqPubPort}`, config.zmqEnabled);
  addArg('--no-zmq', config.noZmq, config.zmqEnabled);

  // Miscellaneous
  addArg('--max-concurrency', config.maxConcurrency);

  return `${command} ${args.join(' ')}`;
};

/**
 * Opens a file dialog to select a file path.
 * @returns A promise that resolves with the selected file path, or undefined if no file was selected.
 */
export const getFilePath = async (): Promise<string | undefined> => {
  try {
    if (!dialog) {
      console.warn('File dialog is not available in this environment');
      return undefined;
    }
    
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory'],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
  } catch (error) {
    console.error('Failed to open file dialog:', error);
  }
  return undefined;
};

/**
 * Create default directory structure for Monero, Tor, and I2P
 * This function only works in Electron environment
 * @param baseDir - Base directory where all subdirectories will be created
 */
export const createDirectoryStructure = async (baseDir: string = './'): Promise<{ success: boolean, message: string }> => {
  try {
    // For browser environment, we'll just simulate success
    if (!fs || !path) {
      console.log('Directory structure creation is only available in Electron environment');
      
      // Return a descriptive message about the expected directory structure
      return {
        success: true,
        message: `Directory structure would be created in Electron:
        
Monero:
  ./monero/
    bin/
      win/     - Windows binaries (monerod.exe, monero-wallet-rpc.exe)
      linux/   - Linux binaries (monerod, monero-wallet-rpc)
    blockchain/ - Blockchain data files
    configs/    - Configuration files
    logs/       - Log files

Tor:
  ./tor/
    bin/
      win/     - Windows Tor binaries (tor.exe)
      linux/   - Linux Tor binaries (tor)
    data/      - Tor data directory
    hidden_service/ - Onion services directory
    config/    - Contains torrc configuration
    logs/      - Log files

I2P:
  ./i2p/
    bin/
      win/     - Windows I2P binaries (i2pd.exe)
      linux/   - Linux I2P binaries (i2pd)
    data/      - I2P data directory
    config/    - Contains i2pd.conf and tunnels.conf
    logs/      - Log files
`
      };
    }

    // Define directory structures
    const directories = {
      // Monero directories
      monero: {
        bin: {
          win: {},
          linux: {}
        },
        blockchain: {},
        configs: {},
        logs: {}
      },
      // Tor directories
      tor: {
        bin: {
          win: {},
          linux: {}
        },
        data: {},
        hidden_service: {},
        config: {},
        logs: {}
      },
      // I2P directories
      i2p: {
        bin: {
          win: {},
          linux: {}
        },
        data: {},
        config: {},
        logs: {}
      }
    };

    // Function to recursively create directories
    const createDirs = (structure: any, currentPath: string) => {
      for (const [dir, subDirs] of Object.entries(structure)) {
        const newPath = path.join(currentPath, dir);
        
        if (!fs.existsSync(newPath)) {
          fs.mkdirSync(newPath, { recursive: true });
        }
        
        if (Object.keys(subDirs as object).length > 0) {
          createDirs(subDirs, newPath);
        }
      }
    };

    // Create all directories
    createDirs(directories, baseDir);

    // Create default config files
    const torrcContent = `# Tor configuration
SocksPort 9050
ControlPort 9051
Log notice file ./logs/monero-log.log
DataDirectory ./data
HiddenServiceDir ./hidden_service
HiddenServicePort 18081 127.0.0.1:18081
`;

    const i2pdConfContent = `# I2P configuration
log = file
logfile = ./logs/monero-i2pd.log
datadir = ./data
`;

    const tunnelsConfContent = `# I2P tunnels configuration
[monero-rpc]
type = http
host = 127.0.0.1
port = 18081
keys = monero-rpc.dat
inbound.length = 3
outbound.length = 3
inbound.quantity = 5
outbound.quantity = 5
`;

    fs.writeFileSync(path.join(baseDir, 'tor', 'config', 'torrc'), torrcContent);
    fs.writeFileSync(path.join(baseDir, 'i2p', 'config', 'i2pd.conf'), i2pdConfContent);
    fs.writeFileSync(path.join(baseDir, 'i2p', 'config', 'tunnels.conf'), tunnelsConfContent);

    return {
      success: true,
      message: 'Directory structure created successfully'
    };
  } catch (error) {
    console.error('Failed to create directory structure:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error creating directories'
    };
  }
};

/**
 * Checks for updates by comparing the current version with the latest available version.
 * @returns A promise that resolves with an object containing the current version, latest version, and a flag indicating if an update is needed.
 */
export const checkDaemonVersion = async (): Promise<{ current: string, latest: string, needsUpdate: boolean }> => {
  // Placeholder function - replace with actual update check logic
  return {
    current: 'v0.18.2.2',
    latest: 'v0.18.3.0',
    needsUpdate: true,
  };
};

/**
 * Downloads the latest Monero daemon for the specified platform.
 * @param platform - The target platform ('windows' or 'linux').
 * @returns A promise that resolves with a success flag and a message.
 */
export const downloadLatestDaemon = async (platform: 'windows' | 'linux'): Promise<{ success: boolean, message: string }> => {
  // Placeholder function - replace with actual download logic
  return {
    success: true,
    message: `Daemon downloaded successfully for ${platform}.`
  };
};

/**
 * Tests the Tor connectivity by attempting to connect to a known Tor exit node.
 * @returns A promise that resolves with an object containing the success status and output message.
 */
export const testTorConnectivity = async (): Promise<{ success: boolean, output: string }> => {
  // Placeholder function - replace with actual Tor connectivity test logic
  return {
    success: true,
    output: 'Tor connection test successful: Your Tor connection is working properly.\nCommand: torsocks wget -qO - https://check.torproject.org/ | grep -m 1 Congratulations\nOutput: Congratulations. This browser is configured to use Tor.'
  };
};

/**
 * Tests the I2P connectivity by attempting to connect to a known I2P service.
 * @returns A promise that resolves with an object containing the success status and output message.
 */
export const testI2PConnectivity = async (): Promise<{ success: boolean, output: string }> => {
  // Placeholder function - replace with actual I2P connectivity test logic
  return {
    success: true,
    output: 'I2P connection test successful: Successfully connected to I2P network.\nCommand: curl --socks5-hostname 127.0.0.1:4447 http://acetone.i2p\nOutput: 200 OK - I2P service is reachable.'
  };
};

/**
 * Tests the RPC connectivity by sending a simple RPC command to the daemon.
 * @param rpcUrl - The URL of the RPC endpoint.
 * @returns A promise that resolves with an object containing the success status and output message.
 */
export const testRpcConnectivity = async (rpcUrl: string): Promise<{ success: boolean, output: string }> => {
  // Placeholder function - replace with actual RPC connectivity test logic
  return {
    success: true,
    output: `RPC connection test successful.\nCommand: curl -X POST ${rpcUrl} -d '{"jsonrpc":"2.0","id":"0","method":"get_info"}' -H 'Content-Type: application/json'\nOutput: {"id":"0","jsonrpc":"2.0","result":{"height":2871261,"target_height":2871261,"difficulty":331931008595,"target":120,"tx_count":28581213,"tx_pool_size":29,"alt_blocks_count":10,"outgoing_connections_count":12,"incoming_connections_count":0,"white_peerlist_size":1000,"grey_peerlist_size":5000,"mainnet":true,"testnet":false,"stagenet":false,"top_block_hash":"f39366c7bf9c5fa2f3ef1103b7ba3f4dc1a499ed4d5f76db4a0818d6f31f1a7c","cumulative_difficulty":108975768033512,"block_size_limit":600000,"block_weight_limit":600000,"block_size_median":300000,"block_weight_median":300000,"start_time":1613245773,"free_space":186351050752,"offline":false,"untrusted":false,"bootstrap_daemon_address":"","height_without_bootstrap":2871261,"was_bootstrap_ever_used":false,"database_size":142006001664,"update_available":false,"version":"v0.18.2.2-6c7d0ab87"}}`
  };
};

/**
 * Restart the Monero daemon
 */
export const restartMoneroDaemon = async (): Promise<{ success: boolean, message: string }> => {
  try {
    // This would execute the daemon restart command
    // monerod stop_daemon; sleep 10; monerod --detach
    
    // For demo purposes, we'll just return success
    return {
      success: true,
      message: "Monero daemon restarted successfully."
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error restarting daemon"
    };
  }
};

/**
 * Test RPC command execution through a proxy
 */
export const testRpcCommand = async (
  proxyType: 'tor' | 'i2p',
  proxyAddress: string,
  rpcAddress: string,
  rpcLogin?: string
): Promise<{ success: boolean, output: string }> => {
  try {
    // Create a simulated command based on the proxy type
    const socksPort = proxyType === 'tor' ? '9050' : '4447';
    const command = `curl --socks5-hostname 127.0.0.1:${socksPort} ${rpcLogin ? `-u ${rpcLogin} --digest` : ''} -X POST ${rpcAddress}/json_rpc -d '{"jsonrpc":"2.0","id":"0","method":"get_info"}' -H 'Content-Type: application/json'`;
    
    console.log(`Executing test command: ${command}`);
    
    // In a real implementation, this would execute a curl command through the proxy
    // For demo, we'll simulate success
    if (proxyType === 'tor') {
      return {
        success: true,
        output: `Command: ${command}\n{"id":"0","jsonrpc":"2.0","result":{"height":2871261,"target_height":2871261,"difficulty":331931008595,"target":120,"tx_count":28581213,"tx_pool_size":29,"alt_blocks_count":10,"outgoing_connections_count":12,"incoming_connections_count":0,"white_peerlist_size":1000,"grey_peerlist_size":5000,"mainnet":true,"testnet":false,"stagenet":false,"top_block_hash":"f39366c7bf9c5fa2f3ef1103b7ba3f4dc1a499ed4d5f76db4a0818d6f31f1a7c","cumulative_difficulty":108975768033512,"block_size_limit":600000,"block_weight_limit":600000,"block_size_median":300000,"block_weight_median":300000,"start_time":1613245773,"free_space":186351050752,"offline":false,"untrusted":false,"bootstrap_daemon_address":"","height_without_bootstrap":2871261,"was_bootstrap_ever_used":false,"database_size":142006001664,"update_available":false,"version":"v0.18.2.2-6c7d0ab87"}}`
      };
    } else {
      return {
        success: true,
        output: `Command: ${command}\n{"id":"0","jsonrpc":"2.0","result":{"height":2871261,"target_height":2871261,"difficulty":331931008595,"target":120,"tx_count":28581213,"tx_pool_size":29,"alt_blocks_count":10,"outgoing_connections_count":12,"incoming_connections_count":0,"white_peerlist_size":1000,"grey_peerlist_size":5000,"mainnet":true,"testnet":false,"stagenet":false,"top_block_hash":"f39366c7bf9c5fa2f3ef1103b7ba3f4dc1a499ed4d5f76db4a0818d6f31f1a7c","cumulative_difficulty":108975768033512,"block_size_limit":600000,"block_weight_limit":600000,"block_size_median":300000,"block_weight_median":300000,"start_time":1613245773,"free_space":186351050752,"offline":false,"untrusted":false,"bootstrap_daemon_address":"","height_without_bootstrap":2871261,"was_bootstrap_ever_used":false,"database_size":142006001664,"update_available":false,"version":"v0.18.2.2-6c7d0ab87"}}`
      };
    }
  } catch (error) {
    return {
      success: false,
      output: error instanceof Error ? error.message : "Unknown error executing RPC command"
    };
  }
};

/**
 * Test port status using netstat or similar tools
 * @param port - The port number to check
 * @param protocol - The protocol (tcp/udp)
 * @returns A promise that resolves to true if the port is open, false otherwise
 */
export const checkPortOpen = async (port: string, protocol: 'tcp' | 'udp' = 'tcp'): Promise<boolean> => {
  try {
    // In a real app, this would use a command like:
    // netstat -tuln | grep ${port}
    
    // For demo purposes, we'll simulate success 80% of the time
    const portOpen = Math.random() > 0.2;
    console.log(`Checking port ${port} (${protocol}): ${portOpen ? 'OPEN' : 'CLOSED'}`);
    return portOpen;
  } catch (error) {
    console.error(`Error checking port ${port}:`, error);
    return false;
  }
};

/**
 * Generate a command to test RPC over clearnet, Tor, or I2P
 * @param type - The network type (clearnet, tor, i2p)
 * @param config - The Monero configuration object
 * @returns The command string to execute
 */
export const generateRpcTestCommand = (type: 'clearnet' | 'tor' | 'i2p', config: any): string => {
  const rpcLogin = config.rpcLogin ? `-u ${config.rpcLogin} --digest` : '';
  
  switch (type) {
    case 'clearnet':
      return `curl ${rpcLogin} -X POST http://${config.rpcBindIp}:${config.rpcBindPort}/json_rpc -d '{"jsonrpc":"2.0","id":"0","method":"get_info"}' -H 'Content-Type: application/json'`;
    
    case 'tor':
      return `curl --socks5-hostname 127.0.0.1:${config.torSocksPort} ${rpcLogin} -X POST http://${config.torOnionAddress}:18081/json_rpc -d '{"jsonrpc":"2.0","id":"0","method":"get_info"}' -H 'Content-Type: application/json'`;
    
    case 'i2p':
      return `curl --socks5-hostname 127.0.0.1:4447 ${rpcLogin} -X POST http://${config.i2pAddress}:80/json_rpc -d '{"jsonrpc":"2.0","id":"0","method":"get_info"}' -H 'Content-Type: application/json'`;
    
    default:
      return '';
  }
};

/**
 * Generate default configuration files for Tor and I2P if they don't exist
 * @param config - The Monero configuration object
 * @returns A promise that resolves with success flag and message
 */
export const generateDefaultConfigs = async (config: any): Promise<{ success: boolean, message: string }> => {
  try {
    if (!fs || !path) {
      console.log('File operations are only available in Electron environment');
      return {
        success: true,
        message: "Default configurations would be generated in Electron environment"
      };
    }
    
    // Generate torrc if it doesn't exist
    if (config.torEnabled && !fs.existsSync(config.torrcPath)) {
      const torrcContent = `# Generated Tor configuration
SocksPort ${config.torSocksPort}
ControlPort 9051
Log notice file ${config.torLogPath}
DataDirectory ${config.torDataPath}
HiddenServiceDir ${path.join(path.dirname(config.torDataPath), 'hidden_service')}
HiddenServicePort 18081 127.0.0.1:18081
`;
      fs.writeFileSync(config.torrcPath, torrcContent);
    }
    
    // Generate I2P config if it doesn't exist
    if (config.i2pEnabled && !fs.existsSync(config.i2pConfigPath)) {
      const i2pdConfContent = `# Generated I2P configuration
log = file
logfile = ${config.i2pLogPath}
datadir = ${config.i2pDataPath}
sam.enabled = true
sam.address = 127.0.0.1
sam.port = ${config.i2pSamPort}
http.enabled = true
http.address = 127.0.0.1
http.port = 4444
socksproxy.enabled = true
socksproxy.address = 127.0.0.1
socksproxy.port = 4447
`;
      fs.writeFileSync(config.i2pConfigPath, i2pdConfContent);
    }
    
    // Generate I2P tunnels config if it doesn't exist
    if (config.i2pEnabled && !fs.existsSync(config.i2pTunnelsPath)) {
      const tunnelsConfContent = `# Generated I2P tunnels configuration
[monero-rpc]
type = http
host = 127.0.0.1
port = 18081
keys = monero-rpc.dat
inbound.length = 3
outbound.length = 3
inbound.quantity = 5
outbound.quantity = 5
`;
      fs.writeFileSync(config.i2pTunnelsPath, tunnelsConfContent);
    }
    
    return {
      success: true,
      message: "Generated default configuration files"
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error generating configuration files"
    };
  }
};
