import React, { useState } from 'react';
import { Menu, Globe2 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ArchitectureDrawer from './components/ArchitectureDrawer';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg shadow-lg shadow-primary/20">
                <Globe2 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Multirail FX</h1>
                <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">Payment Routing Agent</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center space-x-2 bg-background border border-border hover:border-gray-500 text-gray-300 px-4 py-2 rounded-lg transition-colors"
            >
              <Menu size={16} />
              <span className="text-sm font-medium">Architecture</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <Dashboard />
      </main>

      {/* Architecture Drawer Component */}
      <ArchitectureDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

    </div>
  );
}

export default App;
