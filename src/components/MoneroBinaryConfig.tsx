
import React, { useState } from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, HardDrive, Shield, Network } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const MoneroBinaryConfig: React.FC = () => {
  const { 
    config, 
    setConfig, 
    showBinaryConfig, 
    setShowBinaryConfig,
    testPaths
  } = useMonero();

  const [localConfig, setLocalConfig] = useState({
    moneroPath: config.moneroPath || './bin/monerod',
    // Tor settings
    torPath: config.torPath || './tor/tor.exe',
    torrcPath: config.torrcPath || './tor/torrc',
    torDataPath: config.torDataPath || './tor/data',
    torLogPath: config.torLogPath || './tor/logs/tor.log',
    // I2P settings
    i2pPath: config.i2pPath || './i2p/i2p.exe',
    i2pDataPath: config.i2pDataPath || './i2p/data',
    i2pConfigPath: config.i2pConfigPath || './i2p/config/i2pd.conf',
    i2pTunnelsPath: config.i2pTunnelsPath || './i2p/config/tunnels.conf',
    i2pLogPath: config.i2pLogPath || './i2p/logs/i2pd.log',
  });

  const browsePath = async (field: keyof typeof localConfig) => {
    try {
      const { getFilePath } = await import('@/utils/moneroUtils');
      const path = await getFilePath();
      if (path) {
        setLocalConfig((prev) => ({ ...prev, [field]: path }));
      }
    } catch (error) {
      console.error('Failed to get file path:', error);
    }
  };

  const handleSave = () => {
    setConfig(prev => ({ 
      ...prev, 
      moneroPath: localConfig.moneroPath,
      // Tor settings
      torPath: localConfig.torPath,
      torrcPath: localConfig.torrcPath,
      torDataPath: localConfig.torDataPath,
      torLogPath: localConfig.torLogPath,
      // I2P settings
      i2pPath: localConfig.i2pPath,
      i2pDataPath: localConfig.i2pDataPath,
      i2pConfigPath: localConfig.i2pConfigPath,
      i2pTunnelsPath: localConfig.i2pTunnelsPath,
      i2pLogPath: localConfig.i2pLogPath,
    }));
    
    // Test if paths exist and are executable
    if (typeof testPaths === 'function') {
      testPaths();
    }
    
    setShowBinaryConfig(false);
  };

  return (
    <Dialog open={showBinaryConfig} onOpenChange={setShowBinaryConfig}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Binary and Configuration Paths
          </DialogTitle>
          <DialogDescription>
            Set paths to executables and configuration files for Monero and proxy services.
            The base directory (./) is relative to where you run the application.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Ensure all binaries are secure, verified, and from trusted sources. Never run unknown executables.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="monero" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="monero">Monero</TabsTrigger>
            <TabsTrigger value="tor">Tor</TabsTrigger>
            <TabsTrigger value="i2p">I2P</TabsTrigger>
          </TabsList>

          {/* Monero Tab */}
          <TabsContent value="monero">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monero-path">Monero Daemon (monerod) Path</Label>
                <div className="flex space-x-2">
                  <Input
                    id="monero-path"
                    value={localConfig.moneroPath}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, moneroPath: e.target.value }))}
                    placeholder="./bin/monerod"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => browsePath('moneroPath')} size="icon">
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Path to the Monero daemon executable</p>
              </div>

              <div className="bg-secondary/50 p-3 rounded-md">
                <div className="text-sm font-medium mb-2">Default Directory Structure</div>
                <div className="text-xs font-mono space-y-1">
                  <div>./bin/</div>
                  <div className="ml-4">./win/monerod.exe - Windows binary</div>
                  <div className="ml-4">./linux/monerod - Linux binary</div>
                  <div>./blockchain/ - Blockchain data</div>
                  <div>./configs/ - Configuration files</div>
                  <div>./logs/ - Log files</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tor Tab */}
          <TabsContent value="tor">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tor-path">Tor Executable Path</Label>
                <div className="flex space-x-2">
                  <Input
                    id="tor-path"
                    value={localConfig.torPath}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, torPath: e.target.value }))}
                    placeholder="./tor/tor.exe"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => browsePath('torPath')} size="icon">
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Path to the Tor executable</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="torrc-path">Torrc Configuration Path</Label>
                <div className="flex space-x-2">
                  <Input
                    id="torrc-path"
                    value={localConfig.torrcPath}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, torrcPath: e.target.value }))}
                    placeholder="./tor/torrc"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => browsePath('torrcPath')} size="icon">
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Path to the Tor configuration file</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tor-data-path">Tor Data Directory</Label>
                <div className="flex space-x-2">
                  <Input
                    id="tor-data-path"
                    value={localConfig.torDataPath}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, torDataPath: e.target.value }))}
                    placeholder="./tor/data"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => browsePath('torDataPath')} size="icon">
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Directory where Tor stores its data</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tor-log-path">Tor Log File</Label>
                <div className="flex space-x-2">
                  <Input
                    id="tor-log-path"
                    value={localConfig.torLogPath}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, torLogPath: e.target.value }))}
                    placeholder="./tor/logs/tor.log"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => browsePath('torLogPath')} size="icon">
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Path to the Tor log file</p>
              </div>

              <div className="bg-secondary/50 p-3 rounded-md">
                <div className="text-sm font-medium mb-2">Tor Command Construction</div>
                <div className="text-xs font-mono bg-black/30 p-2 rounded-md overflow-x-auto">
                  {localConfig.torPath} --config {localConfig.torrcPath} --DataDirectory {localConfig.torDataPath} --Log "notice file {localConfig.torLogPath}"
                </div>
              </div>
            </div>
          </TabsContent>

          {/* I2P Tab */}
          <TabsContent value="i2p">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="i2p-path">I2P Executable Path</Label>
                <div className="flex space-x-2">
                  <Input
                    id="i2p-path"
                    value={localConfig.i2pPath}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, i2pPath: e.target.value }))}
                    placeholder="./i2p/i2pd.exe"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => browsePath('i2pPath')} size="icon">
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Path to the I2P daemon executable</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="i2p-config-path">I2P Configuration Path</Label>
                <div className="flex space-x-2">
                  <Input
                    id="i2p-config-path"
                    value={localConfig.i2pConfigPath}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, i2pConfigPath: e.target.value }))}
                    placeholder="./i2p/config/i2pd.conf"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => browsePath('i2pConfigPath')} size="icon">
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Path to the I2P main configuration file</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="i2p-tunnels-path">I2P Tunnels Configuration</Label>
                <div className="flex space-x-2">
                  <Input
                    id="i2p-tunnels-path"
                    value={localConfig.i2pTunnelsPath}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, i2pTunnelsPath: e.target.value }))}
                    placeholder="./i2p/config/tunnels.conf"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => browsePath('i2pTunnelsPath')} size="icon">
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Path to the I2P tunnels configuration file</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="i2p-data-path">I2P Data Directory</Label>
                <div className="flex space-x-2">
                  <Input
                    id="i2p-data-path"
                    value={localConfig.i2pDataPath}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, i2pDataPath: e.target.value }))}
                    placeholder="./i2p/data"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => browsePath('i2pDataPath')} size="icon">
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Directory where I2P stores its data</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="i2p-log-path">I2P Log File</Label>
                <div className="flex space-x-2">
                  <Input
                    id="i2p-log-path"
                    value={localConfig.i2pLogPath}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, i2pLogPath: e.target.value }))}
                    placeholder="./i2p/logs/i2pd.log"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => browsePath('i2pLogPath')} size="icon">
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Path to the I2P log file</p>
              </div>

              <div className="bg-secondary/50 p-3 rounded-md">
                <div className="text-sm font-medium mb-2">I2P Command Construction</div>
                <div className="text-xs font-mono bg-black/30 p-2 rounded-md overflow-x-auto">
                  {localConfig.i2pPath} --datadir={localConfig.i2pDataPath} --conf={localConfig.i2pConfigPath} --tunconf={localConfig.i2pTunnelsPath} --log={localConfig.i2pLogPath}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="bg-secondary/30 p-3 rounded-md text-xs text-muted-foreground">
          <p>Note: When specifying paths:</p>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li>Relative paths (starting with "./") are relative to the application's root directory.</li>
            <li>Absolute paths (e.g., "C:/Monero/...") can also be used.</li>
            <li>All directories will be created if they don't exist when the services are started.</li>
          </ul>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowBinaryConfig(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-monero-blue hover:bg-monero-blue/90">Save Paths</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoneroBinaryConfig;
