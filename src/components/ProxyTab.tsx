import React, { useState, useEffect, useRef } from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Copy, Eye, EyeOff, Folder, Power, PowerOff, RotateCcw, Terminal } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from '@/hooks/use-toast';
import { createDirectoryStructure } from '@/utils/moneroUtils';

const ProxyTab: React.FC = () => {
  const { 
    config, 
    setConfig, 
    isRunning,
    logs,
    startTorProxy,
    stopTorProxy,
    startI2PProxy,
    stopI2PProxy,
    torProxyRunning,
    i2pProxyRunning,
    testConnectivity
  } = useMonero();
  
  const [torLogExpanded, setTorLogExpanded] = useState(false);
  const [i2pLogExpanded, setI2pLogExpanded] = useState(false);
  const [showTorAddress, setShowTorAddress] = useState(false);
  const [showI2pAddress, setShowI2pAddress] = useState(false);
  const [directoryStructureCreated, setDirectoryStructureCreated] = useState(false);
  const torLogEndRef = useRef<HTMLDivElement>(null);
  const i2pLogEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when logs update
  useEffect(() => {
    if (torLogEndRef.current && torLogExpanded) {
      torLogEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs.torProxy, torLogExpanded]);

  useEffect(() => {
    if (i2pLogEndRef.current && i2pLogExpanded) {
      i2pLogEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs.i2pProxy, i2pLogExpanded]);

  // Initialize directory structure when component mounts
  useEffect(() => {
    const initializeDirectoryStructure = async () => {
      try {
        const result = await createDirectoryStructure('./');
        if (result.success) {
          setDirectoryStructureCreated(true);
          console.log('Directory structure created or simulated:', result.message);
          
          // Display directory structure in browser environment
          if (result.message.includes("would be created")) {
            // In browser environment, show toast with directory structure info
            toast({
              title: "Directory Structure Overview",
              description: "Directory structure details are displayed in the console.",
            });
            console.info("Expected directory structure:\n" + result.message);
          }
        } else {
          console.error('Failed to create directory structure:', result.message);
          toast({
            variant: "destructive",
            title: "Directory setup failed",
            description: result.message,
          });
        }
      } catch (error) {
        console.error('Error creating directory structure:', error);
      }
    };

    if (!directoryStructureCreated) {
      initializeDirectoryStructure();
    }
  }, [directoryStructureCreated]);

  const browsePath = async (field: keyof typeof config) => {
    try {
      const { getFilePath } = await import('@/utils/moneroUtils');
      const path = await getFilePath();
      if (path) {
        setConfig((prev) => ({ ...prev, [field]: path }));
      }
    } catch (error) {
      console.error('Failed to get file path:', error);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: `${label} has been copied to your clipboard.`,
        });
      },
      (err) => {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: `Could not copy ${label}: ${err}`,
        });
      }
    );
  };

  const testRpcCommand = async (proxyType: 'tor' | 'i2p') => {
    try {
      if (!isRunning) {
        toast({
          variant: "destructive",
          title: "Monero daemon is not running",
          description: "Start the Monero daemon first to test RPC commands."
        });
        return;
      }

      const { testRpcCommand } = await import('@/utils/moneroUtils');
      
      // Determine proxy address based on type
      const proxyAddress = proxyType === 'tor' 
        ? `http://${config.torOnionAddress || 'youraddress.onion'}:18081` 
        : `http://${config.i2pAddress || 'youraddress.b32.i2p'}:18081`;
      
      // Construct RPC address
      const rpcAddress = proxyType === 'tor'
        ? `http://${config.torOnionAddress}:18081`
        : `http://${config.i2pAddress}:80`;
      
      // Test the RPC command
      const result = await testRpcCommand(
        proxyType,
        proxyAddress,
        rpcAddress,
        config.rpcLogin
      );
      
      // Update logs with the output
      const logType = proxyType === 'tor' ? 'torProxy' : 'i2pProxy';
      const logEntry = `[RPC Test] ${result.output}`;
      
      // This would normally update logs through the context
      console.log(`${logType} log:`, logEntry);
      
      toast({
        title: result.success ? "RPC test successful" : "RPC test failed",
        description: result.success 
          ? `Successfully tested RPC over ${proxyType.toUpperCase()}` 
          : `Failed to test RPC over ${proxyType.toUpperCase()}: ${result.output}`,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: `RPC test failed`,
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const restartDaemon = async () => {
    try {
      if (!isRunning) {
        toast({
          variant: "destructive",
          title: "Monero daemon is not running",
          description: "Start the Monero daemon first before attempting to restart."
        });
        return;
      }

      // Import and call the restart function
      const { restartMoneroDaemon } = await import('@/utils/moneroUtils');
      const result = await restartMoneroDaemon();
      
      toast({
        title: result.success ? "Daemon restart initiated" : "Failed to restart daemon",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to restart daemon",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <div className="space-y-6 animate-slideUp">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Anonymity Network Proxies</CardTitle>
          <CardDescription>
            Configure and manage Tor and I2P proxies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tor" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="tor">Tor</TabsTrigger>
              <TabsTrigger value="i2p">I2P</TabsTrigger>
            </TabsList>

            {/* TOR TAB */}
            <TabsContent value="tor">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Tor Configuration */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Tor Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="tor-path">Tor Executable</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="tor-path"
                            value={config.torPath}
                            onChange={(e) => setConfig(prev => ({ ...prev, torPath: e.target.value }))}
                            placeholder="./tor/bin/tor.exe"
                            className="flex-1"
                          />
                          <Button variant="outline" onClick={() => browsePath('torPath')} size="icon">
                            <Folder className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Path to Tor executable (relative or absolute)</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="font-medium">Current Status</h3>
                          <div className="flex items-center space-x-2">
                            <div className={`h-2 w-2 rounded-full ${torProxyRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm">{torProxyRunning ? 'Running' : 'Stopped'}</span>
                          </div>
                        </div>
                        {torProxyRunning ? (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={stopTorProxy}
                            className="flex items-center space-x-2"
                          >
                            <PowerOff className="h-4 w-4" />
                            <span>Stop Tor</span>
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={startTorProxy}
                            className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-800"
                          >
                            <Power className="h-4 w-4" />
                            <span>Start Tor</span>
                          </Button>
                        )}
                      </div>

                      <div className="pt-3 border-t">
                        <div className="text-sm font-medium mb-3">Directory Structure</div>
                        <div className="text-xs font-mono bg-black/30 p-2 rounded-md">
                          <div>./tor/bin/ - Tor executable</div>
                          <div>./tor/data/ - Tor data directory</div>
                          <div>./tor/hidden_service/ - Onion service</div>
                          <div>./tor/config/torrc - Tor configuration</div>
                          <div>./tor/logs/ - Log files</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tor Status */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Tor Status Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Onion Address</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowTorAddress(!showTorAddress)}
                            className="h-8 w-8 p-0"
                          >
                            {showTorAddress ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-black/30 p-2 rounded-md font-mono text-xs flex-1 overflow-hidden">
                            {showTorAddress ? (
                              config.torOnionAddress ? 
                                <span className="text-green-400">{config.torOnionAddress}</span> : 
                                <span className="text-muted-foreground">Not available. Start Tor to generate.</span>
                            ) : (
                              "••••••••••••••••••••.onion"
                            )}
                          </div>
                          {config.torOnionAddress && (
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => copyToClipboard(config.torOnionAddress, "Onion address")}
                              disabled={!config.torOnionAddress}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">SOCKS5 Proxy</Label>
                          <div className="font-mono text-xs bg-black/30 p-2 rounded-md text-amber-300">
                            127.0.0.1:{config.torSocksPort || "9050"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Hidden Service Port</Label>
                          <div className="font-mono text-xs bg-black/30 p-2 rounded-md text-amber-300">
                            {(config.anonymousInboundTor || "").split(',')[0]?.split(':')[1] || "18083"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-3 border-t">
                        <Label>Test RPC over Tor</Label>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => testRpcCommand('tor')} 
                            variant="outline" 
                            size="sm"
                            className="flex-1 flex items-center justify-center space-x-2"
                            disabled={!torProxyRunning || !isRunning}
                          >
                            <Terminal className="h-4 w-4" />
                            <span>Test RPC Connection</span>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Tests RPC connection through Tor SOCKS proxy</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tor Logs */}
                <Collapsible 
                  open={torLogExpanded} 
                  onOpenChange={setTorLogExpanded}
                  className="border rounded-md"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/20">
                    <span className="font-medium">Tor Logs</span>
                    <div className={`h-2 w-2 rounded-full ${torProxyRunning ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 bg-black/30 font-mono text-xs h-64 overflow-y-auto">
                      {logs.torProxy && logs.torProxy.length > 0 ? (
                        logs.torProxy.map((line, index) => (
                          <div key={index} className="text-gray-300">
                            {line}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">
                          {torProxyRunning ? "No log output yet..." : "Start Tor to see logs"}
                        </div>
                      )}
                      <div ref={torLogEndRef} />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>

            {/* I2P TAB */}
            <TabsContent value="i2p">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* I2P Configuration */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">I2P Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="i2p-path">I2P Executable</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="i2p-path"
                            value={config.i2pPath}
                            onChange={(e) => setConfig(prev => ({ ...prev, i2pPath: e.target.value }))}
                            placeholder="./i2p/bin/i2pd.exe"
                            className="flex-1"
                          />
                          <Button variant="outline" onClick={() => browsePath('i2pPath')} size="icon">
                            <Folder className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Path to I2P executable (relative or absolute)</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="font-medium">Current Status</h3>
                          <div className="flex items-center space-x-2">
                            <div className={`h-2 w-2 rounded-full ${i2pProxyRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm">{i2pProxyRunning ? 'Running' : 'Stopped'}</span>
                          </div>
                        </div>
                        {i2pProxyRunning ? (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={stopI2PProxy}
                            className="flex items-center space-x-2"
                          >
                            <PowerOff className="h-4 w-4" />
                            <span>Stop I2P</span>
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={startI2PProxy}
                            className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800"
                          >
                            <Power className="h-4 w-4" />
                            <span>Start I2P</span>
                          </Button>
                        )}
                      </div>

                      <div className="pt-3 border-t">
                        <div className="text-sm font-medium mb-3">Directory Structure</div>
                        <div className="text-xs font-mono bg-black/30 p-2 rounded-md">
                          <div>./i2p/bin/ - I2P executable</div>
                          <div>./i2p/data/ - I2P data directory</div>
                          <div>./i2p/config/i2pd.conf - Main configuration</div>
                          <div>./i2p/config/tunnels.conf - Tunnel configuration</div>
                          <div>./i2p/logs/ - Log files</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* I2P Status */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">I2P Status Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>I2P Address</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowI2pAddress(!showI2pAddress)}
                            className="h-8 w-8 p-0"
                          >
                            {showI2pAddress ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-black/30 p-2 rounded-md font-mono text-xs flex-1 overflow-hidden">
                            {showI2pAddress ? (
                              config.i2pAddress ? 
                                <span className="text-green-400">{config.i2pAddress}</span> : 
                                <span className="text-muted-foreground">Not available. Start I2P to generate.</span>
                            ) : (
                              "••••••••••••••••••••.b32.i2p"
                            )}
                          </div>
                          {config.i2pAddress && (
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => copyToClipboard(config.i2pAddress, "I2P address")}
                              disabled={!config.i2pAddress}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">I2P Proxy</Label>
                          <div className="font-mono text-xs bg-black/30 p-2 rounded-md text-amber-300">
                            127.0.0.1:4447
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">SAM Port</Label>
                          <div className="font-mono text-xs bg-black/30 p-2 rounded-md text-amber-300">
                            {config.i2pSamPort || "7656"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-3 border-t">
                        <Label>Test RPC over I2P</Label>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => testRpcCommand('i2p')} 
                            variant="outline" 
                            size="sm"
                            className="flex-1 flex items-center justify-center space-x-2"
                            disabled={!i2pProxyRunning || !isRunning}
                          >
                            <Terminal className="h-4 w-4" />
                            <span>Test RPC Connection</span>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Tests RPC connection through I2P proxy</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* I2P Logs */}
                <Collapsible 
                  open={i2pLogExpanded} 
                  onOpenChange={setI2pLogExpanded}
                  className="border rounded-md"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/20">
                    <span className="font-medium">I2P Logs</span>
                    <div className={`h-2 w-2 rounded-full ${i2pProxyRunning ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 bg-black/30 font-mono text-xs h-64 overflow-y-auto">
                      {logs.i2pProxy && logs.i2pProxy.length > 0 ? (
                        logs.i2pProxy.map((line, index) => (
                          <div key={index} className="text-gray-300">
                            {line}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">
                          {i2pProxyRunning ? "No log output yet..." : "Start I2P to see logs"}
                        </div>
                      )}
                      <div ref={i2pLogEndRef} />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="glass-panel">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Monero Daemon Controls</CardTitle>
            <CardDescription>Manage your Monero daemon</CardDescription>
          </div>
          <Button
            onClick={restartDaemon}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={!isRunning}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restart Daemon</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="bg-black/30 p-4 rounded-md space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Directory Structure</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <div className="text-amber-300">./bin/</div>
                  <div className="pl-4">./win/ - Windows binaries</div>
                  <div className="pl-4">./linux/ - Linux binaries</div>
                </div>
                <div>
                  <div className="text-amber-300">./blockchain/</div>
                  <div className="text-amber-300">./configs/</div>
                  <div className="text-amber-300">./logs/</div>
                </div>
              </div>
            </div>

            <div className="flex items-center p-2 bg-black/20 rounded border border-yellow-500/30">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
              <span className="text-xs text-yellow-200">
                When both Tor and I2P are enabled, make sure their port configurations don't conflict.
                Check the Monero configuration to ensure the anonymous inbound settings are correctly set.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProxyTab;
