
import React from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Folder } from 'lucide-react';
import { generateCommandLine, getFilePath } from '@/utils/moneroUtils';

const ConfigTab: React.FC = () => {
  const { config, setConfig } = useMonero();

  const handleToggle = (field: keyof typeof config) => {
    setConfig((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof typeof config, value: string | number) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
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
          <Tabs defaultValue="network" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="network" className="space-y-5">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="rpc-toggle" className="font-medium">RPC Interface</Label>
                    <p className="text-sm text-muted-foreground">Enable JSON-RPC server</p>
                  </div>
                  <Switch id="rpc-toggle" checked={config.rpcEnabled} onCheckedChange={() => handleToggle('rpcEnabled')} />
                </div>

                {config.rpcEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pl-6 border-l-2 border-border">
                    <div className="space-y-2">
                      <Label htmlFor="rpc-bind-ip">RPC Bind IP</Label>
                      <Input
                        id="rpc-bind-ip"
                        value={config.rpcBindIp}
                        onChange={(e) => handleChange('rpcBindIp', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rpc-bind-port">RPC Bind Port</Label>
                      <Input
                        id="rpc-bind-port"
                        value={config.rpcBindPort}
                        onChange={(e) => handleChange('rpcBindPort', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-3 col-span-2">
                      <Switch id="restrict-rpc" checked={config.restrictRpc} onCheckedChange={() => handleToggle('restrictRpc')} />
                      <div>
                        <Label htmlFor="restrict-rpc" className="font-medium">Restrict RPC</Label>
                        <p className="text-sm text-muted-foreground">Restrict RPC to view-only commands</p>
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="rpc-login">RPC Login (username:password)</Label>
                      <Input
                        id="rpc-login"
                        value={config.rpcLogin}
                        onChange={(e) => handleChange('rpcLogin', e.target.value)}
                        placeholder="Optional: username:password"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <h3 className="text-base font-medium mb-3">P2P Network Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="p2p-bind-ip">P2P Bind IP</Label>
                      <Input
                        id="p2p-bind-ip"
                        value={config.p2pBindIp}
                        onChange={(e) => handleChange('p2pBindIp', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p2p-bind-port">P2P Bind Port</Label>
                      <Input
                        id="p2p-bind-port"
                        value={config.p2pBindPort}
                        onChange={(e) => handleChange('p2pBindPort', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p2p-external-port">P2P External Port</Label>
                      <Input
                        id="p2p-external-port"
                        value={config.p2pExternalPort}
                        onChange={(e) => handleChange('p2pExternalPort', e.target.value)}
                      />
                    </div>
                    <div className="space-y-4 col-span-2">
                      <div className="flex items-center space-x-3">
                        <Switch id="hide-port" checked={config.hideMyPort} onCheckedChange={() => handleToggle('hideMyPort')} />
                        <Label htmlFor="hide-port">Hide My Port</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch id="no-igd" checked={config.noIgd} onCheckedChange={() => handleToggle('noIgd')} />
                        <Label htmlFor="no-igd">Disable UPnP Port Mapping</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-5">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tor-toggle" className="font-medium">Tor Integration</Label>
                    <p className="text-sm text-muted-foreground">Route transactions through Tor network</p>
                  </div>
                  <Switch id="tor-toggle" checked={config.torEnabled} onCheckedChange={() => handleToggle('torEnabled')} />
                </div>

                {config.torEnabled && (
                  <div className="grid grid-cols-1 gap-4 mt-2 pl-6 border-l-2 border-border">
                    <div className="space-y-2">
                      <Label htmlFor="tor-path">Tor Executable Path</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="tor-path"
                          value={config.torPath}
                          onChange={(e) => handleChange('torPath', e.target.value)}
                          className="flex-1"
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
                        />
                        <Button variant="outline" onClick={() => browsePath('torrcPath')} size="icon">
                          <Folder className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <Label htmlFor="i2p-toggle" className="font-medium">I2P Integration</Label>
                    <p className="text-sm text-muted-foreground">Enable I2P anonymous networking</p>
                  </div>
                  <Switch id="i2p-toggle" checked={config.i2pEnabled} onCheckedChange={() => handleToggle('i2pEnabled')} />
                </div>

                {config.i2pEnabled && (
                  <div className="grid grid-cols-1 gap-4 mt-2 pl-6 border-l-2 border-border">
                    <div className="space-y-2">
                      <Label htmlFor="i2p-path">I2P Path</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="i2p-path"
                          value={config.i2pPath}
                          onChange={(e) => handleChange('i2pPath', e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="outline" onClick={() => browsePath('i2pPath')} size="icon">
                          <Folder className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="blockchain" className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data-dir">Blockchain Data Directory</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="data-dir"
                      value={config.dataDir}
                      onChange={(e) => handleChange('dataDir', e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={() => browsePath('dataDir')} size="icon">
                      <Folder className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <Label htmlFor="pruning-toggle" className="font-medium">Blockchain Pruning</Label>
                    <p className="text-sm text-muted-foreground">Reduce blockchain storage size</p>
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
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-5">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="zmq-toggle" className="font-medium">ZeroMQ Interface</Label>
                    <p className="text-sm text-muted-foreground">Enable ZMQ pub interface</p>
                  </div>
                  <Switch id="zmq-toggle" checked={config.zmqEnabled} onCheckedChange={() => handleToggle('zmqEnabled')} />
                </div>

                {config.zmqEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pl-6 border-l-2 border-border">
                    <div className="space-y-2">
                      <Label htmlFor="zmq-bind-ip">ZMQ Bind IP</Label>
                      <Input
                        id="zmq-bind-ip"
                        value={config.zmqBindIp}
                        onChange={(e) => handleChange('zmqBindIp', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zmq-pub-port">ZMQ Pub Port</Label>
                      <Input
                        id="zmq-pub-port"
                        value={config.zmqPubPort}
                        onChange={(e) => handleChange('zmqPubPort', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border space-y-4">
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
                    <Label htmlFor="no-console">Disable Console Output (Log to File Only)</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-concurrency">Max Concurrency</Label>
                    <Input
                      id="max-concurrency"
                      type="number"
                      value={config.maxConcurrency}
                      onChange={(e) => handleChange('maxConcurrency', e.target.value)}
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
                      <option value="fast">Fast</option>
                      <option value="safe">Safe</option>
                      <option value="fastest">Fastest</option>
                    </select>
                  </div>
                </div>
              </div>
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
