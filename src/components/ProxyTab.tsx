import React from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { useTorProxyManager } from '@/contexts/proxy/useTorProxyManager';
import { useI2pProxyManager } from '@/contexts/proxy/useI2pProxyManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  AlertTriangle, 
  ArrowUpRight, 
  Check, 
  Cog, 
  Folder, 
  Globe, 
  Key, 
  Lock, 
  Network, 
  Play, 
  Power, 
  RefreshCw, 
  Save, 
  Server, 
  Shield, 
  Square, 
  Terminal, 
  X, 
  Zap 
} from 'lucide-react';

const ProxyTab: React.FC = () => {
  const { 
    config, 
    setConfig, 
    torProxyRunning, 
    i2pProxyRunning, 
    startTorProxy, 
    stopTorProxy, 
    startI2PProxy, 
    stopI2PProxy,
    testRpcCommand
  } = useMonero();

  const handleConfigChange = (field: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6 animate-slideUp">
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Proxy Configuration</CardTitle>
              <CardDescription>
                Configure Tor and I2P proxy settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="tor" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="tor" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Tor Proxy</span>
              </TabsTrigger>
              <TabsTrigger value="i2p" className="flex items-center space-x-2">
                <Network className="h-4 w-4" />
                <span>I2P Proxy</span>
              </TabsTrigger>
            </TabsList>
            
            {/* TOR TAB */}
            <TabsContent value="tor" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  <h3 className="font-medium text-lg">Tor Proxy Settings</h3>
                </div>
                <Button 
                  variant={torProxyRunning ? "destructive" : "outline"}
                  onClick={torProxyRunning ? stopTorProxy : startTorProxy}
                  disabled={!config.torEnabled}
                >
                  {torProxyRunning ? (
                    <>
                      <Power className="h-4 w-4 mr-2" />
                      Stop Tor Proxy
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Tor Proxy
                    </>
                  )}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tor-path">Tor Executable Path</Label>
                  <Input
                    id="tor-path"
                    value={config.torPath}
                    onChange={(e) => handleConfigChange('torPath', e.target.value)}
                    placeholder="./tor/tor.exe"
                  />
                  <p className="text-xs text-muted-foreground">Path to the Tor executable</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="torrc-path">Torrc Path</Label>
                  <Input
                    id="torrc-path"
                    value={config.torrcPath}
                    onChange={(e) => handleConfigChange('torrcPath', e.target.value)}
                    placeholder="./tor/torrc"
                  />
                  <p className="text-xs text-muted-foreground">Path to the Torrc configuration file</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tor-data-path">Tor Data Directory</Label>
                  <Input
                    id="tor-data-path"
                    value={config.torDataPath}
                    onChange={(e) => handleConfigChange('torDataPath', e.target.value)}
                    placeholder="./tor/data"
                  />
                  <p className="text-xs text-muted-foreground">Directory to store Tor data</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tor-socks-port">Tor SOCKS Port</Label>
                  <Input
                    id="tor-socks-port"
                    value={config.torSocksPort}
                    onChange={(e) => handleConfigChange('torSocksPort', e.target.value)}
                    placeholder="9050"
                  />
                  <p className="text-xs text-muted-foreground">Port for the Tor SOCKS proxy</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tor-log-path">Tor Log Path</Label>
                <Input
                  id="tor-log-path"
                  value={config.torLogPath}
                  onChange={(e) => handleConfigChange('torLogPath', e.target.value)}
                  placeholder="./tor/logs/tor.log"
                />
                <p className="text-xs text-muted-foreground">Path to the Tor log file</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Test Tor Connectivity</h4>
                  <Button variant="outline" size="sm" onClick={() => testRpcCommand('tor')}>
                    Test Connectivity
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* I2P TAB */}
            <TabsContent value="i2p" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Network className="h-5 w-5 text-blue-400" />
                  <h3 className="font-medium text-lg">I2P Proxy Settings</h3>
                </div>
                <Button
                  variant={i2pProxyRunning ? "destructive" : "outline"}
                  onClick={i2pProxyRunning ? stopI2PProxy : startI2PProxy}
                  disabled={!config.i2pEnabled}
                >
                  {i2pProxyRunning ? (
                    <>
                      <Power className="h-4 w-4 mr-2" />
                      Stop I2P Proxy
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start I2P Proxy
                    </>
                  )}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="i2p-path">I2P Executable Path</Label>
                  <Input
                    id="i2p-path"
                    value={config.i2pPath}
                    onChange={(e) => handleConfigChange('i2pPath', e.target.value)}
                    placeholder="./i2p/i2p.exe"
                  />
                  <p className="text-xs text-muted-foreground">Path to the I2P executable</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="i2p-config-path">I2P Config Path</Label>
                  <Input
                    id="i2p-config-path"
                    value={config.i2pConfigPath}
                    onChange={(e) => handleConfigChange('i2pConfigPath', e.target.value)}
                    placeholder="./i2p/config/i2pd.conf"
                  />
                  <p className="text-xs text-muted-foreground">Path to the I2P config file</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="i2p-tunnels-path">I2P Tunnels Path</Label>
                  <Input
                    id="i2p-tunnels-path"
                    value={config.i2pTunnelsPath}
                    onChange={(e) => handleConfigChange('i2pTunnelsPath', e.target.value)}
                    placeholder="./i2p/config/tunnels.conf"
                  />
                  <p className="text-xs text-muted-foreground">Path to the I2P tunnels config</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="i2p-data-path">I2P Data Directory</Label>
                  <Input
                    id="i2p-data-path"
                    value={config.i2pDataPath}
                    onChange={(e) => handleConfigChange('i2pDataPath', e.target.value)}
                    placeholder="./i2p/data"
                  />
                  <p className="text-xs text-muted-foreground">Directory to store I2P data</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="i2p-log-path">I2P Log Path</Label>
                <Input
                  id="i2p-log-path"
                  value={config.i2pLogPath}
                  onChange={(e) => handleConfigChange('i2pLogPath', e.target.value)}
                  placeholder="./i2p/logs/i2pd.log"
                />
                <p className="text-xs text-muted-foreground">Path to the I2P log file</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Test I2P Connectivity</h4>
                  <Button variant="outline" size="sm" onClick={() => testRpcCommand('i2p')}>
                    Test Connectivity
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProxyTab;
