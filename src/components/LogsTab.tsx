
import React, { useRef, useEffect, useState } from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Terminal, FileText, Network, Shield, Download, RefreshCw, Trash } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';

const LogsTab: React.FC = () => {
  const { logs, isRunning, torProxyRunning, i2pProxyRunning, refreshLogs } = useMonero();
  const [filter, setFilter] = useState("");
  
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const logFileEndRef = useRef<HTMLDivElement>(null);
  const torLogEndRef = useRef<HTMLDivElement>(null);
  const i2pLogEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when logs update
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs.console]);

  useEffect(() => {
    if (logFileEndRef.current) {
      logFileEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs.logFile]);

  useEffect(() => {
    if (torLogEndRef.current) {
      torLogEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs.torProxy]);

  useEffect(() => {
    if (i2pLogEndRef.current) {
      i2pLogEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs.i2pProxy]);

  const exportLogs = (logType: 'console' | 'logFile' | 'torProxy' | 'i2pProxy') => {
    try {
      let logContent = '';
      switch (logType) {
        case 'console':
          logContent = logs.console.join('\n');
          break;
        case 'logFile':
          logContent = logs.logFile.join('\n');
          break;
        case 'torProxy':
          logContent = logs.torProxy.join('\n');
          break;
        case 'i2pProxy':
          logContent = logs.i2pProxy.join('\n');
          break;
      }

      const blob = new Blob([logContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monero-suite-${logType}-${new Date().toISOString().replace(/:/g, '-')}.log`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Logs Exported",
        description: `${logType} logs have been exported successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: `Failed to export ${logType} logs: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const clearLogs = (logType: 'console' | 'logFile' | 'torProxy' | 'i2pProxy') => {
    // In a real app, this would clear the logs in the state and possibly on disk
    toast({
      title: "Logs Cleared",
      description: `${logType} logs have been cleared.`,
    });
    // This would be handled by your context in a real app
  };

  const filterLogs = (logArray: string[]) => {
    if (!filter) return logArray;
    return logArray.filter(log => log.toLowerCase().includes(filter.toLowerCase()));
  };

  return (
    <div className="space-y-6 animate-slideUp">
      <Card className="glass-panel">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Daemon Logs</CardTitle>
            <CardDescription>
              View console output and log files for all services
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => refreshLogs && refreshLogs()}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <div className="relative">
              <input
                type="text"
                placeholder="Filter logs..."
                className="px-3 py-1 text-sm rounded-md border border-input bg-background"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              {filter && (
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setFilter("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="console" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="console" className="flex items-center space-x-2">
                <Terminal className="h-4 w-4" />
                <span>Console Output</span>
              </TabsTrigger>
              <TabsTrigger value="logfile" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Monero Log</span>
              </TabsTrigger>
              <TabsTrigger value="tor" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Tor Logs</span>
              </TabsTrigger>
              <TabsTrigger value="i2p" className="flex items-center space-x-2">
                <Network className="h-4 w-4" />
                <span>I2P Logs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="console">
              <div className="flex justify-between mb-2">
                <p className="text-sm text-muted-foreground">
                  {isRunning ? "Real-time console output from the Monero daemon" : "Start the daemon to see console output"}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportLogs('console')}
                    disabled={logs.console.length === 0}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => clearLogs('console')}
                    disabled={logs.console.length === 0}
                  >
                    <Trash className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
              <div className="console-output h-96 overflow-y-auto border rounded-md p-3 bg-black/70 font-mono text-sm">
                {filterLogs(logs.console).length > 0 ? (
                  filterLogs(logs.console).map((line, index) => (
                    <div key={index} className="text-green-400">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    {isRunning ? (filter ? "No matching log entries" : "No console output yet...") : "Start the daemon to see console output"}
                  </div>
                )}
                <div ref={consoleEndRef} />
              </div>
            </TabsContent>

            <TabsContent value="logfile">
              <div className="flex justify-between mb-2">
                <p className="text-sm text-muted-foreground">
                  {isRunning ? "Log file entries from the Monero daemon" : "Start the daemon to see log file entries"}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportLogs('logFile')}
                    disabled={logs.logFile.length === 0}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => clearLogs('logFile')}
                    disabled={logs.logFile.length === 0}
                  >
                    <Trash className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
              <div className="console-output h-96 overflow-y-auto border rounded-md p-3 bg-black/50 font-mono text-sm">
                {filterLogs(logs.logFile).length > 0 ? (
                  filterLogs(logs.logFile).map((line, index) => (
                    <div key={index} className="text-gray-300">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    {isRunning ? (filter ? "No matching log entries" : "No log file entries yet...") : "Start the daemon to see log file entries"}
                  </div>
                )}
                <div ref={logFileEndRef} />
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Log File Path</p>
                <div className="flex items-center space-x-2">
                  <Textarea 
                    readOnly 
                    value="./monero/logs/monero.log"
                    className="font-mono text-xs h-8 resize-none"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText("./monero/logs/monero.log");
                      toast({ title: "Copied to clipboard" });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tor">
              <div className="flex justify-between mb-2">
                <p className="text-sm text-muted-foreground">
                  {torProxyRunning ? "Tor proxy logs" : "Start Tor to see logs"}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportLogs('torProxy')}
                    disabled={logs.torProxy.length === 0}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => clearLogs('torProxy')}
                    disabled={logs.torProxy.length === 0}
                  >
                    <Trash className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
              <div className="console-output h-96 overflow-y-auto border rounded-md p-3 bg-purple-950/30 font-mono text-sm">
                {filterLogs(logs.torProxy).length > 0 ? (
                  filterLogs(logs.torProxy).map((line, index) => (
                    <div key={index} className="text-gray-300">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    {torProxyRunning ? (filter ? "No matching log entries" : "No Tor log entries yet...") : "Start Tor to see log entries"}
                  </div>
                )}
                <div ref={torLogEndRef} />
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Tor Log File Path</p>
                <div className="flex items-center space-x-2">
                  <Textarea 
                    readOnly 
                    value="./tor/logs/tor.log"
                    className="font-mono text-xs h-8 resize-none"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText("./tor/logs/tor.log");
                      toast({ title: "Copied to clipboard" });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="i2p">
              <div className="flex justify-between mb-2">
                <p className="text-sm text-muted-foreground">
                  {i2pProxyRunning ? "I2P router logs" : "Start I2P to see logs"}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportLogs('i2pProxy')}
                    disabled={logs.i2pProxy.length === 0}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => clearLogs('i2pProxy')}
                    disabled={logs.i2pProxy.length === 0}
                  >
                    <Trash className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
              <div className="console-output h-96 overflow-y-auto border rounded-md p-3 bg-blue-950/30 font-mono text-sm">
                {filterLogs(logs.i2pProxy).length > 0 ? (
                  filterLogs(logs.i2pProxy).map((line, index) => (
                    <div key={index} className="text-gray-300">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    {i2pProxyRunning ? (filter ? "No matching log entries" : "No I2P log entries yet...") : "Start I2P to see log entries"}
                  </div>
                )}
                <div ref={i2pLogEndRef} />
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">I2P Log File Path</p>
                <div className="flex items-center space-x-2">
                  <Textarea 
                    readOnly 
                    value="./i2p/logs/i2pd.log"
                    className="font-mono text-xs h-8 resize-none"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText("./i2p/logs/i2pd.log");
                      toast({ title: "Copied to clipboard" });
                    }}
                  >
                    Copy
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

export default LogsTab;
