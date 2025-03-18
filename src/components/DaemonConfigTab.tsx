
import React, { useState } from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  ChevronRight, 
  Database, 
  ExternalLink, 
  Folder, 
  Globe, 
  HardDrive, 
  Network, 
  Save, 
  Settings, 
  Shield, 
  Terminal 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import MoneroBinaryConfig from './MoneroBinaryConfig';

const DaemonConfigTab: React.FC = () => {
  const { 
    config, 
    setConfig, 
    saveConfig, 
    testPaths, 
    showBinaryConfig, 
    setShowBinaryConfig 
  } = useMonero();
  
  const [showPrivacySettings, setShowPrivacySettings] = useState(true);
  const [showNetworkSettings, setShowNetworkSettings] = useState(true);
  const [showBlockchainSettings, setShowBlockchainSettings] = useState(true);

  const handleConfigChange = (field: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSwitch = (field: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

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

  return (
    <div className="space-y-6 animate-slideUp">
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daemon Configuration</CardTitle>
              <CardDescription>
                Configure your local Monero daemon
              </CardDescription>
            </div>
            <Button 
              onClick={saveConfig} 
              className="flex items-center space-x-2"
              variant="default"
            >
              <Save className="h-4 w-4" />
              <span>Save Configuration</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showBinaryConfig ? (
            <MoneroBinaryConfig />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-lg">Core Settings</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowBinaryConfig(true)}
                  className="flex items-center space-x-2"
                >
                  <Folder className="h-4 w-4" />
                  <span>Configure Binaries & Paths</span>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="daemon-listen-ip">Listen IP</Label>
                  <Input
                    id="daemon-listen-ip"
                    value={config.rpcBindIp}
                    onChange={(e) => handleConfigChange('rpcBindIp', e.target.value)}
                    placeholder="127.0.0.1"
                  />
                  <p className="text-xs text-muted-foreground">IP address for the RPC server to listen on</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="daemon-rpc-port">RPC Port</Label>
                  <Input
                    id="daemon-rpc-port"
                    value={config.rpcBindPort}
                    onChange={(e) => handleConfigChange('rpcBindPort', e.target.value)}
                    placeholder="18081"
                  />
                  <p className="text-xs text-muted-foreground">Port for the RPC server</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="p2p-bind-port">P2P Port</Label>
                  <Input
                    id="p2p-bind-port"
                    value={config.p2pBindPort}
                    onChange={(e) => handleConfigChange('p2pBindPort', e.target.value)}
                    placeholder="18080"
                  />
                  <p className="text-xs text-muted-foreground">Port to use for peer-to-peer network</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zmq-port">ZMQ Port</Label>
                  <Input
                    id="zmq-port"
                    value={config.zmqPort}
                    onChange={(e) => handleConfigChange('zmqPort', e.target.value)}
                    placeholder="18082"
                  />
                  <p className="text-xs text-muted-foreground">Port for ZMQ pub/sub notifications</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-connections">Max Connections</Label>
                  <Input
                    id="max-connections"
                    value={config.maxConcurrentConnections}
                    onChange={(e) => handleConfigChange('maxConcurrentConnections', e.target.value)}
                    placeholder="8"
                  />
                  <p className="text-xs text-muted-foreground">Maximum number of concurrent RPC connections</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="log-level">Log Level</Label>
                  <Input
                    id="log-level"
                    value={config.logLevel}
                    onChange={(e) => handleConfigChange('logLevel', e.target.value)}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">Log level (0-4, higher = more verbose)</p>
                </div>
              </div>

              <Separator />

              <Collapsible open={showPrivacySettings} onOpenChange={setShowPrivacySettings}>
                <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-secondary/20 p-2 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                    <h3 className="font-medium text-lg">Privacy Settings</h3>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${showPrivacySettings ? 'rotate-90' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tor-enabled"
                          checked={config.torEnabled}
                          onCheckedChange={() => toggleSwitch('torEnabled')}
                        />
                        <Label htmlFor="tor-enabled">Enable Tor Support</Label>
                      </div>
                      
                      {config.torEnabled && (
                        <div className="space-y-4 pl-6 border-l-2 border-purple-900/40">
                          <div className="space-y-2">
                            <Label htmlFor="tor-socks-port">Tor SOCKS Port</Label>
                            <Input
                              id="tor-socks-port"
                              value={config.torSocksPort}
                              onChange={(e) => handleConfigChange('torSocksPort', e.target.value)}
                              placeholder="9050"
                            />
                            <p className="text-xs text-muted-foreground">Port for Tor SOCKS proxy</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="tor-inbound">Tor Anonymous Inbound</Label>
                            <Input
                              id="tor-inbound"
                              value={config.anonymousInboundTor}
                              onChange={(e) => handleConfigChange('anonymousInboundTor', e.target.value)}
                              placeholder="127.0.0.1:18083"
                            />
                            <p className="text-xs text-muted-foreground">
                              Format: IP:PORT[,max_connections]
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="i2p-enabled"
                          checked={config.i2pEnabled}
                          onCheckedChange={() => toggleSwitch('i2pEnabled')}
                        />
                        <Label htmlFor="i2p-enabled">Enable I2P Support</Label>
                      </div>
                      
                      {config.i2pEnabled && (
                        <div className="space-y-4 pl-6 border-l-2 border-blue-900/40">
                          <div className="space-y-2">
                            <Label htmlFor="i2p-socks-port">I2P SAM Port</Label>
                            <Input
                              id="i2p-socks-port"
                              value={config.i2pSamPort}
                              onChange={(e) => handleConfigChange('i2pSamPort', e.target.value)}
                              placeholder="7656"
                            />
                            <p className="text-xs text-muted-foreground">Port for I2P SAM interface</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="i2p-inbound">I2P Anonymous Inbound</Label>
                            <Input
                              id="i2p-inbound"
                              value={config.anonymousInboundI2p}
                              onChange={(e) => handleConfigChange('anonymousInboundI2p', e.target.value)}
                              placeholder="127.0.0.1:18085"
                            />
                            <p className="text-xs text-muted-foreground">
                              Format: IP:PORT[,max_connections]
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="disable-dns-checkpoints"
                        checked={config.disableDnsCheckpoints}
                        onCheckedChange={() => toggleSwitch('disableDnsCheckpoints')}
                      />
                      <Label htmlFor="disable-dns-checkpoints">Disable DNS Checkpoints</Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-7">
                      Disable DNS checkpoints for enhanced privacy (may slow initial sync)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="no-igd"
                        checked={config.noIgd}
                        onCheckedChange={() => toggleSwitch('noIgd')}
                      />
                      <Label htmlFor="no-igd">Disable UPnP Port Mapping</Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-7">
                      Disable UPnP port mapping for enhanced privacy
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              <Collapsible open={showNetworkSettings} onOpenChange={setShowNetworkSettings}>
                <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-secondary/20 p-2 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Network className="h-5 w-5 text-blue-400" />
                    <h3 className="font-medium text-lg">Network Settings</h3>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${showNetworkSettings ? 'rotate-90' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-peer">Add Peer</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="add-peer"
                          value={config.addPeer || ""}
                          onChange={(e) => handleConfigChange('addPeer', e.target.value)}
                          placeholder="node.example.com:18080"
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            // This would add the peer to a list in a real implementation
                            toast({
                              title: "Peer Added",
                              description: "Peer will be added on next daemon start",
                            });
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Add a peer to connect to</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seed-node">Seed Node</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="seed-node"
                          value={config.seedNode || ""}
                          onChange={(e) => handleConfigChange('seedNode', e.target.value)}
                          placeholder="seeds.example.com:18080"
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            // This would add the seed node to a list in a real implementation
                            toast({
                              title: "Seed Node Added",
                              description: "Seed node will be added on next daemon start",
                            });
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Add a seed node to connect to</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="out-peers">Outgoing Peers Limit</Label>
                    <Input
                      id="out-peers"
                      value={config.outPeers || ""}
                      onChange={(e) => handleConfigChange('outPeers', e.target.value)}
                      placeholder="8"
                    />
                    <p className="text-xs text-muted-foreground">Max number of outgoing peers</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="in-peers">Incoming Peers Limit</Label>
                    <Input
                      id="in-peers"
                      value={config.inPeers || ""}
                      onChange={(e) => handleConfigChange('inPeers', e.target.value)}
                      placeholder="32"
                    />
                    <p className="text-xs text-muted-foreground">Max number of incoming peers</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="limit-rate">Bandwidth Limit (kB/s)</Label>
                    <Input
                      id="limit-rate"
                      value={config.limitRate || ""}
                      onChange={(e) => handleConfigChange('limitRate', e.target.value)}
                      placeholder="2048"
                    />
                    <p className="text-xs text-muted-foreground">Limit download/upload rate</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              <Collapsible open={showBlockchainSettings} onOpenChange={setShowBlockchainSettings}>
                <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-secondary/20 p-2 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-green-400" />
                    <h3 className="font-medium text-lg">Blockchain Settings</h3>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${showBlockchainSettings ? 'rotate-90' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="data-dir">Blockchain Location</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="data-dir"
                        value={config.dataDir}
                        onChange={(e) => handleConfigChange('dataDir', e.target.value)}
                        placeholder="/path/to/blockchain"
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => browsePath('dataDir')}
                      >
                        <Folder className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Directory to store blockchain data</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pruning"
                        checked={config.pruning}
                        onCheckedChange={() => toggleSwitch('pruning')}
                      />
                      <Label htmlFor="pruning">Enable Blockchain Pruning</Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-7">
                      Reduce blockchain size (cannot serve full historical data)
                    </p>
                  </div>
                  
                  {config.pruning && (
                    <div className="space-y-2 pl-7">
                      <Label htmlFor="prune-size">Pruning Size (GB)</Label>
                      <Input
                        id="prune-size"
                        value={config.pruneSize || ""}
                        onChange={(e) => handleConfigChange('pruneSize', e.target.value)}
                        placeholder="2"
                      />
                      <p className="text-xs text-muted-foreground">Pruning size in GB</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="fast-sync"
                        checked={config.fastSync}
                        onCheckedChange={() => toggleSwitch('fastSync')}
                      />
                      <Label htmlFor="fast-sync">Enable Fast Sync</Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-7">
                      Sync faster with trusted peers (less verification)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="offline"
                        checked={config.offline}
                        onCheckedChange={() => toggleSwitch('offline')}
                      />
                      <Label htmlFor="offline">Offline Mode</Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-7">
                      Do not connect to the Monero network
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Terminal className="h-5 w-5 text-amber-400" />
                  <h3 className="font-medium text-lg">Additional Command Line Options</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="extra-args">Extra Arguments</Label>
                  <Textarea
                    id="extra-args"
                    value={config.extraArgs}
                    onChange={(e) => handleConfigChange('extraArgs', e.target.value)}
                    placeholder="--arg1 value1 --arg2 value2"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Additional command line arguments to pass to monerod
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="bg-black/20 p-3 rounded-md">
                  <div className="font-medium mb-2">Final Command Preview:</div>
                  <ScrollArea className="h-20 w-full rounded-md bg-black/30 p-2">
                    <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap">
                      {config.moneroPath} --data-dir={config.dataDir}
                      {config.rpcBindIp ? ` --rpc-bind-ip=${config.rpcBindIp}` : ''}
                      {config.rpcBindPort ? ` --rpc-bind-port=${config.rpcBindPort}` : ''}
                      {config.p2pBindPort ? ` --p2p-bind-port=${config.p2pBindPort}` : ''}
                      {config.zmqPort ? ` --zmq-pub tcp://127.0.0.1:${config.zmqPort}` : ''}
                      {config.maxConcurrentConnections ? ` --rpc-max-concurrency=${config.maxConcurrentConnections}` : ''}
                      {config.logLevel ? ` --log-level=${config.logLevel}` : ''}
                      {config.torEnabled ? ` --tx-proxy=tor,${config.torSocksPort || '9050'},10` : ''}
                      {config.anonymousInboundTor ? ` --anonymous-inbound=${config.anonymousInboundTor},127.0.0.1,2` : ''}
                      {config.i2pEnabled ? ` --tx-proxy=i2p,${config.i2pSamPort || '7656'},10` : ''}
                      {config.anonymousInboundI2p ? ` --anonymous-inbound=${config.anonymousInboundI2p},127.0.0.1,3` : ''}
                      {config.disableDnsCheckpoints ? ' --no-dns' : ''}
                      {config.noIgd ? ' --no-igd' : ''}
                      {config.addPeer ? ` --add-peer=${config.addPeer}` : ''}
                      {config.seedNode ? ` --seed-node=${config.seedNode}` : ''}
                      {config.outPeers ? ` --out-peers=${config.outPeers}` : ''}
                      {config.inPeers ? ` --in-peers=${config.inPeers}` : ''}
                      {config.limitRate ? ` --limit-rate=${config.limitRate}` : ''}
                      {config.pruning ? ' --prune-blockchain' : ''}
                      {config.pruning && config.pruneSize ? ` --prune-blockchain-size=${config.pruneSize}` : ''}
                      {config.fastSync ? ' --fast-block-sync=1' : ''}
                      {config.offline ? ' --offline' : ''}
                      {config.extraArgs ? ` ${config.extraArgs}` : ''}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
          
          {showBinaryConfig && (
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowBinaryConfig(false)}
                className="flex items-center space-x-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                <span>Back to Configuration</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DaemonConfigTab;
