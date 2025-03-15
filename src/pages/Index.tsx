
import React from 'react';
import Layout from '@/components/Layout';
import { MoneroProvider } from '@/contexts/MoneroContext';

const Index = () => {
  return (
    <MoneroProvider>
      <Layout />
    </MoneroProvider>
  );
};

export default Index;
