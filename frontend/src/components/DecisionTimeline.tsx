import { useState } from "react";
import { type GovernanceDecision } from "../types";
import { Clock, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, Eye, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../i18n/useTranslation";

interface DecisionTimelineProps {
  logs: GovernanceDecision[];
}

export function DecisionTimeline({ logs }: DecisionTimelineProps) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedViewMode, setExpandedViewMode] = useState<"simple" | "technical">("simple");

  const getIcon = (decision: string) => {
    switch (decision) {
      case "APPROVE": return <CheckCircle size={16} className="text-success" />;
      case "BLOCK": return <XCircle size={16} className="text-danger" />;
      case "ESCALATE": return <AlertTriangle size={16} className="text-warning" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStyle = (decision: string) => {
    switch (decision) {
      case "APPROVE": return "border-l-success bg-success/5";
      case "BLOCK": return "border-l-danger bg-danger/5";
      case "ESCALATE": return "border-l-warning bg-warning/5";
      default: return "border-l-gray-500";
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    setExpandedViewMode("simple");
  };

  return (
    <div className="neo-card p-4 h-full flex flex-col bg-white">
      <h2 className="text-lg font-bold border-b-3 border-black pb-2 mb-3">
        {t("decision_log")}
      </h2>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {logs.map((log) => (
          <div key={log.action_id}>
            <div
              onClick={() => toggleExpand(log.action_id)}
              className={`border-2 border-black border-l-8 p-3 flex items-start justify-between font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:translate-x-[2px] transition-all ${getStyle(log.decision)}`}
            >
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                  {getIcon(log.decision)}
                  <span className="font-bold">
                    {log.decision === "APPROVE" ? t("approved") : log.decision === "BLOCK" ? t("blocked") : log.decision === "ESCALATE" ? t("escalated") : log.decision}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(log.evaluated_at).toLocaleTimeString()}
                  </span>
                  <span className="bg-black text-white px-1 ml-2 text-xs">
                    {log.agent_name}
                  </span>
                </div>
                <div className="text-charcoal font-sans text-sm">
                  Requested <span className="font-bold">{log.action_type?.toUpperCase()}</span> (₹{log.amount?.toLocaleString()}) for {log.customer_id}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold font-sans">{t("risk")}</div>
                  <div className={`font-bold ${log.risk_score > 50 ? 'text-danger' : 'text-charcoal'}`}>
                    {log.risk_score?.toFixed(1)}
                  </div>
                </div>
                {expandedId === log.action_id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {/* Expanded Detail */}
            <AnimatePresence>
              {expandedId === log.action_id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-2 border-t-0 border-black p-4 bg-gray-50">
                    {/* Simple/Technical Toggle */}
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedViewMode("simple"); }}
                        className={`text-xs font-bold px-2 py-1 border-2 border-black rounded-sm flex items-center gap-1 transition-colors ${
                          expandedViewMode === "simple" ? "bg-primary text-white" : "bg-white"
                        }`}
                      >
                        <Eye size={10} /> {t("simple")}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedViewMode("technical"); }}
                        className={`text-xs font-bold px-2 py-1 border-2 border-black rounded-sm flex items-center gap-1 transition-colors ${
                          expandedViewMode === "technical" ? "bg-charcoal text-green-400" : "bg-white"
                        }`}
                      >
                        <Code size={10} /> {t("technical")}
                      </button>
                    </div>

                    {expandedViewMode === "simple" ? (
                      <div className="text-sm text-charcoal leading-relaxed">
                        {log.simple_explanation || log.reasoning}
                      </div>
                    ) : (
                      <div className="font-mono text-xs space-y-1 bg-[#1F2933] text-[#F7F7F7] p-3 rounded-sm">
                        <div><span className="text-gray-400">ACTION_ID:</span> {log.action_id}</div>
                        <div><span className="text-gray-400">RISK_SCORE:</span> {log.risk_score?.toFixed(2)}</div>
                        <div><span className="text-gray-400">ANOMALY_SCORE:</span> {log.anomaly_score?.toFixed(2)}</div>
                        <div><span className="text-gray-400">REASONING:</span> {log.reasoning}</div>
                        {log.rule_violations?.length > 0 && (
                          <div className="text-danger mt-1">
                            <div className="font-bold">VIOLATIONS:</div>
                            {log.rule_violations.map((v, i) => (
                              <div key={i}>  ! {v.rule}: {v.message} [{v.severity}]</div>
                            ))}
                          </div>
                        )}
                        {log.memory_warnings?.length > 0 && (
                          <div className="text-warning mt-1">
                            <div className="font-bold">MEMORY_WARNINGS:</div>
                            {log.memory_warnings.map((v, i) => (
                              <div key={i}>  * {v.type}: {v.message}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center text-gray-500 font-mono py-4">Waiting for agent actions...</div>
        )}
      </div>
    </div>
  );
}
