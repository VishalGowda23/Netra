import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Database, Fingerprint, ShieldAlert, BadgeDollarSign } from "lucide-react";
import type { MemoryInsight } from "../types";
import { useTranslation } from "../i18n/useTranslation";

export function MemoryExplorer({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [customerId, setCustomerId] = useState("");
  const [insight, setInsight] = useState<MemoryInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/memory-insights?customer_id=${idToSearch}`);
      if (response.ok) {
        const data = await response.json();
        setInsight(data);
      } else {
        setInsight(null);
      }
    } catch (error) {
      console.error("Failed to fetch memory insight:", error);
      setInsight(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed top-0 right-0 bottom-0 w-[450px] bg-[#fdfdfd] border-l-4 border-black z-[9999] shadow-[-15px_0_30px_rgba(0,0,0,0.2)] flex flex-col"
      >
        <div className="p-4 bg-black text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database size={24} className="text-secondary" />
            <h2 className="font-black text-xl tracking-wider">{t("memory_vault")}</h2>
          </div>
          <button onClick={onClose} className="hover:text-danger switch-transition">
            <X size={28} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto font-mono text-sm space-y-6">
          <div className="space-y-2">
            <label className="block font-bold">CUSTOMER ID LOOKUP</label>
            <div className="flex">
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="e.g. cust_789"
                  className="neo-input flex-1 border-r-0"
                  onKeyDown={(e) => e.key === "Enter" && fetchInsight(customerId)}
                />
                <button onClick={() => fetchInsight(customerId)} className="neo-btn bg-primary text-white p-3 flex items-center justify-center">
                  <Search size={20} />
                </button>
            </div>
          </div>

          {loading && <div className="text-center p-10 uppercase tracking-widest text-primary animate-pulse">Scanning Vector DB...</div>}

          {!loading && insight && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_#000]">
                <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-3">
                  <Fingerprint className="text-primary" />
                  <span className="font-bold text-lg">{insight.customer_id}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="flex flex-col bg-gray-100 p-2 border border-black">
                    <span className="text-gray-500 text-xs font-bold uppercase">Total Actions</span>
                    <span className="text-xl font-black">{insight.total_past_actions}</span>
                  </div>
                  <div className="flex flex-col bg-gray-100 p-2 border border-black">
                    <span className="text-gray-500 text-xs font-bold uppercase">Fraud Incidents</span>
                    <span className="text-xl font-black text-danger">{insight.fraud_incidents}</span>
                  </div>
                  <div className="flex flex-col bg-gray-100 p-2 border border-black col-span-2">
                    <span className="flex items-center justify-center gap-1 text-gray-500 text-xs font-bold uppercase">
                      <BadgeDollarSign size={14} /> Total Loss Hist.
                    </span>
                    <span className="text-xl font-black text-warning">₹{insight.total_loss}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 border-2 border-black flex items-center justify-between"
                  style={{
                    backgroundColor: 
                      insight.risk_elevation === 'CRITICAL' ? '#FFE5E5' : 
                      insight.risk_elevation === 'HIGH' ? '#FFF3CD' : 
                      insight.risk_elevation === 'MEDIUM' ? '#EBF8FF' : '#E6FFFA'
                  }}
                >
                  <span className="font-bold flex items-center gap-2">
                    <ShieldAlert size={16} className={insight.risk_elevation === 'CRITICAL' ? 'text-danger' : 'text-black'}/>
                    RISK ELEVATION
                  </span>
                  <span className={`px-2 py-1 border border-black font-black uppercase text-xs
                    ${insight.risk_elevation === 'CRITICAL' ? 'bg-danger text-white' : 
                      insight.risk_elevation === 'HIGH' ? 'bg-warning text-black' : 'bg-success text-white'}`}>
                    {insight.risk_elevation}
                  </span>
                </div>
              </div>

              {insight.recent_actions.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2 uppercase border-b-2 border-black pb-1">Retrieved Context</h3>
                  <div className="space-y-2">
                    {insight.recent_actions.map((act, i) => (
                      <div key={i} className="text-xs bg-gray-50 border border-black p-2 border-l-4 border-l-primary flex flex-col gap-1 break-words pb-2">
                        <div className="font-bold border-b border-gray-200 pb-1 flex justify-between">
                          <span className="uppercase text-primary">{act.action_type || "action"}</span>
                          <span className="text-gray-400">{act.timestamp ? new Date(act.timestamp).toLocaleString() : ""}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span>Amount: ₹{act.amount}</span>
                          <span className={`px-2 py-0.5 border border-black ${act.outcome === 'success' ? 'bg-success text-white' : 'bg-warning text-black'}`}>
                            {act.outcome}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {!loading && !insight && (
            <div className="mt-8">
              <div className="text-center p-6 text-gray-400 border-b border-gray-200 mb-6">
                <Database size={48} className="mx-auto mb-4 opacity-50 text-primary" />
                <p className="uppercase font-bold tracking-wider text-charcoal">Search to query the vector database</p>
              </div>
              
              <h3 className="font-bold mb-3 uppercase tracking-wider text-gray-500">Suggested Queries</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setCustomerId("cust_789");
                    fetchInsight("cust_789");
                  }}
                  className="w-full text-left neo-btn bg-white hover:bg-gray-50 p-3 flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-lg group-hover:text-primary transition-colors">cust_789</div>
                    <div className="text-xs text-gray-500">High-risk profile with recent refunds</div>
                  </div>
                  <Search size={16} className="text-gray-400 group-hover:text-primary" />
                </button>

                <button 
                  onClick={() => {
                    setCustomerId("cust_123");
                    fetchInsight("cust_123");
                  }}
                  className="w-full text-left neo-btn bg-white hover:bg-gray-50 p-3 flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-lg group-hover:text-primary transition-colors">cust_123</div>
                    <div className="text-xs text-gray-500">Standard profile, normal activity</div>
                  </div>
                  <Search size={16} className="text-gray-400 group-hover:text-primary" />
                </button>

                <button 
                  onClick={() => {
                    setCustomerId("cust_456");
                    fetchInsight("cust_456");
                  }}
                  className="w-full text-left neo-btn bg-white hover:bg-gray-50 p-3 flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-lg group-hover:text-primary transition-colors">cust_456</div>
                    <div className="text-xs text-danger">Known fraudulent actor with multiple violations</div>
                  </div>
                  <Search size={16} className="text-gray-400 group-hover:text-danger" />
                </button>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
