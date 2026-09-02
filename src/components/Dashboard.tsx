import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity, Zap, Shield, HelpCircle, ChevronRight, Play } from 'lucide-react';

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
            <Activity className="mr-2 text-primary" /> Routing Engine Parameters
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
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Target</label>
                <select 
                  value={targetCurrency} 
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="BRL">BRL - Brazilian Real</option>
                  <option value="MXN">MXN - Mexican Peso</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
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
                  <Play size={18} className="mr-2" /> Execute Payment Agent
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
              <p>Configure parameters and execute agent to view analytics.</p>
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
              
              {/* Highlight Card */}
              {(() => {
                const winner = quoteResult.rails.find((r: any) => r.id === quoteResult.winningRail);
                const swift = quoteResult.rails.find((r: any) => r.id === 'swift');
                const savings = swift.payout - winner.payout < 0 ? (winner.payout - swift.payout) : 0;
                
                return (
                  <div className="bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 rounded-xl p-6 flex items-center justify-between">
                    <div>
                      <p className="text-accent text-sm font-bold uppercase tracking-wider mb-1">Recommended Route</p>
                      <h3 className="text-2xl font-bold text-white">{winner.name}</h3>
                      <p className="text-gray-300 mt-1 flex items-center">
                        Settles in {winner.speed} <ChevronRight size={14} className="mx-1 text-gray-500"/> Payout: {winner.payout.toFixed(2)} {targetCurrency}
                      </p>
                    </div>
                    {savings > 0 && (
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Savings vs SWIFT</p>
                        <p className="text-3xl font-black text-accent">+{savings.toFixed(2)}</p>
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
                      <th className="p-3">Flat Fee (Est USD)</th>
                      <th className="p-3 text-right">Final Payout</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {quoteResult.rails.map((rail: any) => (
                      <tr 
                        key={rail.id} 
                        className={`border-b border-border/50 hover:bg-white/5 transition-colors ${rail.id === quoteResult.winningRail ? 'bg-primary/5' : ''}`}
                      >
                        <td className="p-3 font-semibold flex items-center">
                          {rail.id === quoteResult.winningRail && <Zap size={14} className="text-accent mr-2" />}
                          {rail.name}
                        </td>
                        <td className="p-3 text-red-400 font-mono">-{rail.feeSpread.toFixed(2)}%</td>
                        <td className="p-3 text-gray-300 font-mono">-${rail.feeFlat.toFixed(2)}</td>
                        <td className="p-3 text-right font-bold text-white font-mono">{rail.payout.toFixed(2)} {targetCurrency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
