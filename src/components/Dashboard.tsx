import { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity, Zap, Shield, ChevronRight, ArrowRight, Clock, Info } from 'lucide-react';

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', BRL: 'R$', MXN: '$'
};

const SOURCE_CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
];

const TARGET_CURRENCIES = [
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'USD', name: 'US Dollar' },
];

export default function Dashboard() {
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [amount, setAmount] = useState(10000);
  const [priority, setPriority] = useState('BALANCED');
  
  const [isRouting, setIsRouting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [quoteResult, setQuoteResult] = useState<any>(null);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Prevent same-currency selection: auto-switch target if it matches source
  useEffect(() => {
    if (sourceCurrency === targetCurrency) {
      const fallback = TARGET_CURRENCIES.find(c => c.code !== sourceCurrency);
      if (fallback) setTargetCurrency(fallback.code);
    }
  }, [sourceCurrency, targetCurrency]);

  const availableTargets = TARGET_CURRENCIES.filter(c => c.code !== sourceCurrency);
  const currencySymbol = CURRENCY_SYMBOLS[sourceCurrency] || sourceCurrency;

  const handleRoutePayment = async () => {
    setIsRouting(true);
    setLogs(['[SYSTEM] Initializing request...']);
    setQuoteResult(null);
    
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceCurrency, targetCurrency, amount, priority })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Simulate streaming logs for UI effect
        let index = 0;
        const interval = setInterval(() => {
          if (index < data.logs.length) {
            setLogs(prev => [...prev, data.logs[index]]);
            index++;
          } else {
            clearInterval(interval);
            setQuoteResult(data);
            setIsRouting(false);
          }
        }, 300);
      } else {
        setLogs(prev => [...prev, `[ERROR] ${data.error}`]);
        setIsRouting(false);
      }
    } catch (err: any) {
      setLogs(prev => [...prev, `[ERROR] Network failure: ${err.message}`]);
      setIsRouting(false);
    }
  };

  const chartOption = quoteResult ? {
    backgroundColor: 'transparent',
    textStyle: { color: '#9CA3AF' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'value', 
      splitLine: { lineStyle: { color: '#30363D' } },
      axisLabel: { color: '#9CA3AF' }
    },
    yAxis: { 
      type: 'category', 
      data: quoteResult.rails.map((r: any) => r.name),
      axisLabel: { color: '#D1D5DB' }
    },
    series: [
      {
        name: `Payout (${targetCurrency})`,
        type: 'bar',
        data: quoteResult.rails.map((r: any) => ({
          value: r.payout.toFixed(2),
          itemStyle: {
            color: r.id === quoteResult.winningRail ? '#10B981' : '#3B82F6'
          }
        })),
        label: { show: true, position: 'right', color: '#fff' }
      }
    ]
  } : {};

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Controls & Feed */}
      <div className="lg:col-span-1 space-y-6 flex flex-col">
        {/* Controls Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Activity className="mr-2 text-primary" /> Transfer Details
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Source</label>
                <select 
                  value={sourceCurrency} 
                  onChange={(e) => setSourceCurrency(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  {SOURCE_CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Target</label>
                <select 
                  value={targetCurrency} 
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  {availableTargets.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg p-3 pl-8 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Optimization Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'LOWEST_COST', label: 'Cost', icon: Shield },
                  { id: 'BALANCED', label: 'Balanced', icon: Activity },
                  { id: 'FASTEST_SPEED', label: 'Speed', icon: Zap }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setPriority(opt.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                      priority === opt.id 
                      ? 'bg-primary/20 border-primary text-primary' 
                      : 'bg-background border-border text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <opt.icon size={18} className="mb-1" />
                    <span className="text-[10px] font-bold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRoutePayment}
              disabled={isRouting}
              className="w-full mt-4 bg-primary hover:bg-blue-600 disabled:bg-blue-900 disabled:text-gray-400 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-primary/25 active:scale-[0.98]"
            >
              {isRouting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Computing Optimal Route...</span>
                </div>
              ) : (
                <>
                  <ArrowRight size={18} className="mr-2" /> Compare Routes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Agent Feed */}
        <div className="bg-[#0D1117] border border-border rounded-2xl flex-1 shadow-xl flex flex-col overflow-hidden">
          <div className="bg-[#161B22] p-3 border-b border-border flex items-center justify-between">
            <h3 className="text-xs font-mono text-gray-400">agent-execution.log</h3>
            <div className="flex space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
          </div>
          <div className="p-4 font-mono text-[11px] leading-relaxed overflow-y-auto h-64 lg:h-auto flex-1">
            {logs.map((log, i) => {
              if (!log) return null;
              let color = 'text-gray-300';
              if (log.includes('[ERROR]')) color = 'text-red-400';
              if (log.includes('[SUCCESS]')) color = 'text-green-400';
              if (log.includes('[WARN]')) color = 'text-yellow-400';
              if (log.includes('[DECISION]')) color = 'text-primary font-bold';
              
              return (
                <div key={i} className={`${color} mb-1.5 break-words`}>
                  <span className="text-gray-600 mr-2">{'>'}</span>{log}
                </div>
              )
            })}
            {isRouting && (
              <div className="text-gray-500 animate-pulse">
                <span className="text-gray-600 mr-2">{'>'}</span>_
              </div>
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>

      {/* Right Column: Visualization */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl h-full flex flex-col">
          <h2 className="text-xl font-bold mb-2">Multirail Comparison Analytics</h2>
          <p className="text-gray-400 text-sm mb-6">Real-time analysis of payout amounts, spread markups, and explicit fees.</p>
          
          {!quoteResult && !isRouting && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-border rounded-xl">
              <Activity size={48} className="mb-4 opacity-50" />
              <p>Configure parameters and compare routes to view analytics.</p>
            </div>
          )}

          {isRouting && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-border rounded-xl">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="animate-pulse">Synthesizing global financial networks...</p>
            </div>
          )}

          {quoteResult && !isRouting && (
            <div className="flex-1 flex flex-col space-y-6 animate-in fade-in zoom-in-95 duration-500">
              
              {/* Mid-market rate badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-background border border-border rounded-lg px-4 py-2 text-sm flex items-center gap-2">
                  <Info size={14} className="text-gray-400" />
                  <span className="text-gray-400">Mid-market rate:</span>
                  <span className="text-white font-mono font-bold">1 {sourceCurrency} = {quoteResult.midMarketRate.toFixed(4)} {targetCurrency}</span>
                </div>
              </div>

              {/* Highlight Card */}
              {(() => {
                const winner = quoteResult.rails.find((r: any) => r.id === quoteResult.winningRail);
                // Find the next-best rail (highest payout that isn't the winner)
                const otherRails = quoteResult.rails
                  .filter((r: any) => r.id !== quoteResult.winningRail)
                  .sort((a: any, b: any) => b.payout - a.payout);
                const nextBest = otherRails[0];
                const savings = winner.payout - nextBest.payout;
                
                return (
                  <div className="bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 rounded-xl p-6 flex items-center justify-between">
                    <div>
                      <p className="text-accent text-sm font-bold uppercase tracking-wider mb-1">Recommended Route</p>
                      <h3 className="text-2xl font-bold text-white">{winner.name}</h3>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <p className="text-gray-300 flex items-center">
                          <Clock size={14} className="mr-1.5 text-gray-400" />
                          Settles in {winner.speed}
                        </p>
                        <ChevronRight size={14} className="text-gray-500 hidden sm:block"/>
                        <p className="text-gray-300">
                          Payout: <span className="text-white font-bold">{winner.payout.toFixed(2)} {targetCurrency}</span>
                        </p>
                      </div>
                    </div>
                    {savings > 0 && (
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Savings vs {nextBest.name}</p>
                        <p className="text-3xl font-black text-accent">+{savings.toFixed(2)}</p>
                        <p className="text-gray-500 text-xs">{targetCurrency}</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Chart */}
              <div className="h-[280px] w-full border border-border rounded-xl bg-background/50 p-2">
                 <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-3">Rail Network</th>
                      <th className="p-3">FX Spread</th>
                      <th className="p-3">Flat Fee ({sourceCurrency})</th>
                      <th className="p-3">Speed</th>
                      <th className="p-3 text-right">Final Payout</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {quoteResult.rails.map((rail: any) => {
                      // Determine best-in-class labels
                      const isBestCost = rail.payout === Math.max(...quoteResult.rails.map((r: any) => r.payout));
                      const isBestSpeed = rail.speedScore === Math.max(...quoteResult.rails.map((r: any) => r.speedScore));

                      return (
                        <tr 
                          key={rail.id} 
                          className={`border-b border-border/50 hover:bg-white/5 transition-colors ${rail.id === quoteResult.winningRail ? 'bg-primary/5' : ''}`}
                        >
                          <td className="p-3 font-semibold flex items-center gap-2">
                            {rail.id === quoteResult.winningRail && <Zap size={14} className="text-accent" />}
                            {rail.name}
                            {isBestCost && <span className="text-[9px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-bold uppercase">Best value</span>}
                            {isBestSpeed && !isBestCost && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase">Fastest</span>}
                          </td>
                          <td className="p-3 text-red-400 font-mono">-{rail.feeSpread.toFixed(2)}%</td>
                          <td className="p-3 text-gray-300 font-mono">-{currencySymbol}{rail.feeFlat.toFixed(2)}</td>
                          <td className="p-3 text-gray-300 flex items-center gap-1.5">
                            <Clock size={12} className="text-gray-500" />
                            {rail.speed}
                          </td>
                          <td className="p-3 text-right font-bold text-white font-mono">{rail.payout.toFixed(2)} {targetCurrency}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Regulatory disclaimer */}
              <p className="text-[11px] text-gray-500 text-center mt-2 px-4">
                Rates are indicative and sourced from open mid-market data. Actual rates may vary at the time of transfer. 
                This tool provides comparison quotes only and does not initiate payments.
              </p>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
