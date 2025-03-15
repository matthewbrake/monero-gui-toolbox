
import React from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Folder, ChevronDown, ChevronUp, RefreshCw, 
  Shield, Globe, Zap, Server, Settings
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { generateCommandLine, getFilePath } from '@/utils/moneroUtils';

const ConfigTab: React.FC = () => {
  const { config, setConfig } = useMonero();
  const [openSections, setOpenSections] = React.useState({
    general: true,
    blockchain: false,
    rpc: false,
    p2p: false,
    tor: config.torEnabled,
    i2p: config.i2pEnabled,
    zmq: false,
    misc: false
  });

  const handleToggle = (field: keyof typeof config) => {
    setConfig((prev) => ({ ...prev, [field]: !prev[field] }));
    
    // Auto-open sections when enabled
    if (field === 'torEnabled' && !config.torEnabled) {
      setOpenSections(prev => ({ ...prev, tor: true }));
    }
    if (field === 'i2pEnabled' && !config.i2pEnabled) {
      setOpenSections(prev => ({ ...prev, i2p: true }));
    }
    if (field === 'zmqEnabled' && !config.zmqEnabled) {
      setOpenSections(prev => ({ ...prev, zmq: true }));
    }
  };

  const handleChange = (field: keyof typeof config, value: string | number) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const browsePath = async (field: keyof typeof config) => {
    try {
      const path = await getFilePath();
      if (path) {
        handleChange(field, path);
      }
    } catch (error) {
      console.error('Failed to get file path:', error);
    }
  };

  return (
    <div className="space-y-6 animate-slideUp">
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle>Daemon Configuration</CardTitle>
          <CardDescription>
            Configure your Monero daemon settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="network" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Network</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Advanced</span>
              </TabsTrigger>
            </TabsList>

            {/* GENERAL TAB */}
            <TabsContent value="general" className="space-y-4">
              {/* General Settings */}
              <Collapsible 
                open={openSections.general} 
                onOpenChange={() => toggleSection('general')}
                className="border rounded-md"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/20">
                  <div className="font-medium flex items-center gap-2">
                    <Settings className="h-5 w-5" /> 
                    General Settings
                  </div>
                  {openSections.general ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 border-t">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="data-dir">Blockchain Data Directory</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="data-dir"
                          value={config.dataDir}
                          onChange={(e) => handleChange('dataDir', e.target.value)}
                          className="flex-1"
                          placeholder="./blockchain"
                        />
                        <Button variant="outline" onClick={() => browsePath('dataDir')} size="icon">
                          <Folder className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="log-level">Log Level</Label>
                        <span className="text-sm text-muted-foreground">{config.logLevel}</span>
                      </div>
                      <Slider
                        id="log-level"
                        min={0}
                        max={4}
                        step={1}
                        value={[config.logLevel]}
                        onValueChange={(value) => handleChange('logLevel', value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Minimal</span>
                        <span>Normal</span>
                        <span>Detailed</span>
                        <span>Debug</span>
                        <span>Trace</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Switch id="no-console" checked={config.noConsoleLog} onCheckedChange={() => handleToggle('noConsoleLog')} />
                      <Label htmlFor="no-console">Log to File Only (No Console Output)</Label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="max-log-file-size">Max Log File Size (bytes)</Label>
                        <Input
                          id="max-log-file-size"
                          value={config.maxLogFileSize}
                          onChange={(e) => handleChange('maxLogFileSize', e.target.value)}
                          placeholder="104850000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-log-files">Max Log Files</Label>
                        <Input
                          id="max-log-files"
                          value={config.maxLogFiles}
                          onChange={(e) => handleChange('maxLogFiles', e.target.value)}
                          placeholder="50"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <h3 className="text-sm font-semibold mb-3">Security & Checkpoints</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Switch id="enforce-checkpoints" checked={config.enforceCheckpoints} onCheckedChange={() => handleToggle('enforceCheckpoints')} />
                          <div>
                            <Label htmlFor="enforce-checkpoints" className="font-medium">Enforce DNS Checkpoints</Label>
                            <p className="text-xs text-muted-foreground">Enforce centrally provided checkpoints (safer)</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Switch id="disable-checkpoints" checked={config.disableCheckpoints} onCheckedChange={() => handleToggle('disableCheckpoints')} />
                          <div>
                            <Label htmlFor="disable-checkpoints" className="font-medium">Disable DNS Checkpoints</Label>
                            <p className="text-xs text-muted-foreground">Disable all centrally provided checkpoints</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Switch id="enable-dns-blocklist" checked={config.enableDnsBlocklist} onCheckedChange={() => handleToggle('enableDnsBlocklist')} />
                          <div>
                            <Label htmlFor="enable-dns-blocklist" className="font-medium">Enable DNS Blocklist</Label>
                            <p className="text-xs text-muted-foreground">Use centrally maintained blocklist for known malicious IPs</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ban-list">Ban List File</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="ban-list"
                              value={config.banList}
                              onChange={(e) => handleChange('banList', e.target.value)}
                              placeholder="./ban-list.txt"
                              className="flex-1"
                            />
                            <Button variant="outline" onClick={() => browsePath('banList')} size="icon">
                              <Folder className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Blockchain Settings */}
              <Collapsible 
                open={openSections.blockchain} 
                onOpenChange={() => toggleSection('blockchain')}
                className="border rounded-md"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/20">
                  <div className="font-medium flex items-center gap-2">
                    <Server className="h-5 w-5" /> 
                    Blockchain Settings
                  </div>
                  {openSections.blockchain ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 border-t">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pruning-toggle" className="font-medium">Blockchain Pruning</Label>
                        <p className="text-sm text-muted-foreground">Reduce blockchain storage (1/3 of full size)</p>
                      </div>
                      <Switch id="pruning-toggle" checked={config.pruning} onCheckedChange={() => handleToggle('pruning')} />
                    </div>

                    {config.pruning && (
                      <div className="pl-6 border-l-2 border-border space-y-2">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="pruning-size">Pruning Size</Label>
                            <span className="text-sm text-muted-foreground">{config.pruningSize}</span>
                          </div>
                          <Input
                            id="pruning-size"
                            type="number"
                            value={config.pruningSize}
                            onChange={(e) => handleChange('pruningSize', e.target.value)}
                            placeholder="1000"
                          />
                        </div>
                        <div className="flex items-center space-x-3">
                          <Switch id="sync-pruned-blocks" checked={config.syncPrunedBlocks} onCheckedChange={() => handleToggle('syncPrunedBlocks')} />
                          <div>
                            <Label htmlFor="sync-pruned-blocks" className="font-medium">Sync Pruned Blocks</Label>
                            <p className="text-xs text-muted-foreground">Faster syncing with pruned nodes</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="block-sync-size">Block Sync Size</Label>
                        <Input
                          id="block-sync-size"
                          type="number" 
                          value={config.blockSyncSize}
                          onChange={(e) => handleChange('blockSyncSize', e.target.value)}
                          placeholder="10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="db-sync-mode">Database Sync Mode</Label>
                        <select
                          id="db-sync-mode"
                          value={config.dbSyncMode}
                          onChange={(e) => handleChange('dbSyncMode', e.target.value)}
                          className="w-full input-field"
                        >
                          <option value="fast">Fast (Recommended)</option>
                          <option value="safe">Safe (Slower but safer)</option>
                          <option value="fastest">Fastest (Risky)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-3">
                        <Switch id="fast-block-sync" checked={config.fastBlockSync} onCheckedChange={() => handleToggle('fastBlockSync')} />
                        <Label htmlFor="fast-block-sync">Fast Block Sync (Skip POW Validation)</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="check-updates">Check for Updates</Label>
                        <select
                          id="check-updates"
                          value={config.checkUpdates}
                          onChange={(e) => handleChange('checkUpdates', e.target.value)}
                          className="w-full input-field"
                        >
                          <option value="enabled">Enabled</option>
                          <option value="auto">Auto-update</option>
                          <option value="disabled">Disabled</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Switch id="bootstrap-daemon-address" checked={config.useBootstrapDaemon} onCheckedChange={() => handleToggle('useBootstrapDaemon')} />
                        <Label htmlFor="bootstrap-daemon-address">Use Bootstrap Daemon</Label>
                      </div>
                      {config.useBootstrapDaemon && (
                        <div className="pl-6 border-l-2 border-border">
                          <div className="space-y-2">
                            <Label htmlFor="bootstrap-daemon-address-input">Bootstrap Daemon Address</Label>
                            <Input 
                              id="bootstrap-daemon-address-input"
                              value={config.bootstrapDaemonAddress}
                              onChange={(e) => handleChange('bootstrapDaemonAddress', e.target.value)}
                              placeholder="node.moneroworld.com:18089"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            {/* NETWORK TAB */}
            <TabsContent value="network" className="space-y-4">
              {/* RPC Interface Section */}
              <Collapsible 
                open={openSections.rpc} 
                onOpenChange={() => toggleSection('rpc')}
                className="border rounded-md"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/20">
                  <div className="font-medium flex items-center gap-2">
                    <Server className="h-5 w-5" /> 
                    RPC Interface
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="rpc-toggle" checked={config.rpcEnabled} onCheckedChange={() => handleToggle('rpcEnabled')} onClick={(e) => e.stopPropagation()} />
                    {openSections.rpc ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 border-t">
                  {config.rpcEnabled && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rpc-bind-ip">RPC Bind IP</Label>
                          <Input
                            id="rpc-bind-ip"
                            value={config.rpcBindIp}
                            onChange={(e) => handleChange('rpcBindIp', e.target.value)}
                            placeholder="127.0.0.1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rpc-bind-port">RPC Bind Port</Label>
                          <Input
                            id="rpc-bind-port"
                            value={config.rpcBindPort}
                            onChange={(e) => handleChange('rpcBindPort', e.target.value)}
                            placeholder="18081"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch id="restrict-rpc" checked={config.restrictRpc} onCheckedChange={() => handleToggle('restrictRpc')} />
                        <div>
                          <Label htmlFor="restrict-rpc" className="font-medium">Restrict RPC</Label>
                          <p className="text-sm text-muted-foreground">Restrict RPC to view-only commands</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch id="public-node" checked={config.publicNode} onCheckedChange={() => handleToggle('publicNode')} />
                        <div>
                          <Label htmlFor="public-node" className="font-medium">Public Node</Label>
                          <p className="text-sm text-muted-foreground">Advertise this as a public node</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rpc-login">RPC Login (username:password)</Label>
                        <Input
                          id="rpc-login"
                          value={config.rpcLogin}
                          onChange={(e) => handleChange('rpcLogin', e.target.value)}
                          placeholder="Optional: username:password"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch id="rpc-ssl" checked={config.rpcSsl} onCheckedChange={() => handleToggle('rpcSsl')} />
                        <div>
                          <Label htmlFor="rpc-ssl" className="font-medium">Enable SSL</Label>
                          <p className="text-sm text-muted-foreground">Use SSL for RPC connections</p>
                        </div>
                      </div>
                      {config.rpcSsl && (
                        <div className="grid grid-cols-1 gap-4 pl-6 border-l-2 border-border">
                          <div className="space-y-2">
                            <Label htmlFor="rpc-ssl-cert">SSL Certificate Path</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="rpc-ssl-cert"
                                value={config.rpcSslCert}
                                onChange={(e) => handleChange('rpcSslCert', e.target.value)}
                                placeholder="./certs/cert.pem"
                                className="flex-1"
                              />
                              <Button variant="outline" onClick={() => browsePath('rpcSslCert')} size="icon">
                                <Folder className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rpc-ssl-key">SSL Key Path</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="rpc-ssl-key"
                                value={config.rpcSslKey}
                                onChange={(e) => handleChange('rpcSslKey', e.target.value)}
                                placeholder="./certs/key.pem"
                                className="flex-1"
                              />
                              <Button variant="outline" onClick={() => browsePath('rpcSslKey')} size="icon">
                                <Folder className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <Switch id="confirm-external-bind" checked={config.confirmExternalBind} onCheckedChange={() => handleToggle('confirmExternalBind')} />
                        <Label htmlFor="confirm-external-bind">Confirm External Bind</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch id="rpc-payment-allow-free-loopback" checked={config.rpcPaymentAllowFreeLoopback} onCheckedChange={() => handleToggle('rpcPaymentAllowFreeLoopback')} />
                        <Label htmlFor="rpc-payment-allow-free-loopback">Allow Free Loopback Access</Label>
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* P2P Network Section */}
              <Collapsible 
                open={openSections.p2p} 
                onOpenChange={() => toggleSection('p2p')}
                className="border rounded-md"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/20">
                  <div className="font-medium flex items-center gap-2">
                    <Globe className="h-5 w-5" /> 
                    P2P Network Settings
                  </div>
                  {openSections.p2p ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 border-t">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="p2p-bind-ip">P2P Bind IP</Label>
                        <Input
                          id="p2p-bind-ip"
                          value={config.p2pBindIp}
                          onChange={(e) => handleChange('p2pBindIp', e.target.value)}
                          placeholder="0.0.0.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="p2p-bind-port">P2P Bind Port</Label>
                        <Input
                          id="p2p-bind-port"
                          value={config.p2pBindPort}
                          onChange={(e) => handleChange('p2pBindPort', e.target.value)}
                          placeholder="18080"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="p2p-external-port">P2P External Port</Label>
                        <Input
                          id="p2p-external-port"
                          value={config.p2pExternalPort}
                          onChange={(e) => handleChange('p2pExternalPort', e.target.value)}
                          placeholder="18080"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="out-peers">Max Outgoing Peers</Label>
                        <Input
                          id="out-peers"
                          value={config.outPeers}
                          onChange={(e) => handleChange('outPeers', e.target.value)}
                          placeholder="12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="in-peers">Max Incoming Peers</Label>
                        <Input
                          id="in-peers"
                          value={config.inPeers}
                          onChange={(e) => handleChange('inPeers', e.target.value)}
                          placeholder="-1"
                        />
                        <p className="text-xs text-muted-foreground">Use -1 for unlimited</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-priority-node">Add Priority Node</Label>
                        <Input
                          id="add-priority-node"
                          value={config.addPriorityNode}
                          onChange={(e) => handleChange('addPriorityNode', e.target.value)}
                          placeholder="node.example.com:18080"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-exclusive-node">Add Exclusive Node</Label>
                        <Input
                          id="add-exclusive-node"
                          value={config.addExclusiveNode}
                          onChange={(e) => handleChange('addExclusiveNode', e.target.value)}
                          placeholder="node.example.com:18080"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seed-node">Seed Node</Label>
                        <Input
                          id="seed-node"
                          value={config.seedNode}
                          onChange={(e) => handleChange('seedNode', e.target.value)}
                          placeholder="seed.example.com:18080"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <h3 className="text-sm font-semibold mb-3">Bandwidth Limits</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="limit-rate">Overall Limit (kB/s)</Label>
                          <Input
                            id="limit-rate"
                            type="number"
                            value={config.limitRate}
                            onChange={(e) => handleChange('limitRate', e.target.value)}
                            placeholder="1024"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="limit-rate-up">Upload Limit (kB/s)</Label>
                          <Input
                            id="limit-rate-up"
                            type="number"
                            value={config.limitRateUp}
                            onChange={(e) => handleChange('limitRateUp', e.target.value)}
                            placeholder="2048"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="limit-rate-down">Download Limit (kB/s)</Label>
                          <Input
                            id="limit-rate-down"
                            type="number"
                            value={config.limitRateDown}
                            onChange={(e) => handleChange('limitRateDown', e.target.value)}
                            placeholder="8192"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center space-x-3">
                        <Switch id="hide-port" checked={config.hideMyPort} onCheckedChange={() => handleToggle('hideMyPort')} />
                        <Label htmlFor="hide-port">Hide My Port</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch id="no-igd" checked={config.noIgd} onCheckedChange={() => handleToggle('noIgd')} />
                        <Label htmlFor="no-igd">Disable UPnP Port Mapping</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch id="offline" checked={config.offline} onCheckedChange={() => handleToggle('offline')} />
                        <Label htmlFor="offline">Offline Mode</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch id="allow-local-ip" checked={config.allowLocalIp} onCheckedChange={() => handleToggle('allowLocalIp')} />
                        <Label htmlFor="allow-local-ip">Allow Local IP</Label>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* ZMQ Settings */}
              <Collapsible 
                open={openSections.zmq} 
                onOpenChange={() => toggleSection('zmq')}
                className="border rounded-md"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/20">
                  <div className="font-medium flex items-center gap-2">
                    <Zap className="h-5 w-5" /> 
                    ZeroMQ Interface
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="zmq-toggle" checked={config.zmqEnabled} onCheckedChange={() => handleToggle('zmqEnabled')} onClick={(e) => e.stopPropagation()} />
                    {openSections.zmq ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 border-t">
                  {config.zmqEnabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zmq-bind-ip">ZMQ Bind IP</Label>
                          <Input
                            id="zmq-bind-ip"
                            value={config.zmqBindIp}
                            onChange={(e) => handleChange('zmqBindIp', e.target.value)}
                            placeholder="127.0.0.1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zmq-pub-port">ZMQ Pub Port</Label>
                          <Input
                            id="zmq-pub-port"
                            value={config.zmqPubPort}
                            onChange={(e) => handleChange('zmqPubPort', e.target.value)}
                            placeholder="18082"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch id="no-zmq" checked={config.noZmq} onCheckedChange={() => handleToggle('noZmq')} />
                        <div>
                          <Label htmlFor="no-zmq" className="font-medium">Disable ZMQ RPC Server</Label>
                          <p className="text-xs text-muted-foreground">Disables separate ZMQ RPC server</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            {/* PRIVACY TAB */}
            <TabsContent value="privacy" className="space-y-4">
              {/* Tor Integration */}
              <Collapsible 
                open={openSections.tor} 
                onOpenChange={() => toggleSection('tor')}
                className="border rounded-md"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/20">
                  <div className="font-medium flex items-center gap-2">
                    <Shield className="h-5 w-5" /> 
                    Tor Integration
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="tor-toggle" checked={config.torEnabled} onCheckedChange={() => handleToggle('torEnabled')} onClick={(e) => e.stopPropagation()} />
                    {openSections.tor ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 border-t">
                  {config.torEnabled && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="tor-path">Tor Executable Path</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="tor-path"
                            value={config.torPath}
                            onChange={(e) => handleChange('torPath', e.target.value)}
                            className="flex-1"
                            placeholder="./tor/tor.exe"
                          />
                          <Button variant="outline" onClick={() => browsePath('torPath')} size="icon">
                            <Folder className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="torrc-path">Torrc Configuration Path</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="torrc-path"
                            value={config.torrcPath}
                            onChange={(e) => handleChange('torrcPath', e.target.value)}
                            className="flex-1"
                            placeholder="./tor/torrc"
                          />
                          <Button variant="outline" onClick={() => browsePath('torrcPath')} size="icon">
                            <Folder className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tor-data-path">Tor Data Directory</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="tor-data-path"
                            value={config.torDataPath}
                            onChange={(e) => handleChange('torDataPath', e.target.value)}
                            className="flex-1"
                            placeholder="./tor/data"
                          />
                          <Button variant="outline" onClick={() => browsePath('torDataPath')} size="icon">
                            <Folder className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tx-proxy">TX Proxy</Label>
                          <Input
                            id="tx-proxy"
                            value={config.txProxy}
                            onChange={(e) => handleChange('txProxy', e.target.value)}
                            placeholder="tor,127.0.0.1:9050,10"
                          />
                          <p className="text-xs text-muted-foreground">Format: type,address:port,level</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tor-socks-port">Tor SOCKS Port</Label>
                          <Input
                            id="tor-socks-port"
                            value={config.torSocksPort}
                            onChange={(e) => handleChange('torSocksPort', e.target.value)}
                            placeholder="9050"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="anonymous-inbound-tor">Anonymous Inbound</Label>
                        <Input
                          id="anonymous-inbound-tor"
                          value={config.anonymousInboundTor}
                          onChange={(e) => handleChange('anonymousInboundTor', e.target.value)}
                          placeholder="youraddress.onion:18083,127.0.0.1:18183,16"
                        />
                        <p className="text-xs text-muted-foreground">Format: address.onion:port,local_ip:local_port,max_connections</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center space-x-3">
                          <Switch id="tor-only" checked={config.torOnly} onCheckedChange={() => handleToggle('torOnly')} />
                          <Label htmlFor="tor-only">Tor Only</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Switch id="pad-transactions" checked={config.padTransactions} onCheckedChange={() => handleToggle('padTransactions')} />
                          <Label htmlFor="pad-transactions">Pad Transactions</Label>
                        </div>
                      </div>
                      <div className="border rounded-md p-3 bg-black/20">
                        <div className="flex justify-between items-center mb-2">
                          <Label>Tor Onion Address</Label>
                          <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <RefreshCw className="h-3 w-3" />
                            <span>Refresh</span>
                          </Button>
                        </div>
                        <div className="font-mono text-xs bg-black/40 p-2 rounded-md overflow-x-auto text-monero-blue-light">
                          {config.torOnionAddress || "Not available. Start daemon to generate."}
                        </div>
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* I2P Integration */}
              <Collapsible 
                open={openSections.i2p} 
                onOpenChange={() => toggleSection('i2p')}
                className="border rounded-md"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/20">
                  <div className="font-medium flex items-center gap-2">
                    <Shield className="h-5 w-5" /> 
                    I2P Integration
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="i2p-toggle" checked={config.i2pEnabled} onCheckedChange={() => handleToggle('i2pEnabled')} onClick={(e) => e.stopPropagation()} />
                    {openSections.i2p ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 border-t">
                  {config.i2pEnabled && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="i2p-path">I2P Executable Path</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="i2p-path"
                            value={config.i2pPath}
                            onChange={(e) => handleChange('i2pPath', e.target.value)}
                            className="flex-1"
                            placeholder="./i2p/i2p.exe"
                          />
                          <Button variant="outline" onClick={() => browsePath('i2pPath')} size="icon">
                            <Folder className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="i2p-data-path">I2P Data Directory</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="i2p-data-path"
                            value={config.i2pDataPath}
                            onChange={(e) => handleChange('i2pDataPath', e.target.value)}
                            className="flex-1"
                            placeholder="./i2p/data"
                          />
                          <Button variant="outline" onClick={() => browsePath('i2pDataPath')} size="icon">
                            <Folder className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="i2p-sam-port">I2P SAM Port</Label>
                        <Input
                          id="i2p-sam-port"
                          value={config.i2pSamPort}
                          onChange={(e) => handleChange('i2pSamPort', e.target.value)}
                          placeholder="7656"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="i2p-proxy">I2P Proxy</Label>
                        <Input
                          id="i2p-proxy"
                          value={config.i2pProxy}
                          onChange={(e) => handleChange('i2pProxy', e.target.value)}
                          placeholder="i2p,127.0.0.1:4447"
                        />
                        <p className="text-xs text-muted-foreground">Format: type,address:port</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="anonymous-inbound-i2p">Anonymous Inbound</Label>
                        <Input
                          id="anonymous-inbound-i2p"
                          value={config.anonymousInboundI2p}
                          onChange={(e) => handleChange('anonymousInboundI2p', e.target.value)}
                          placeholder="youraddress.b32.i2p:80,127.0.0.1:18283,16"
                        />
                        <p className="text-xs text-muted-foreground">Format: address.b32.i2p:port,local_ip:local_port,max_connections</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch id="i2p-only" checked={config.i2pOnly} onCheckedChange={() => handleToggle('i2pOnly')} />
                        <Label htmlFor="i2p-only">I2P Only</Label>
                      </div>
                      <div className="border rounded-md p-3 bg-black/20">
                        <div className="flex justify-between items-center mb-2">
                          <Label>I2P Address</Label>
                          <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <RefreshCw className="h-3 w-3" />
                            <span>Refresh</span>
                          </Button>
                        </div>
                        <div className="font-mono text-xs bg-black/40 p-2 rounded-md overflow-x-auto text-monero-blue-light">
                          {config.i2pAddress || "Not available. Start daemon to generate."}
                        </div>
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            {/* ADVANCED TAB */}
            <TabsContent value="advanced" className="space-y-4">
              {/* Miscellaneous Settings */}
              <Collapsible 
                open={openSections.misc} 
                onOpenChange={() => toggleSection('misc')}
                className="border rounded-md"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/20">
                  <div className="font-medium flex items-center gap-2">
                    <Settings className="h-5 w-5" /> 
                    Performance & Resources
                  </div>
                  {openSections.misc ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 border-t">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-concurrency">Max Concurrency</Label>
                      <Input
                        id="max-concurrency"
                        type="number"
                        value={config.maxConcurrency}
                        onChange={(e) => handleChange('maxConcurrency', e.target.value)}
                        placeholder="4"
                      />
                      <p className="text-xs text-muted-foreground">Set to 0 to use number of CPU threads</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Command Preview</CardTitle>
          <CardDescription>
            Generated command line for monerod.exe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black/70 p-4 rounded-md overflow-x-auto">
            <code className="text-monero-blue-light whitespace-pre-wrap break-all font-mono text-sm">
              {generateCommandLine(config)}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigTab;
