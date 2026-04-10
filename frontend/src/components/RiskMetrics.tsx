import { useEffect, useState } from "react";
import { type GovernanceMetrics, type GovernanceDecision } from "../types";
import { ShieldCheck, Target, Activity, TrendingUp, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../i18n/useTranslation";

interface RiskMetricsProps {
  metrics: GovernanceMetrics | null;
  recentLogs: GovernanceDecision[];
}

interface ROIData {
  damage_prevented: number;
  governance_cost: number;
  roi_multiplier: number;
}

export function RiskMetrics({ metrics, recentLogs }: RiskMetricsProps) {
  const { t } = useTranslation();
  const [roi, setRoi] = useState<ROIData | null>(null);
  const [selectedCell, setSelectedCell] = useState<GovernanceDecision | null>(null);
  const [explainingMetric, setExplainingMetric] = useState<"block_rate" | "avg_risk" | "governed" | "roi" | null>(null);

  useEffect(() => {
    const fetchRoi = async () => {
      try {
        const resp = await fetch("http://localhost:8000/api/v1/roi-summary");
        if (resp.ok) {
          setRoi(await resp.json());
        }
      } catch { /* silent */ }
    };
    fetchRoi();
    const interval = setInterval(fetchRoi, 10000);
    return () => clearInterval(interval);
  }, []);

  // Generate heatmap grid
  const gridSize = 35;
  const gridData: (GovernanceDecision | null)[] = Array(gridSize).fill(null);

  recentLogs.slice(0, gridSize).forEach((log, i) => {
    gridData[i] = log;
  });

  const getHeatmapColor = (cell: GovernanceDecision | null) => {
    if (!cell) return "bg-gray-100 border-dashed border-gray-300";
    switch (cell.decision) {
      case "APPROVE": return "bg-success";
      case "BLOCK": return "bg-danger";
      case "ESCALATE": return "bg-warning";
      default: return "bg-gray-100 border-dashed";
    }
  };

  return (
    <div className="neo-card p-4 flex flex-col h-full bg-[#fdfdfd] relative">
      <h2 className="text-xl font-bold border-b-3 border-black pb-3 mb-4 flex items-center justify-between">
        {t("risk_metrics")}
        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 flex items-center gap-1 rounded-sm"><Info size={12}/> Click metrics to explain</span>
      </h2>

      {/* Metrics 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button 
          onClick={() => setExplainingMetric("block_rate")}
          className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-left group"
        >
          <div className="text-xs font-bold text-gray-500 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1"><Target size={14} /> {t("block_rate")}</span>
            <Info size={12} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
          </div>
          <div className="text-2xl font-bold text-danger">
            {metrics ? metrics.block_rate : "0.0%"}
          </div>
        </button>
        <button 
          onClick={() => setExplainingMetric("avg_risk")}
          className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-left group"
        >
          <div className="text-xs font-bold text-gray-500 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1"><Activity size={14} /> {t("avg_risk")}</span>
            <Info size={12} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
          </div>
          <div className="text-2xl font-bold text-warning">
            {metrics ? metrics.avg_risk_score : "0.0"}
          </div>
        </button>
        <button 
          onClick={() => setExplainingMetric("governed")}
          className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-left group"
        >
          <div className="text-xs font-bold text-gray-500 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1"><ShieldCheck size={14} /> {t("governed")}</span>
            <Info size={12} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
          </div>
          <div className="text-2xl font-bold text-primary">
            {metrics ? metrics.total_decisions : 0}
          </div>
        </button>
        <button 
          onClick={() => setExplainingMetric("roi")}
          className="border-2 border-black p-3 bg-success/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-left group flex flex-col justify-center"
        >
          <div className="text-xs font-bold text-gray-500 mb-0.5 flex items-center justify-between w-full">
            <span className="flex items-center gap-1"><TrendingUp size={14} /> {t("roi")}</span>
            <Info size={12} className="opacity-0 group-hover:opacity-100 text-success transition-opacity" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-success">
              {roi ? `${roi.roi_multiplier.toLocaleString()}×` : "—"}
            </span>
          </div>
          {roi && roi.damage_prevented > 0 && (
            <div className="text-[10px] font-bold text-charcoal mt-1 -mb-1 opacity-80 leading-tight">
              ₹{roi.damage_prevented.toLocaleString()} {t("saved")}
            </div>
          )}
        </button>
      </div>

      {/* Clickable Heatmap */}
      <div>
        <h3 className="text-sm font-bold mb-2">{t("heatmap_title")}</h3>
        <div className="grid grid-cols-7 gap-1">
          {gridData.map((cell, i) => (
            <motion.div
              key={i}
              whileHover={cell ? { scale: 1.2, zIndex: 10 } : {}}
              whileTap={cell ? { scale: 0.95 } : {}}
              onClick={() => cell && setSelectedCell(cell)}
              className={`aspect-square border-2 border-black rounded-sm transition-colors duration-500 ${getHeatmapColor(cell)} ${cell ? "cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : ""}`}
              title={cell ? `${cell.decision} — ${cell.agent_name}` : ""}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs font-bold">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-success border border-black"/> {t("approved")}</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-danger border border-black"/> {t("blocked")}</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-warning border border-black"/> {t("escalated")}</div>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">{t("heatmap_click")}</p>
      </div>

      {/* Heatmap Cell Detail Modal */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 p-4 flex flex-col border-3 border-black rounded-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm uppercase tracking-wider">
                {t("decision_detail")}
              </h3>
              <button onClick={() => setSelectedCell(null)} className="hover:bg-gray-100 p-1 rounded-sm">
                <X size={16} />
              </button>
            </div>

            <div className={`p-3 border-2 border-black rounded-sm mb-3 ${
              selectedCell.decision === "BLOCK" ? "bg-danger/10 border-l-4 border-l-danger" :
              selectedCell.decision === "APPROVE" ? "bg-success/10 border-l-4 border-l-success" :
              "bg-warning/10 border-l-4 border-l-warning"
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">{selectedCell.decision}</span>
                <span className="text-xs text-gray-500">{new Date(selectedCell.evaluated_at).toLocaleTimeString()}</span>
              </div>
              <div className="text-xs mb-1">
                <strong>{selectedCell.agent_name}</strong> → {selectedCell.action_type?.toUpperCase()} ₹{selectedCell.amount?.toLocaleString()}
              </div>
              <div className="text-xs">
                Customer: <strong>{selectedCell.customer_id}</strong>
              </div>
              <div className="text-xs mt-1">
                Risk Score: <strong className={selectedCell.risk_score > 50 ? "text-danger" : "text-success"}>{selectedCell.risk_score?.toFixed(1)}</strong>/100
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="text-xs font-bold text-primary mb-1 uppercase">Plain English:</div>
              <p className="text-xs text-charcoal leading-relaxed mb-3">
                {selectedCell.simple_explanation || selectedCell.reasoning}
              </p>

              {selectedCell.rule_violations?.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-bold text-danger mb-1">Rule Violations:</div>
                  {selectedCell.rule_violations.map((v, i) => (
                    <div key={i} className="text-xs text-charcoal">• {v.message}</div>
                  ))}
                </div>
              )}
              {selectedCell.memory_warnings?.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-warning mb-1">Memory Warnings:</div>
                  {selectedCell.memory_warnings.map((v, i) => (
                    <div key={i} className="text-xs text-charcoal">• {v.message}</div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Metric Explanation Modal */}
      <AnimatePresence>
        {explainingMetric && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 p-5 flex flex-col border-3 border-black rounded-sm"
          >
            <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
              <h3 className="font-black text-lg uppercase flex items-center gap-2">
                <Info size={18} className="text-primary"/>
                {explainingMetric === "block_rate" && t("block_rate")}
                {explainingMetric === "avg_risk" && t("avg_risk")}
                {explainingMetric === "governed" && t("governed")}
                {explainingMetric === "roi" && t("roi")}
              </h3>
              <button onClick={() => setExplainingMetric(null)} className="hover:bg-gray-200 p-1 rounded-sm border border-transparent hover:border-black">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
              {explainingMetric === "block_rate" && (
                <div className="space-y-3 font-mono text-sm text-charcoal">
                  <p className="font-bold underline">Calculation:</p>
                  <p className="bg-gray-100 p-2 border border-black italic">
                    (Total Blocked Actions / Total Governed Actions) * 100
                  </p>
                  <p className="font-bold underline mt-4">Why it matters:</p>
                  <p>
                    Indicates how aggressive the system is currently being. A sudden spike might mean an active threat campaign (e.g. rogue agents hitting the system at once) or rules being too restrictive. 
                  </p>
                </div>
              )}

              {explainingMetric === "avg_risk" && (
                <div className="space-y-3 font-mono text-sm text-charcoal">
                  <p className="font-bold underline">Calculation:</p>
                  <p className="bg-gray-100 p-2 border border-black italic">
                    Sum(Action Risk Scores) / Total Governed Actions
                  </p>
                  <p className="font-bold underline mt-4">Why it matters:</p>
                  <p>
                    Tracks the average baseline danger of agent activities. A value below 20 indicates normal operation. Anything approaching 50+ means agents are attempting high-risk sensitive operations regularly.
                  </p>
                </div>
              )}

              {explainingMetric === "governed" && (
                <div className="space-y-3 font-mono text-sm text-charcoal">
                  <p className="font-bold underline">Calculation:</p>
                  <p className="bg-gray-100 p-2 border border-black italic">
                    Count(All intercepted API requests)
                  </p>
                  <p className="font-bold underline mt-4">Why it matters:</p>
                  <p>
                    Shows the sheer volume of AI-driven actions that NETRA has audited in real-time. This confirms the interceptor is successfully placed between your agents and your external tools.
                  </p>
                </div>
              )}

              {explainingMetric === "roi" && (
                <div className="space-y-3 font-mono text-sm text-charcoal">
                  <p className="font-bold underline">Calculation:</p>
                  <p className="bg-success/10 p-2 border border-black mt-1">
                    <span className="font-bold">Damage Prevented:</span> Sum of financial value from all BLOCKED malicious intents.
                  </p>
                  <p className="bg-gray-100 p-2 border border-black">
                    <span className="font-bold">Governance Cost:</span> Baseline Infra Cost + (₹45.0 * Total Governed Actions)
                  </p>
                  <p className="bg-gray-100 p-2 border border-black font-bold text-center mt-2">
                    ROI = Damage Prevented / Governance Cost
                  </p>
                  <p className="font-bold underline mt-4">Why it matters:</p>
                  <p>
                    Proves that spending computational power to audit AI actions pays for itself by preventing catastrophic financial loss from hallucinating or compromised agents.
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-300">
              <button 
                onClick={() => setExplainingMetric(null)}
                className="w-full neo-button bg-black text-white py-2 font-bold"
              >
                GOT IT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
