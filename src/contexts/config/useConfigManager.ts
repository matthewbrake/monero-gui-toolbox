
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { MoneroConfig } from '../../types/monero';
import { defaultConfig } from './defaultConfigs';

export const useConfigManager = () => {
  const [config, setConfig] = useState<MoneroConfig>(defaultConfig);
  const [showBinaryConfig, setShowBinaryConfig] = useState(false);

  const saveConfig = () => {
    // This would actually save to a file
    // For demo purposes, we'll store it in localStorage
    localStorage.setItem('monero-config', JSON.stringify(config));
    
    toast({
      title: "Configuration Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const loadConfig = (configPath?: string) => {
    try {
      // In a real app, this would load from a file
      // For demo, we'll load from localStorage
      const savedConfig = localStorage.getItem('monero-config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
        toast({
          title: "Configuration Loaded",
          description: "Settings loaded successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Load Failed",
          description: "No saved configuration found.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Loading Configuration",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const testPaths = async () => {
    try {
      // In a real app, this would check if files exist and are executable
      // For this demo, we'll just simulate a check
      
      const pathsToCheck = [
        { name: 'Monero daemon', path: config.moneroPath },
        { name: 'Tor executable', path: config.torPath, enabled: config.torEnabled },
        { name: 'I2P executable', path: config.i2pPath, enabled: config.i2pEnabled }
      ];
      
      let allValid = true;
      let invalidPaths: string[] = [];
      
      // Simulate path checking
      pathsToCheck.forEach(item => {
        if (item.enabled === false) return; // Skip if not enabled
        
        const exists = item.path && item.path.length > 0;
        const isExecutable = item.path.endsWith('.exe') || !item.path.includes('.');
        
        if (!exists || !isExecutable) {
          allValid = false;
          invalidPaths.push(item.name);
        }
      });
      
      if (allValid) {
        toast({
          title: "Path Validation Successful",
          description: "All binary paths are valid.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Paths Detected",
          description: `The following paths may be invalid: ${invalidPaths.join(', ')}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Path Validation Error",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return {
    config,
    setConfig,
    showBinaryConfig,
    setShowBinaryConfig,
    saveConfig,
    loadConfig,
    testPaths
  };
};
