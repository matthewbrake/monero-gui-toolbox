
import React from 'react';
import { useMonero } from '@/contexts/MoneroContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Server, Database, Network, Clock } from 'lucide-react';

const StatusTab: React.FC = () => {
  const { isRunning, statusInfo } = useMonero();

  return (
    <div className="space-y-6 animate-slideUp">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-monero-blue-light" />
            <span>Daemon Status</span>
          </CardTitle>
          <CardDescription>
            Real-time Monero daemon status and metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`mb-6 p-4 rounded-md flex items-center space-x-3 ${isRunning ? 'bg-green-950/30 text-green-400' : 'bg-red-950/30 text-red-400'}`}>
            <div className={`h-3 w-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="font-medium">
              {isRunning ? 'Daemon is running' : 'Daemon is stopped'}
            </span>
          </div>

          {isRunning ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sync Status</span>
                    <span className="font-medium">{statusInfo.syncStatus.toFixed(2)}%</span>
                  </div>
                  <Progress value={statusInfo.syncStatus} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Server className="h-5 w-5 text-monero-blue-light mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Current Block Height</p>
                      <p className="font-mono text-lg font-medium">{statusInfo.blockHeight.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Network className="h-5 w-5 text-monero-blue-light mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Network Hashrate</p>
                      <p className="font-mono text-lg font-medium">{statusInfo.networkHashrate}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Database className="h-5 w-5 text-monero-blue-light mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Connected Peers</p>
                      <p className="font-mono text-lg font-medium">{statusInfo.connections}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-md bg-card/80 backdrop-blur-sm border border-border/40">
                  <h3 className="text-sm font-medium mb-2 flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-monero-blue-light" />
                    <span>Recent Activity</span>
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Last Block Found</span>
                      <span className="font-medium">3 minutes ago</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Last Incoming Connection</span>
                      <span className="font-medium">1 minute ago</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Last Outgoing Connection</span>
                      <span className="font-medium">5 minutes ago</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-md bg-card/80 backdrop-blur-sm border border-border/40">
                  <h3 className="text-sm font-medium mb-2">System Resource Usage</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">CPU Usage</span>
                        <span>32%</span>
                      </div>
                      <Progress value={32} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Memory Usage</span>
                        <span>1.2 GB</span>
                      </div>
                      <Progress value={45} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Disk I/O</span>
                        <span>3.5 MB/s</span>
                      </div>
                      <Progress value={25} className="h-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Daemon is not running</p>
              <p className="text-sm mt-2">Start the node to view status information</p>
            </div>
          )}
        </CardContent>
      </Card>

      {isRunning && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Network Map</CardTitle>
            <CardDescription>
              Connected peers and geographic distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center bg-monero-gray-darkest/50 rounded-md">
            <p className="text-muted-foreground italic">Network visualization would be shown here</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatusTab;
