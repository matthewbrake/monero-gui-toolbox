
import React, { useState, useEffect } from 'react';
import { useTorProxy } from '@/contexts/proxy/useTorProxyManager';
import { useI2pProxy } from '@/contexts/proxy/useI2pProxyManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Power, Shield, Check, X, Loader2, RefreshCw, 
  Network, Globe, Server, Activity, Link
} from 'lucide-react';
import { useLogsManager } from '@/contexts/logs/useLogsManager';

const ProxyTab: React.FC = () => {
  const { 
    torConfig, 
    setTorConfig, 
    torStatus, 
    startTor, 
    stopTor, 
    restartTor,
    getHiddenService,
    testTorConnection,
    testSocksConnection
  } = useTorProxy();

  const {
    i2pConfig,
    setI2pConfig,
    i2pStatus,
    startI2p,
    stopI2p,
    restartI2p,
    testI2pConnection,
    testSamConnection,
    testHttpProxyConnection,
    testSocksProxyConnection
  } = useI2pProxy();

  const { addLogEntry } = useLogsManager();

  const [torLoading, setTorLoading] = useState(false);
  const [i2pLoading, setI2pLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tor");
  
  // Connection test states
  const [torDirectStatus, setTorDirectStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [torSocksStatus, setTorSocksStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [i2pDirectStatus, setI2pDirectStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [i2pSamStatus, setI2pSamStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [i2pHttpStatus, setI2pHttpStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [i2pSocksStatus, setI2pSocksStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Tor hidden service state
  const [hiddenService, setHiddenService] = useState<string | null>(null);
  const [refreshingHs, setRefreshingHs] = useState(false);

  // Test Tor connection
  const handleTestTorConnection = async () => {
    setTorDirectStatus('testing');
    try {
      const result = await testTorConnection();
      if (result) {
        setTorDirectStatus('success');
        addLogEntry('tor', 'info', 'Tor direct connection test successful');
      } else {
        setTorDirectStatus('error');
        addLogEntry('tor', 'error', 'Tor direct connection test failed');
      }
    } catch (error) {
      setTorDirectStatus('error');
      addLogEntry('tor', 'error', `Tor direct connection test error: ${error}`);
    }
  };

  // Test Tor SOCKS connection
  const handleTestTorSocks = async () => {
    setTorSocksStatus('testing');
    try {
      const result = await testSocksConnection();
      if (result) {
        setTorSocksStatus('success');
        addLogEntry('tor', 'info', 'Tor SOCKS connection test successful');
      } else {
        setTorSocksStatus('error');
        addLogEntry('tor', 'error', 'Tor SOCKS connection test failed');
      }
    } catch (error) {
      setTorSocksStatus('error');
      addLogEntry('tor', 'error', `Tor SOCKS connection test error: ${error}`);
    }
  };

  // Test I2P connection
  const handleTestI2pConnection = async () => {
    setI2pDirectStatus('testing');
    try {
      const result = await testI2pConnection();
      if (result) {
        setI2pDirectStatus('success');
        addLogEntry('i2p', 'info', 'I2P direct connection test successful');
      } else {
        setI2pDirectStatus('error');
        addLogEntry('i2p', 'error', 'I2P direct connection test failed');
      }
    } catch (error) {
      setI2pDirectStatus('error');
      addLogEntry('i2p', 'error', `I2P direct connection test error: ${error}`);
    }
  };

  // Test I2P SAM connection
  const handleTestI2pSam = async () => {
    setI2pSamStatus('testing');
    try {
      const result = await testSamConnection();
      if (result) {
        setI2pSamStatus('success');
        addLogEntry('i2p', 'info', 'I2P SAM connection test successful');
      } else {
        setI2pSamStatus('error');
        addLogEntry('i2p', 'error', 'I2P SAM connection test failed');
      }
    } catch (error) {
      setI2pSamStatus('error');
      addLogEntry('i2p', 'error', `I2P SAM connection test error: ${error}`);
    }
  };

  // Test I2P HTTP Proxy connection
  const handleTestI2pHttpProxy = async () => {
    setI2pHttpStatus('testing');
    try {
      const result = await testHttpProxyConnection();
      if (result) {
        setI2pHttpStatus('success');
        addLogEntry('i2p', 'info', 'I2P HTTP proxy connection test successful');
      } else {
        setI2pHttpStatus('error');
        addLogEntry('i2p', 'error', 'I2P HTTP proxy connection test failed');
      }
    } catch (error) {
      setI2pHttpStatus('error');
      addLogEntry('i2p', 'error', `I2P HTTP proxy connection test error: ${error}`);
    }
  };

  // Test I2P SOCKS Proxy connection
  const handleTestI2pSocksProxy = async () => {
    setI2pSocksStatus('testing');
    try {
      const result = await testSocksProxyConnection();
      if (result) {
        setI2pSocksStatus('success');
        addLogEntry('i2p', 'info', 'I2P SOCKS proxy connection test successful');
      } else {
        setI2pSocksStatus('error');
        addLogEntry('i2p', 'error', 'I2P SOCKS proxy connection test failed');
      }
    } catch (error) {
      setI2pSocksStatus('error');
      addLogEntry('i2p', 'error', `I2P SOCKS proxy connection test error: ${error}`);
    }
  };

  // Handle Tor start/stop
  const handleTorToggle = async () => {
    setTorLoading(true);
    try {
      if (torStatus === 'running') {
        await stopTor();
        addLogEntry('tor', 'info', 'Tor service stopped');
      } else {
        await startTor();
        addLogEntry('tor', 'info', 'Tor service started');
      }
    } catch (error) {
      console.error('Failed to toggle Tor:', error);
      addLogEntry('tor', 'error', `Failed to toggle Tor: ${error}`);
    } finally {
      setTorLoading(false);
    }
  };

  // Handle I2P start/stop
  const handleI2pToggle = async () => {
    setI2pLoading(true);
    try {
      if (i2pStatus === 'running') {
        await stopI2p();
        addLogEntry('i2p', 'info', 'I2P service stopped');
      } else {
        await startI2p();
        addLogEntry('i2p', 'info', 'I2P service started');
      }
    } catch (error) {
      console.error('Failed to toggle I2P:', error);
      addLogEntry('i2p', 'error', `Failed to toggle I2P: ${error}`);
    } finally {
      setI2pLoading(false);
    }
  };

  // Get Tor hidden service info
  const fetchHiddenService = async () => {
    setRefreshingHs(true);
    try {
      const hsAddress = await getHiddenService();
      setHiddenService(hsAddress);
      if (hsAddress) {
        addLogEntry('tor', 'info', `Retrieved hidden service address: ${hsAddress}`);
      } else {
        addLogEntry('tor', 'warning', 'No hidden service address available');
      }
    } catch (error) {
      console.error('Failed to get hidden service:', error);
      addLogEntry('tor', 'error', `Failed to get hidden service: ${error}`);
    } finally {
      setRefreshingHs(false);
    }
  };

  // Handle TOR config change
  const handleTorConfigChange = (field: keyof typeof torConfig, value: string | boolean) => {
    setTorConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle I2P config change
  const handleI2pConfigChange = (field: keyof typeof i2pConfig, value: string | boolean) => {
    setI2pConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Load initial hidden service data
  useEffect(() => {
    if (torStatus === 'running') {
      fetchHiddenService();
    }
  }, [torStatus]);

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-green-500 hover:bg-green-600">Running</Badge>;
      case 'stopped':
        return <Badge variant="outline" className="border-red-500 text-red-500">Stopped</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  // Connection test status component
  const TestStatusIcon = ({ status }: { status: 'idle' | 'testing' | 'success' | 'error' }) => {
    switch (status) {
      case 'testing':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-slideUp">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Privacy Networks</CardTitle>
          <CardDescription>
            Configure and manage your Tor and I2P connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="tor" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Tor Network</span>
              </TabsTrigger>
              <TabsTrigger value="i2p" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                <span>I2P Network</span>
              </TabsTrigger>
            </TabsList>

            {/* TOR TAB */}
            <TabsContent value="tor" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">Tor Status</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage Tor proxy service
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={torStatus} />
                      <div className="h-5 w-px bg-border mx-1"></div>
                      <Button 
                        variant={torStatus === 'running' ? "destructive" : "default"}
                        size="sm"
                        disabled={torLoading}
                        onClick={handleTorToggle}
                        className="flex gap-1 items-center"
                      >
                        {torLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                        {torStatus === 'running' ? "Stop" : "Start"}
                      </Button>
                      {torStatus === 'running' && (
                        <Button 
                          variant="outline"
                          size="sm"
                          disabled={torLoading}
                          onClick={restartTor}
                          className="flex gap-1 items-center"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Service Address</Label>
                        <div className="text-sm text-muted-foreground">
                          127.0.0.1:{torConfig.socksPort}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex gap-1 items-center"
                          onClick={handleTestTorConnection}
                          disabled={torDirectStatus === 'testing'}
                        >
                          {torDirectStatus === 'testing' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Activity className="h-4 w-4" />
                          )}
                          Test Direct
                        </Button>
                        <TestStatusIcon status={torDirectStatus} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>SOCKS Proxy</Label>
                        <div className="text-sm text-muted-foreground">
                          socks5://127.0.0.1:{torConfig.socksPort}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex gap-1 items-center"
                          onClick={handleTestTorSocks}
                          disabled={torSocksStatus === 'testing'}
                        >
                          {torSocksStatus === 'testing' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Link className="h-4 w-4" />
                          )}
                          Test SOCKS
                        </Button>
                        <TestStatusIcon status={torSocksStatus} />
                      </div>
                    </div>

                    {torStatus === 'running' && (
                      <div className="border rounded-md p-3 bg-black/20">
                        <div className="flex justify-between items-center mb-2">
                          <Label>Tor Onion Address</Label>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1"
                            onClick={fetchHiddenService}
                            disabled={refreshingHs}
                          >
                            <RefreshCw className={`h-3 w-3 ${refreshingHs ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                          </Button>
                        </div>
                        <div className="font-mono text-xs bg-black/40 p-2 rounded-md overflow-x-auto text-monero-blue-light break-all">
                          {hiddenService || "Not available. Configure hidden service in torrc."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-4">Tor Configuration</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="socks-port">SOCKS Port</Label>
                      <Input
                        id="socks-port"
                        value={torConfig.socksPort}
                        onChange={(e) => handleTorConfigChange('socksPort', e.target.value)}
                        placeholder="9050"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="control-port">Control Port</Label>
                      <Input
                        id="control-port"
                        value={torConfig.controlPort}
                        onChange={(e) => handleTorConfigChange('controlPort', e.target.value)}
                        placeholder="9051"
                      />
                    </div>
                    <div className="flex items-center space-x-2 py-2">
                      <Switch
                        id="enable-control"
                        checked={torConfig.controlEnabled}
                        onCheckedChange={(value) => handleTorConfigChange('controlEnabled', value)}
                      />
                      <Label htmlFor="enable-control">Enable Control Port</Label>
                    </div>
                    {torConfig.controlEnabled && (
                      <div className="space-y-2">
                        <Label htmlFor="control-password">Control Password</Label>
                        <Input
                          id="control-password"
                          type="password"
                          value={torConfig.controlPassword}
                          onChange={(e) => handleTorConfigChange('controlPassword', e.target.value)}
                          placeholder="Password for Tor control port"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="torrc">Custom Torrc Settings</Label>
                      <Textarea
                        id="torrc"
                        value={torConfig.customSettings}
                        onChange={(e) => handleTorConfigChange('customSettings', e.target.value)}
                        placeholder="# Add custom Tor configuration here"
                        className="font-mono text-xs h-32"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* I2P TAB */}
            <TabsContent value="i2p" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">I2P Status</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage I2P router service
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={i2pStatus} />
                      <div className="h-5 w-px bg-border mx-1"></div>
                      <Button 
                        variant={i2pStatus === 'running' ? "destructive" : "default"}
                        size="sm"
                        disabled={i2pLoading}
                        onClick={handleI2pToggle}
                        className="flex gap-1 items-center"
                      >
                        {i2pLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                        {i2pStatus === 'running' ? "Stop" : "Start"}
                      </Button>
                      {i2pStatus === 'running' && (
                        <Button 
                          variant="outline"
                          size="sm"
                          disabled={i2pLoading}
                          onClick={restartI2p}
                          className="flex gap-1 items-center"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <Card className="border bg-black/10">
                    <CardHeader className="py-2 px-4">
                      <CardTitle className="text-sm font-medium">Connection Tests</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>I2P Router</Label>
                            <div className="text-sm text-muted-foreground">
                              127.0.0.1:{i2pConfig.routerPort}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex gap-1 items-center"
                              onClick={handleTestI2pConnection}
                              disabled={i2pDirectStatus === 'testing'}
                            >
                              {i2pDirectStatus === 'testing' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Activity className="h-4 w-4" />
                              )}
                              Test
                            </Button>
                            <TestStatusIcon status={i2pDirectStatus} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>SAM Bridge</Label>
                            <div className="text-sm text-muted-foreground">
                              127.0.0.1:{i2pConfig.samPort}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex gap-1 items-center"
                              onClick={handleTestI2pSam}
                              disabled={i2pSamStatus === 'testing'}
                            >
                              {i2pSamStatus === 'testing' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Server className="h-4 w-4" />
                              )}
                              Test
                            </Button>
                            <TestStatusIcon status={i2pSamStatus} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>HTTP Proxy</Label>
                            <div className="text-sm text-muted-foreground">
                              http://127.0.0.1:{i2pConfig.httpProxyPort}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex gap-1 items-center"
                              onClick={handleTestI2pHttpProxy}
                              disabled={i2pHttpStatus === 'testing'}
                            >
                              {i2pHttpStatus === 'testing' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Globe className="h-4 w-4" />
                              )}
                              Test
                            </Button>
                            <TestStatusIcon status={i2pHttpStatus} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>SOCKS Proxy</Label>
                            <div className="text-sm text-muted-foreground">
                              socks://127.0.0.1:{i2pConfig.socksProxyPort}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex gap-1 items-center"
                              onClick={handleTestI2pSocksProxy}
                              disabled={i2pSocksStatus === 'testing'}
                            >
                              {i2pSocksStatus === 'testing' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Link className="h-4 w-4" />
                              )}
                              Test
                            </Button>
                            <TestStatusIcon status={i2pSocksStatus} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-4">I2P Configuration</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="router-port">Router Console Port</Label>
                      <Input
                        id="router-port"
                        value={i2pConfig.routerPort}
                        onChange={(e) => handleI2pConfigChange('routerPort', e.target.value)}
                        placeholder="7070"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sam-port">SAM Bridge Port</Label>
                      <Input
                        id="sam-port"
                        value={i2pConfig.samPort}
                        onChange={(e) => handleI2pConfigChange('samPort', e.target.value)}
                        placeholder="7656"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="http-proxy-port">HTTP Proxy Port</Label>
                        <Input
                          id="http-proxy-port"
                          value={i2pConfig.httpProxyPort}
                          onChange={(e) => handleI2pConfigChange('httpProxyPort', e.target.value)}
                          placeholder="4444"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="socks-proxy-port">SOCKS Proxy Port</Label>
                        <Input
                          id="socks-proxy-port"
                          value={i2pConfig.socksProxyPort}
                          onChange={(e) => handleI2pConfigChange('socksProxyPort', e.target.value)}
                          placeholder="4447"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="i2p-custom">Custom I2P Settings</Label>
                      <Textarea
                        id="i2p-custom"
                        value={i2pConfig.customSettings}
                        onChange={(e) => handleI2pConfigChange('customSettings', e.target.value)}
                        placeholder="# Add custom I2P configuration here"
                        className="font-mono text-xs h-32"
                      />
                    </div>
                  </div>
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
