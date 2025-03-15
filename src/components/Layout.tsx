
import React from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, Square, Save, Upload } from 'lucide-react';
import ConfigTab from './ConfigTab';
import StatusTab from './StatusTab';
import LogsTab from './LogsTab';

const Layout: React.FC = () => {
  const { activeTab, setActiveTab, isRunning, startNode, stopNode, saveConfig, loadConfig } = useMonero();

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col animate-fadeIn">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Monero Suite</h1>
          <p className="text-muted-foreground">Portable Daemon Management Tool</p>
        </div>
        <div className="flex space-x-3">
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
    </div>
  );
};

export default Layout;
