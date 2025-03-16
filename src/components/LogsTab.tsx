
import React, { useRef, useEffect } from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Terminal, FileText, Network, Shield } from 'lucide-react';

const LogsTab: React.FC = () => {
  const { logs, isRunning, torProxyRunning, i2pProxyRunning } = useMonero();
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

  return (
    <div className="space-y-6 animate-slideUp">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Daemon Logs</CardTitle>
          <CardDescription>
            View console output and log files for all services
          </CardDescription>
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
                <span>Log File</span>
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
              <div className="console-output">
                {logs.console.length > 0 ? (
                  logs.console.map((line, index) => (
                    <div key={index} className="font-mono text-sm text-green-400">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    {isRunning ? "No console output yet..." : "Start the daemon to see console output"}
                  </div>
                )}
                <div ref={consoleEndRef} />
              </div>
            </TabsContent>

            <TabsContent value="logfile">
              <div className="console-output bg-black/50 text-gray-300">
                {logs.logFile.length > 0 ? (
                  logs.logFile.map((line, index) => (
                    <div key={index} className="font-mono text-sm">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    {isRunning ? "No log file entries yet..." : "Start the daemon to see log file entries"}
                  </div>
                )}
                <div ref={logFileEndRef} />
              </div>
            </TabsContent>

            <TabsContent value="tor">
              <div className="console-output bg-purple-950/30 text-gray-300">
                {logs.torProxy.length > 0 ? (
                  logs.torProxy.map((line, index) => (
                    <div key={index} className="font-mono text-sm">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    {torProxyRunning ? "No Tor log entries yet..." : "Start Tor to see log entries"}
                  </div>
                )}
                <div ref={torLogEndRef} />
              </div>
            </TabsContent>

            <TabsContent value="i2p">
              <div className="console-output bg-blue-950/30 text-gray-300">
                {logs.i2pProxy.length > 0 ? (
                  logs.i2pProxy.map((line, index) => (
                    <div key={index} className="font-mono text-sm">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    {i2pProxyRunning ? "No I2P log entries yet..." : "Start I2P to see log entries"}
                  </div>
                )}
                <div ref={i2pLogEndRef} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsTab;
