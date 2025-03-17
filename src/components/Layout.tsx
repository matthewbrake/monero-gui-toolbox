
import React from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, Square, Save, Upload, Network, Shield, HardDrive } from 'lucide-react';
import ConfigTab from './ConfigTab';
import StatusTab from './StatusTab';
import LogsTab from './LogsTab';
import MoneroBinaryConfig from './MoneroBinaryConfig';

const Layout: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isRunning, 
    startNode, 
    stopNode, 
    saveConfig, 
    loadConfig,
    torProxyRunning,
    i2pProxyRunning,
    startTorProxy,
    stopTorProxy,
    startI2PProxy,
    stopI2PProxy,
    showBinaryConfig,
    setShowBinaryConfig
  } = useMonero();

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col animate-fadeIn">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Monero Suite</h1>
          <p className="text-muted-foreground">Portable Daemon Management Tool</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowBinaryConfig(true)}
            variant="outline"
            className="flex items-center space-x-2 hover-glow"
          >
            <HardDrive className="h-4 w-4" />
            <span>Binary Paths</span>
          </Button>
          
          <Button
            onClick={saveConfig}
            variant="outline"
            className="flex items-center space-x-2 hover-glow"
          >
            <Save className="h-4 w-4" />
            <span>Save Config</span>
          </Button>
          <Button
            onClick={() => loadConfig()}
            variant="outline"
            className="flex items-center space-x-2 hover-glow"
          >
            <Upload className="h-4 w-4" />
            <span>Load Config</span>
          </Button>
          
          {/* Tor Proxy Controls */}
          {torProxyRunning ? (
            <Button
              onClick={stopTorProxy}
              variant="destructive"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>Stop Tor</span>
            </Button>
          ) : (
            <Button
              onClick={startTorProxy}
              variant="default"
              size="sm"
              className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-800"
            >
              <Shield className="h-4 w-4" />
              <span>Start Tor</span>
            </Button>
          )}
          
          {/* I2P Proxy Controls */}
          {i2pProxyRunning ? (
            <Button
              onClick={stopI2PProxy}
              variant="destructive"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Network className="h-4 w-4" />
              <span>Stop I2P</span>
            </Button>
          ) : (
            <Button
              onClick={startI2PProxy}
              variant="default"
              size="sm"
              className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800"
            >
              <Network className="h-4 w-4" />
              <span>Start I2P</span>
            </Button>
          )}
          
          {/* Monero Daemon Controls */}
          {isRunning ? (
            <Button
              onClick={stopNode}
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <Square className="h-4 w-4" />
              <span>Stop Node</span>
            </Button>
          ) : (
            <Button
              onClick={startNode}
              variant="default"
              className="flex items-center space-x-2 bg-monero-blue hover:bg-monero-blue/90"
            >
              <Play className="h-4 w-4" />
              <span>Start Node</span>
            </Button>
          )}
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="tab-transition tab-active">
          <ConfigTab />
        </TabsContent>

        <TabsContent value="status" className="tab-transition tab-active">
          <StatusTab />
        </TabsContent>

        <TabsContent value="logs" className="tab-transition tab-active">
          <LogsTab />
        </TabsContent>
      </Tabs>

      <footer className="mt-6 text-center text-muted-foreground text-sm">
        <p>Monero Suite GUI - Portable Edition</p>
      </footer>

      {/* Modal for configuring binary paths */}
      {showBinaryConfig && <MoneroBinaryConfig />}
    </div>
  );
};

export default Layout;
