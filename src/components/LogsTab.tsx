
import React, { useRef, useEffect } from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Terminal, FileText } from 'lucide-react';

const LogsTab: React.FC = () => {
  const { logs, isRunning } = useMonero();
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const logFileEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="space-y-6 animate-slideUp">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Daemon Logs</CardTitle>
          <CardDescription>
            View console output and log files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="console" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="console" className="flex items-center space-x-2">
                <Terminal className="h-4 w-4" />
                <span>Console Output</span>
              </TabsTrigger>
              <TabsTrigger value="logfile" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Log File</span>
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsTab;
