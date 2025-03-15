import React from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Activity, Server, Database, Network, Clock, Globe, Wifi, Shield, ExternalLink } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const StatusTab: React.FC = () => {
  const { isRunning, statusInfo, config } = useMonero();

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
                                className="w-full flex items-center justify-center space-x-1 text-xs"
                              >
                                <span>Test Connection</span>
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
                              <span className="font-medium text-green-400">Connected</span>
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
                              <span className="font-medium text-green-400">Active</span>
                            </div>
                            <div className="font-mono text-xs bg-black/40 p-2 rounded-md overflow-x-auto text-monero-blue-light">
                              {config.torOnionAddress || "abcdefghijklmnopqrstuvwxyz234567.onion"}
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Service Port:</span>
                              <span className="font-medium">{config.p2pBindPort}</span>
                            </div>
                            <Button size="sm" variant="outline" className="w-full mt-1">Copy Onion Address</Button>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-md p-3">
                        <h3 className="text-sm font-medium mb-2">Tor Network Connectivity Test</h3>
                        <div className="text-xs font-mono bg-black/50 text-green-400 p-2 rounded-md h-16 overflow-auto">
                          $ curl --socks5-hostname 127.0.0.1:9050 https://check.torproject.org/api/ip<br/>
                          &#123;"IsTor":true,"IP":"198.51.100.123"&#125;
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button size="sm" variant="outline">Run Test</Button>
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
                              <span className="font-medium text-green-400">Connected</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">SAM Port:</span>
                              <span className="font-medium font-mono">127.0.0.1:{config.i2pSamPort || '7656'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Routing:</span>
                              <span className="font-medium">{config.i2pOnly ? 'Exclusive' : 'Mixed Network'}</span>
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
                              <span className="font-medium text-green-400">Active</span>
                            </div>
                            <div className="font-mono text-xs bg-black/40 p-2 rounded-md overflow-x-auto text-monero-blue-light break-all">
                              {config.i2pAddress || "abcdefghijklmnopqrstuvwxyz234567abcdefghijklmnopqrst.b32.i2p"}
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Service Port:</span>
                              <span className="font-medium">{(config.anonymousInboundI2p || "").split(',')[0]?.split(':')[1] || '1'}</span>
                            </div>
                            <Button size="sm" variant="outline" className="w-full mt-1">Copy I2P Address</Button>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-md p-3">
                        <h3 className="text-sm font-medium mb-2">I2P Network Connectivity Test</h3>
                        <div className="text-xs font-mono bg-black/50 text-green-400 p-2 rounded-md h-16 overflow-auto">
                          $ printf "%s.b32.i2p\n" $(head -c 391 ./i2p/data/monerod.dat | sha256sum |xxd -r -p | base32 | sed s/=//g | tr A-Z a-z)<br/>
                          abcdefghijklmnopqrstuvwxyz234567abcdefghijklmnopqrst.b32.i2p
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button size="sm" variant="outline">Run Test</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Network Map</CardTitle>
              <CardDescription>
                Connected peers and geographic distribution
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center bg-monero-gray-darkest/50 rounded-md">
              <p className="text-muted-foreground italic">Network visualization would be shown here</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default StatusTab;
