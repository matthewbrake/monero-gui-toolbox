
import React, { useState, useEffect, useRef } from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  Check, 
  Copy, 
  Eye, 
  EyeOff, 
  Folder, 
  Power, 
  PowerOff, 
  RotateCcw, 
  Terminal,
  Database,
  Cpu,
  Network,
  Shield
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
    testConnectivity,
    connectionTestResults,
    checkPortStatus,
    testRpcCommand
  } = useMonero();
  
  const [torLogExpanded, setTorLogExpanded] = useState(false);
  const [i2pLogExpanded, setI2pLogExpanded] = useState(false);
  const [showTorAddress, setShowTorAddress] = useState(false);
  const [showI2pAddress, setShowI2pAddress] = useState(false);
  const [directoryStructureCreated, setDirectoryStructureCreated] = useState(false);
  const [rpcResults, setRpcResults] = useState<{
    clearnet: { tested: boolean; result?: string; success?: boolean };
    tor: { tested: boolean; result?: string; success?: boolean };
    i2p: { tested: boolean; result?: string; success?: boolean };
  }>({
    clearnet: { tested: false },
    tor: { tested: false },
    i2p: { tested: false }
  });
  
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

  const runRpcTest = async (proxyType: 'clearnet' | 'tor' | 'i2p') => {
    try {
      if (!isRunning) {
        toast({
          variant: "destructive",
          title: "Monero daemon is not running",
          description: "Start the Monero daemon first to test RPC commands."
        });
        return;
      }

      // Check if the required proxy is running for tor/i2p tests
      if (proxyType === 'tor' && !torProxyRunning) {
        toast({
          variant: "destructive",
          title: "Tor proxy is not running",
          description: "Start Tor proxy first to test RPC over Tor."
        });
        return;
      }

      if (proxyType === 'i2p' && !i2pProxyRunning) {
        toast({
          variant: "destructive",
          title: "I2P proxy is not running",
          description: "Start I2P proxy first to test RPC over I2P."
        });
        return;
      }

      toast({
        title: "Testing RPC",
        description: `Running RPC test over ${proxyType}...`,
      });

      const result = await testRpcCommand(proxyType);
      
      // Update the local state with the result
      setRpcResults(prev => ({
        ...prev,
        [proxyType]: { 
          tested: true, 
          result: result.output,
          success: result.success
        }
      }));
      
      toast({
        title: result.success ? "RPC test successful" : "RPC test failed",
        description: `Test over ${proxyType} ${result.success ? 'completed successfully' : 'failed'}`,
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
            Configure and manage Tor and I2P proxies for enhanced privacy
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
                        <Label htmlFor="tor-socks-port">SOCKS Port</Label>
                        <Input
                          id="tor-socks-port"
                          value={config.torSocksPort}
                          onChange={(e) => setConfig(prev => ({ ...prev, torSocksPort: e.target.value }))}
                          placeholder="9050"
                          className="flex-1"
                        />
                        <p className="text-xs text-muted-foreground">Tor SOCKS port (default: 9050)</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tor-hidden-port">Hidden Service Port</Label>
                        <Input
                          id="tor-hidden-port"
                          value={(config.anonymousInboundTor || "").split(',')[0]?.split(':')[1] || "18083"}
                          onChange={(e) => {
                            // Parse existing anonymousInboundTor to update only the port
                            const parts = (config.anonymousInboundTor || "").split(',');
                            if (parts.length >= 1) {
                              const addrParts = parts[0].split(':');
                              addrParts[1] = e.target.value;
                              parts[0] = addrParts.join(':');
                              setConfig(prev => ({ ...prev, anonymousInboundTor: parts.join(',') }));
                            } else {
                              setConfig(prev => ({ ...prev, anonymousInboundTor: `127.0.0.1:${e.target.value}` }));
                            }
                          }}
                          placeholder="18083"
                          className="flex-1"
                        />
                        <p className="text-xs text-muted-foreground">Port to expose via Tor hidden service</p>
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
                        <div className="text-sm font-medium mb-3">Default Configuration</div>
                        <ScrollArea className="h-32 w-full rounded-md border p-2 font-mono text-xs">
                          <pre className="text-gray-300">
{`# Default Tor configuration for Monero Suite
SocksPort ${config.torSocksPort || "9050"}
ControlPort 9051

# Data directory
DataDirectory ${config.torDataPath || "/app/tor/data"}

# Log settings
Log notice file ${config.torLogPath || "/app/tor/logs/tor.log"}

# Hidden service settings
HiddenServiceDir ${config.torDataPath ? config.torDataPath + '/hidden_service' : '/app/tor/hidden_service'}
HiddenServicePort ${(config.anonymousInboundTor || "").split(',')[0]?.split(':')[1] || "18083"} 127.0.0.1:${(config.anonymousInboundTor || "").split(',')[0]?.split(':')[1] || "18083"}

# Exit policy
ExitPolicy reject *:*`}
                          </pre>
                        </ScrollArea>
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

                      <div className="space-y-2">
                        <Label>Port Status</Label>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => checkPortStatus('tor')} 
                            variant="outline" 
                            size="sm"
                            className="flex-1 flex items-center justify-center space-x-2"
                          >
                            <Terminal className="h-4 w-4" />
                            <span>Check Tor Ports</span>
                          </Button>
                        </div>
                        {connectionTestResults.portStatus.tor.checked && (
                          <div className={`text-xs p-2 rounded-md ${connectionTestResults.portStatus.tor.open ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                            Port {connectionTestResults.portStatus.tor.port} is {connectionTestResults.portStatus.tor.open ? 'open' : 'closed'}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-3 border-t">
                        <Label>Test RPC over Tor</Label>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => runRpcTest('tor')} 
                            variant="outline" 
                            size="sm"
                            className="flex-1 flex items-center justify-center space-x-2"
                            disabled={!torProxyRunning || !isRunning}
                          >
                            <Terminal className="h-4 w-4" />
                            <span>Test RPC Connection</span>
                          </Button>
                        </div>
                        
                        {rpcResults.tor.tested && (
                          <div className="space-y-2 mt-2">
                            <div className={`text-xs p-2 rounded-md ${rpcResults.tor.success ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                              {rpcResults.tor.success ? 'RPC test over Tor successful' : 'RPC test over Tor failed'}
                            </div>
                            
                            <Collapsible>
                              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-xs text-muted-foreground hover:text-white">
                                <span>Show RPC Output</span>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <ScrollArea className="h-40 w-full rounded-md border p-2 bg-black/30 font-mono text-xs text-amber-100">
                                  {rpcResults.tor.result || "No output available"}
                                </ScrollArea>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        )}
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
                    <ScrollArea className="h-64 w-full bg-black/30 p-4 font-mono text-xs">
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
                    </ScrollArea>
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
                        <Label htmlFor="i2p-sam-port">SAM Port</Label>
                        <Input
                          id="i2p-sam-port"
                          value={config.i2pSamPort}
                          onChange={(e) => setConfig(prev => ({ ...prev, i2pSamPort: e.target.value }))}
                          placeholder="7656"
                          className="flex-1"
                        />
                        <p className="text-xs text-muted-foreground">I2P SAM port for application communication (default: 7656)</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="i2p-inbound-port">I2P Node Service Port</Label>
                        <Input
                          id="i2p-inbound-port"
                          value={(config.anonymousInboundI2p || "").split(',')[0]?.split(':')[1] || "18085"}
                          onChange={(e) => {
                            // Parse existing anonymousInboundI2p to update only the port
                            const parts = (config.anonymousInboundI2p || "").split(',');
                            if (parts.length >= 1) {
                              const addrParts = parts[0].split(':');
                              addrParts[1] = e.target.value;
                              parts[0] = addrParts.join(':');
                              setConfig(prev => ({ ...prev, anonymousInboundI2p: parts.join(',') }));
                            } else {
                              setConfig(prev => ({ ...prev, anonymousInboundI2p: `127.0.0.1:${e.target.value}` }));
                            }
                          }}
                          placeholder="18085"
                          className="flex-1"
                        />
                        <p className="text-xs text-muted-foreground">P2P port to expose via I2P</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="i2p-rpc-port">I2P RPC Service Port</Label>
                        <Input
                          id="i2p-rpc-port"
                          placeholder="18089"
                          defaultValue="18089"
                          className="flex-1"
                        />
                        <p className="text-xs text-muted-foreground">RPC port to expose via I2P</p>
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

                      <div className="space-y-3 pt-3 border-t">
                        <div className="text-sm font-medium">I2P Tunnels Configuration</div>
                        <ScrollArea className="h-32 w-full rounded-md border p-2 font-mono text-xs">
                          <pre className="text-gray-300">
{`# Default I2P tunnels configuration for Monero Suite

[monero-node]
type = server
host = 127.0.0.1
# Anonymous inbound port
port = ${(config.anonymousInboundI2p || "").split(',')[0]?.split(':')[1] || "18085"}
inport = 0
keys = monero-mainnet.dat

[monero-rpc]
type = server
host = 127.0.0.1
# Restricted RPC port
port = 18089
keys = monero-mainnet.dat`}
                          </pre>
                        </ScrollArea>
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

                      <div className="space-y-2">
                        <Label>Port Status</Label>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => checkPortStatus('i2p')} 
                            variant="outline" 
                            size="sm"
                            className="flex-1 flex items-center justify-center space-x-2"
                          >
                            <Terminal className="h-4 w-4" />
                            <span>Check I2P Ports</span>
                          </Button>
                        </div>
                        {connectionTestResults.portStatus.i2p.checked && (
                          <div className={`text-xs p-2 rounded-md ${connectionTestResults.portStatus.i2p.open ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                            Port {connectionTestResults.portStatus.i2p.port} is {connectionTestResults.portStatus.i2p.open ? 'open' : 'closed'}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-3 border-t">
                        <Label>Test RPC over I2P</Label>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => runRpcTest('i2p')} 
                            variant="outline" 
                            size="sm"
                            className="flex-1 flex items-center justify-center space-x-2"
                            disabled={!i2pProxyRunning || !isRunning}
                          >
                            <Terminal className="h-4 w-4" />
                            <span>Test RPC Connection</span>
                          </Button>
                        </div>
                        
                        {rpcResults.i2p.tested && (
                          <div className="space-y-2 mt-2">
                            <div className={`text-xs p-2 rounded-md ${rpcResults.i2p.success ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                              {rpcResults.i2p.success ? 'RPC test over I2P successful' : 'RPC test over I2P failed'}
                            </div>
                            
                            <Collapsible>
                              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-xs text-muted-foreground hover:text-white">
                                <span>Show RPC Output</span>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <ScrollArea className="h-40 w-full rounded-md border p-2 bg-black/30 font-mono text-xs text-amber-100">
                                  {rpcResults.i2p.result || "No output available"}
                                </ScrollArea>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        )}
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
                    <ScrollArea className="h-64 w-full bg-black/30 p-4 font-mono text-xs">
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
                    </ScrollArea>
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
            <CardTitle>Network Connectivity Tests</CardTitle>
            <CardDescription>Test connections to the Monero network</CardDescription>
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
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <Database className="mr-2 h-4 w-4" />
                  <span>Clearnet RPC Test</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => runRpcTest('clearnet')} 
                    variant="outline" 
                    size="sm"
                    className="w-full flex items-center justify-center space-x-2"
                    disabled={!isRunning}
                  >
                    <Terminal className="h-4 w-4" />
                    <span>Test Clearnet RPC</span>
                  </Button>
                  
                  {rpcResults.clearnet.tested && (
                    <div className="space-y-2">
                      <div className={`text-xs p-2 rounded-md ${rpcResults.clearnet.success ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                        {rpcResults.clearnet.success ? 'RPC test successful' : 'RPC test failed'}
                      </div>
                      
                      <Collapsible>
                        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-xs text-muted-foreground hover:text-white">
                          <span>Show RPC Output</span>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <ScrollArea className="h-40 w-full rounded-md border p-2 bg-black/30 font-mono text-xs text-amber-100">
                            {rpcResults.clearnet.result || "No output available"}
                          </ScrollArea>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <Cpu className="mr-2 h-4 w-4" />
                  <span>Port Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      onClick={() => checkPortStatus('monero')} 
                      variant="outline" 
                      size="sm"
                      className="flex items-center justify-center space-x-1"
                    >
                      <span>Monero</span>
                    </Button>
                    
                    <Button 
                      onClick={() => checkPortStatus('tor')} 
                      variant="outline" 
                      size="sm"
                      className="flex items-center justify-center space-x-1"
                    >
                      <span>Tor</span>
                    </Button>
                    
                    <Button 
                      onClick={() => checkPortStatus('i2p')} 
                      variant="outline" 
                      size="sm"
                      className="flex items-center justify-center space-x-1"
                    >
                      <span>I2P</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {connectionTestResults.portStatus.monero.checked && (
                      <div className={`text-xs p-2 rounded-md ${connectionTestResults.portStatus.monero.open ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                        Monero RPC Port {connectionTestResults.portStatus.monero.port} is {connectionTestResults.portStatus.monero.open ? 'open' : 'closed'}
                      </div>
                    )}
                    
                    {connectionTestResults.portStatus.tor.checked && (
                      <div className={`text-xs p-2 rounded-md ${connectionTestResults.portStatus.tor.open ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                        Tor SOCKS Port {connectionTestResults.portStatus.tor.port} is {connectionTestResults.portStatus.tor.open ? 'open' : 'closed'}
                      </div>
                    )}
                    
                    {connectionTestResults.portStatus.i2p.checked && (
                      <div className={`text-xs p-2 rounded-md ${connectionTestResults.portStatus.i2p.open ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                        I2P SAM Port {connectionTestResults.portStatus.i2p.port} is {connectionTestResults.portStatus.i2p.open ? 'open' : 'closed'}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-black/20 rounded-md space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <span className="font-medium">Anonymous Network Status</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${torProxyRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">Tor: {torProxyRunning ? 'Connected' : 'Disconnected'}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${i2pProxyRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">I2P: {i2pProxyRunning ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
            
            <Button
              onClick={testConnectivity}
              variant="default"
              size="sm"
              className="mt-3 w-full"
              disabled={!isRunning}
            >
              <Network className="mr-2 h-4 w-4" />
              Run All Connectivity Tests
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProxyTab;
