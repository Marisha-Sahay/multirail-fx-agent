import { X, Server, Database, Globe, ArrowRight } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchitectureDrawer({ isOpen, onClose }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-card border-l border-border h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-white">System Architecture</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto text-gray-300 space-y-8">
          <p className="text-sm">
            The Multirail FX Agent intelligently routes payments across traditional banking rails and modern fintech APIs to optimize for cost or speed.
          </p>

          <div className="space-y-4">
            <div className="bg-background border border-border p-4 rounded-xl flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold">Client SPA</h3>
                <p className="text-xs text-gray-400">React + Vite + ECharts</p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="text-gray-600 rotate-90" />
            </div>

            <div className="bg-background border border-border p-4 rounded-xl flex items-center space-x-4">
              <div className="p-3 bg-accent/20 text-accent rounded-lg">
                <Server size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold">Vercel Serverless API</h3>
                <p className="text-xs text-gray-400">Node.js Engine (/api/quote.ts)</p>
              </div>
            </div>

            <div className="flex justify-center space-x-8">
              <ArrowRight className="text-gray-600 rotate-90" />
              <ArrowRight className="text-gray-600 rotate-90" />
              <ArrowRight className="text-gray-600 rotate-90" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background border border-border p-2 rounded-lg text-center">
                <Database size={16} className="mx-auto mb-2 text-purple-400" />
                <h4 className="text-[10px] font-bold text-white">SWIFT Network</h4>
                <p className="text-[9px] text-gray-500">Correspondent Banks</p>
              </div>
              <div className="bg-background border border-border p-2 rounded-lg text-center">
                <Database size={16} className="mx-auto mb-2 text-yellow-400" />
                <h4 className="text-[10px] font-bold text-white">Visa Direct</h4>
                <p className="text-[9px] text-gray-500">Card Networks</p>
              </div>
              <div className="bg-background border border-border p-2 rounded-lg text-center">
                <Database size={16} className="mx-auto mb-2 text-green-400" />
                <h4 className="text-[10px] font-bold text-white">Wise API</h4>
                <p className="text-[9px] text-gray-500">Sandbox / Prod</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">How it works</h4>
            <ul className="text-xs space-y-2 list-disc list-inside text-gray-400">
              <li>Fetches real-time mid-market FX rates from er-api.</li>
              <li>Queries Wise Sandbox for dynamic quote structure.</li>
              <li>Calculates hidden spread markups vs explicit flat fees.</li>
              <li>Applies routing priority heuristics to select optimal rail.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
