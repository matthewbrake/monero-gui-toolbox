
import React, { useState } from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Activity, Server, Database, Network, Clock, Globe, Wifi, Shield, ExternalLink, 
  Terminal, Check, AlertCircle, RefreshCw, Copy, Cpu, HardDrive
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from '@/hooks/use-toast';
import { Separator } from "@/components/ui/separator";

const StatusTab: React.FC = () => {
  const { 
    isRunning, 
    statusInfo, 
    config, 
    torProxyRunning,
    i2pProxyRunning,
    testConnectivity,
    connectionTestResults,
    checkPortStatus
  } = useMonero();
  const [loadingTest, setLoadingTest] = useState(false);
  const [showCommandOutput, setShowCommandOutput] = useState<{
    tor: boolean;
    i2p: boolean;
    rpc: boolean;
  }>({ tor: false, i2p: false, rpc: false });

  const runConnectivityTests = async () => {
    setLoadingTest(true);
    await testConnectivity();
    setLoadingTest(false);
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

  return (
    <div className="space-y-6 animate-slideUp">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-monero-blue-light" />
            <span>Daemon Status</span>
          </CardTitle>
          <CardDescription>
            Real-time Monero daemon status and metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`mb-6 p-4 rounded-md flex items-center space-x-3 ${isRunning ? 'bg-green-950/30 text-green-400' : 'bg-red-950/30 text-red-400'}`}>
            <div className={`h-3 w-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="font-medium">
              {isRunning ? 'Daemon is running' : 'Daemon is stopped'}
            </span>
            {isRunning && (
              <div className="flex items-center space-x-2 ml-auto">
                <Badge variant="outline" className="bg-black/30 text-green-400">
                  <HardDrive className="h-3 w-3 mr-1" />
                  <span className="font-mono text-xs">{config.moneroPath.split('/').pop()}</span>
                </Badge>
              </div>
            )}
          </div>

          {isRunning ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sync Status</span>
                    <span className="font-medium">{statusInfo.syncStatus.toFixed(2)}%</span>
                  </div>
                  <Progress value={statusInfo.syncStatus} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Server className="h-5 w-5 text-monero-blue-light mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Current Block Height</p>
                      <p className="font-mono text-lg font-medium">{statusInfo.blockHeight.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Network className="h-5 w-5 text-monero-blue-light mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Network Hashrate</p>
                      <p className="font-mono text-lg font-medium">{statusInfo.networkHashrate}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Database className="h-5 w-5 text-monero-blue-light mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Connected Peers</p>
                      <p className="font-mono text-lg font-medium">{statusInfo.connections}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-monero-blue-light mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Version</p>
                      <p className="font-mono text-lg font-medium">{statusInfo.version || "v0.18.2.2"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-md bg-card/80 backdrop-blur-sm border border-border/40">
                  <h3 className="text-sm font-medium mb-2 flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-monero-blue-light" />
                    <span>Recent Activity</span>
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Last Block Found</span>
                      <span className="font-medium">3 minutes ago</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Last Incoming Connection</span>
                      <span className="font-medium">1 minute ago</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Last Outgoing Connection</span>
                      <span className="font-medium">5 minutes ago</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-md bg-card/80 backdrop-blur-sm border border-border/40">
                  <h3 className="text-sm font-medium mb-2">System Resource Usage</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">CPU Usage</span>
                        <span>32%</span>
                      </div>
                      <Progress value={32} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Memory Usage</span>
                        <span>1.2 GB</span>
                      </div>
                      <Progress value={45} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Disk I/O</span>
                        <span>3.5 MB/s</span>
                      </div>
                      <Progress value={25} className="h-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Daemon is not running</p>
              <p className="text-sm mt-2">Start the node to view status information</p>
            </div>
          )}
        </CardContent>
      </Card>

      {isRunning && (
        <>
          {/* Connectivity Test Card */}
          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Terminal className="h-5 w-5 text-monero-blue-light" />
                  <span>Connectivity Tests</span>
                </CardTitle>
                <CardDescription>
                  Test network connections across Monero, Tor, and I2P services
                </CardDescription>
              </div>
              <Button 
                onClick={runConnectivityTests} 
                disabled={loadingTest}
                variant="outline" 
                size="sm"
                className="space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${loadingTest ? 'animate-spin' : ''}`} />
                <span>Run Tests</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Monero RPC Connectivity */}
                <div className="border rounded-md p-4">
                  <h3 className="font-medium flex items-center space-x-2 mb-4">
                    <Cpu className="h-4 w-4 text-monero-blue-light" />
                    <span>Monero RPC Connectivity Tests</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Monero Port Status */}
                    <div className="space-y-2 border rounded-md p-3">
                      <h4 className="text-sm font-medium">RPC Port Status</h4>
                      {connectionTestResults.portStatus.monero.checked ? (
                        <div className="flex items-center space-x-2">
                          {connectionTestResults.portStatus.monero.open ? (
                            <>
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-400">
                                Port {connectionTestResults.portStatus.monero.port} is open
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                              <span className="text-sm text-red-400">
                                Port {connectionTestResults.portStatus.monero.port} is closed
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not tested</span>
                      )}
                      
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => checkPortStatus('monero')}
                          className="text-xs"
                        >
                          Check Port
                        </Button>
                      </div>
                    </div>
                    
                    {/* Clearnet RPC Test */}
                    <div className="space-y-2 border rounded-md p-3 col-span-2">
                      <h4 className="text-sm font-medium">Clearnet RPC Test</h4>
                      {connectionTestResults.rpcConnectivity.tested ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {connectionTestResults.rpcConnectivity.success ? (
                              <>
                                <Check className="h-4 w-4 text-green-400" />
                                <span className="text-sm text-green-400">
                                  Connection successful
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <span className="text-sm text-red-400">
                                  Connection failed
                                </span>
                              </>
                            )}
                          </div>
                          
                          <Collapsible open={showCommandOutput.rpc} onOpenChange={(open) => setShowCommandOutput({...showCommandOutput, rpc: open})}>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                                {showCommandOutput.rpc ? "Hide" : "Show"} command output
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="text-xs font-mono bg-black/30 p-2 rounded-md text-green-400 mt-2">
                                $ curl -u user:pass --digest -X POST http://{config.rpcBindIp}:{config.rpcBindPort}/json_rpc 
                                -d '&#123;"jsonrpc":"2.0","id":"0","method":"get_info"&#125;'<br/>
                                {connectionTestResults.rpcConnectivity.output || "No output"}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not tested</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {config.torEnabled && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium flex items-center space-x-2 mb-4">
                      <Shield className="h-4 w-4 text-monero-blue-light" />
                      <span>Tor Connectivity Tests</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Tor Port Status */}
                      <div className="space-y-2 border rounded-md p-3">
                        <h4 className="text-sm font-medium">Tor SOCKS Port Status</h4>
                        {connectionTestResults.portStatus.tor.checked ? (
                          <div className="flex items-center space-x-2">
                            {connectionTestResults.portStatus.tor.open ? (
                              <>
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-400">
                                  Port {connectionTestResults.portStatus.tor.port} is open
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-red-400">
                                  Port {connectionTestResults.portStatus.tor.port} is closed
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not tested</span>
                        )}
                        
                        <div className="flex justify-end mt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => checkPortStatus('tor')}
                            className="text-xs"
                            disabled={!torProxyRunning}
                          >
                            Check Port
                          </Button>
                        </div>
                      </div>
                      
                      {/* Tor Onion Address */}
                      <div className="space-y-2 border rounded-md p-3">
                        <h4 className="text-sm font-medium">Tor Onion Address</h4>
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-xs bg-black/30 p-2 rounded-md text-green-400 flex-1 truncate">
                            {config.torOnionAddress || "Not available yet"}
                          </div>
                          {config.torOnionAddress && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => copyToClipboard(config.torOnionAddress, "Onion address")}
                              className="ml-2"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Status: {torProxyRunning ? 
                            <span className="text-green-400">Active</span> : 
                            <span className="text-red-400">Inactive</span>}
                        </div>
                      </div>
                      
                      {/* Tor Connectivity Test */}
                      <div className="space-y-2 border rounded-md p-3">
                        <h4 className="text-sm font-medium">Tor Network Test</h4>
                        {connectionTestResults.torConnectivity.tested ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              {connectionTestResults.torConnectivity.success ? (
                                <>
                                  <Check className="h-4 w-4 text-green-400" />
                                  <span className="text-sm text-green-400">
                                    Connection successful
                                  </span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-4 w-4 text-red-400" />
                                  <span className="text-sm text-red-400">
                                    Connection failed
                                  </span>
                                </>
                              )}
                            </div>
                            
                            <Collapsible open={showCommandOutput.tor} onOpenChange={(open) => setShowCommandOutput({...showCommandOutput, tor: open})}>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                                  {showCommandOutput.tor ? "Hide" : "Show"} command output
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="text-xs font-mono bg-black/30 p-2 rounded-md text-green-400 mt-2">
                                  $ curl --socks5-hostname 127.0.0.1:{config.torSocksPort} https://check.torproject.org/api/ip<br/>
                                  {connectionTestResults.torConnectivity.output || "No output"}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not tested</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {config.i2pEnabled && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium flex items-center space-x-2 mb-4">
                      <Network className="h-4 w-4 text-monero-blue-light" />
                      <span>I2P Connectivity Tests</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* I2P Port Status */}
                      <div className="space-y-2 border rounded-md p-3">
                        <h4 className="text-sm font-medium">I2P SAM Port Status</h4>
                        {connectionTestResults.portStatus.i2p.checked ? (
                          <div className="flex items-center space-x-2">
                            {connectionTestResults.portStatus.i2p.open ? (
                              <>
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-400">
                                  Port {connectionTestResults.portStatus.i2p.port} is open
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-red-400">
                                  Port {connectionTestResults.portStatus.i2p.port} is closed
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not tested</span>
                        )}
                        
                        <div className="flex justify-end mt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => checkPortStatus('i2p')}
                            className="text-xs"
                            disabled={!i2pProxyRunning}
                          >
                            Check Port
                          </Button>
                        </div>
                      </div>
                      
                      {/* I2P Address */}
                      <div className="space-y-2 border rounded-md p-3">
                        <h4 className="text-sm font-medium">I2P Address</h4>
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-xs bg-black/30 p-2 rounded-md text-green-400 flex-1 truncate">
                            {config.i2pAddress || "Not available yet"}
                          </div>
                          {config.i2pAddress && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => copyToClipboard(config.i2pAddress, "I2P address")}
                              className="ml-2"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Status: {i2pProxyRunning ? 
                            <span className="text-green-400">Active</span> : 
                            <span className="text-red-400">Inactive</span>}
                        </div>
                      </div>
                      
                      {/* I2P Connectivity Test */}
                      <div className="space-y-2 border rounded-md p-3">
                        <h4 className="text-sm font-medium">I2P Network Test</h4>
                        {connectionTestResults.i2pConnectivity.tested ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              {connectionTestResults.i2pConnectivity.success ? (
                                <>
                                  <Check className="h-4 w-4 text-green-400" />
                                  <span className="text-sm text-green-400">
                                    Connection successful
                                  </span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-4 w-4 text-red-400" />
                                  <span className="text-sm text-red-400">
                                    Connection failed
                                  </span>
                                </>
                              )}
                            </div>
                            
                            <Collapsible open={showCommandOutput.i2p} onOpenChange={(open) => setShowCommandOutput({...showCommandOutput, i2p: open})}>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                                  {showCommandOutput.i2p ? "Hide" : "Show"} command output
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="text-xs font-mono bg-black/30 p-2 rounded-md text-green-400 mt-2">
                                  $ curl --socks5-hostname 127.0.0.1:4447 http://acetone.i2p<br/>
                                  {connectionTestResults.i2pConnectivity.output || "No output"}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not tested</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {connectionTestResults.daemonVersion.checked && (
                  <div className="border rounded-md p-4 bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-monero-blue-light" />
                        <span>Daemon Version</span>
                      </h3>
                      
                      {connectionTestResults.daemonVersion.needsUpdate && (
                        <Badge variant="outline" className="bg-yellow-950/30 text-yellow-400 ml-2">
                          Update Available
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Current Version</p>
                        <p className="font-mono text-sm">
                          {connectionTestResults.daemonVersion.current || "Unknown"}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Latest Version</p>
                        <p className="font-mono text-sm">
                          {connectionTestResults.daemonVersion.latest || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Network Connections</CardTitle>
              <CardDescription>
                Active network interfaces and connection status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general">
                <TabsList className="mb-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  {config.torEnabled && <TabsTrigger value="tor">Tor</TabsTrigger>}
                  {config.i2pEnabled && <TabsTrigger value="i2p">I2P</TabsTrigger>}
                </TabsList>

                <TabsContent value="general">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 border rounded-md p-3">
                      <h3 className="text-sm font-medium flex items-center space-x-2">
                        <Wifi className="h-4 w-4 text-monero-blue-light" />
                        <span>RPC Interface</span>
                      </h3>
                      <div className="grid grid-cols-1 gap-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          <span className={`font-medium ${config.rpcEnabled ? 'text-green-400' : 'text-red-400'}`}>
                            {config.rpcEnabled ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        {config.rpcEnabled && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Endpoint:</span>
                              <span className="font-medium font-mono">
                                {config.rpcBindIp}:{config.rpcBindPort}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Restricted:</span>
                              <span className="font-medium">{config.restrictRpc ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">SSL:</span>
                              <span className="font-medium">{config.rpcSsl ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <div className="mt-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => checkPortStatus('monero')} 
                                className="w-full flex items-center justify-center space-x-1 text-xs"
                              >
                                <span>Test RPC Connection</span>
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 border rounded-md p-3">
                      <h3 className="text-sm font-medium flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-monero-blue-light" />
                        <span>P2P Network</span>
                      </h3>
                      <div className="grid grid-cols-1 gap-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Local Endpoint:</span>
                          <span className="font-medium font-mono">
                            {config.p2pBindIp}:{config.p2pBindPort}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">External Port:</span>
                          <span className="font-medium font-mono">{config.p2pExternalPort}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Incoming Connections:</span>
                          <span className="font-medium">
                            {Math.floor(statusInfo.connections / 2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Outgoing Connections:</span>
                          <span className="font-medium">
                            {Math.ceil(statusInfo.connections / 2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {config.zmqEnabled && (
                      <div className="space-y-2 border rounded-md p-3">
                        <h3 className="text-sm font-medium flex items-center space-x-2">
                          <Network className="h-4 w-4 text-monero-blue-light" />
                          <span>ZeroMQ Interface</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium text-green-400">Active</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Endpoint:</span>
                            <span className="font-medium font-mono">
                              {config.zmqBindIp}:{config.zmqPubPort}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Topic:</span>
                            <span className="font-medium font-mono">json</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {config.torEnabled && (
                  <TabsContent value="tor">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 border rounded-md p-3">
                          <h3 className="text-sm font-medium flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-monero-blue-light" />
                            <span>Tor Connection Status</span>
                          </h3>
                          <div className="grid grid-cols-1 gap-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Status:</span>
                              <span className={`font-medium ${torProxyRunning ? 'text-green-400' : 'text-red-400'}`}>
                                {torProxyRunning ? 'Connected' : 'Disconnected'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">SOCKS5 Proxy:</span>
                              <span className="font-medium font-mono">127.0.0.1:{config.torSocksPort || '9050'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">TX Proxy Level:</span>
                              <span className="font-medium">{config.txProxy ? config.txProxy.split(',')[2] || '10' : '10'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Onion Routing:</span>
                              <span className="font-medium">{config.torOnly ? 'Exclusive' : 'Mixed Network'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Executable:</span>
                              <span className="font-medium font-mono">{config.torPath.split('/').pop()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 border rounded-md p-3">
                          <h3 className="text-sm font-medium flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-monero-blue-light" />
                            <span>Tor Hidden Service</span>
                          </h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Status:</span>
                              <span className={`font-medium ${torProxyRunning && config.torOnionAddress ? 'text-green-400' : 'text-red-400'}`}>
                                {torProxyRunning && config.torOnionAddress ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="font-mono text-xs bg-black/40 p-2 rounded-md overflow-x-auto text-monero-blue-light break-all">
                              {config.torOnionAddress || "Not available yet. Start Tor to generate."}
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Service Port:</span>
                              <span className="font-medium">{config.p2pBindPort}</span>
                            </div>
                            {config.torOnionAddress && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full mt-1"
                                onClick={() => copyToClipboard(config.torOnionAddress, "Onion address")}
                              >
                                Copy Onion Address
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-md p-3">
                        <h3 className="text-sm font-medium mb-2">Tor Command Line</h3>
                        <div className="text-xs font-mono bg-black/50 p-2 rounded-md overflow-x-auto text-green-400">
                          {config.torPath} --config {config.torrcPath} --DataDirectory {config.torDataPath} --Log "notice file {config.torLogPath}"
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          This is the command used to start the Tor service.
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}

                {config.i2pEnabled && (
                  <TabsContent value="i2p">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 border rounded-md p-3">
                          <h3 className="text-sm font-medium flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-monero-blue-light" />
                            <span>I2P Connection Status</span>
                          </h3>
                          <div className="grid grid-cols-1 gap-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Status:</span>
                              <span className={`font-medium ${i2pProxyRunning ? 'text-green-400' : 'text-red-400'}`}>
                                {i2pProxyRunning ? 'Connected' : 'Disconnected'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">SAM Port:</span>
                              <span className="font-medium font-mono">127.0.0.1:{config.i2pSamPort || '7656'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Routing:</span>
                              <span className="font-medium">{config.i2pOnly ? 'Exclusive' : 'Mixed Network'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Executable:</span>
                              <span className="font-medium font-mono">{config.i2pPath.split('/').pop()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 border rounded-md p-3">
                          <h3 className="text-sm font-medium flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-monero-blue-light" />
                            <span>I2P Address</span>
                          </h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Status:</span>
                              <span className={`font-medium ${i2pProxyRunning && config.i2pAddress ? 'text-green-400' : 'text-red-400'}`}>
                                {i2pProxyRunning && config.i2pAddress ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="font-mono text-xs bg-black/40 p-2 rounded-md overflow-x-auto text-monero-blue-light break-all">
                              {config.i2pAddress || "Not available yet. Start I2P to generate."}
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Service Port:</span>
                              <span className="font-medium">{(config.anonymousInboundI2p || "").split(',')[0]?.split(':')[1] || '1'}</span>
                            </div>
                            {config.i2pAddress && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full mt-1"
                                onClick={() => copyToClipboard(config.i2pAddress, "I2P address")}
                              >
                                Copy I2P Address
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-md p-3">
                        <h3 className="text-sm font-medium mb-2">I2P Command Line</h3>
                        <div className="text-xs font-mono bg-black/50 p-2 rounded-md overflow-x-auto text-green-400">
                          {config.i2pPath} --datadir={config.i2pDataPath} --conf={config.i2pConfigPath} --tunconf={config.i2pTunnelsPath} --log={config.i2pLogPath}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          This is the command used to start the I2P service.
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default StatusTab;
