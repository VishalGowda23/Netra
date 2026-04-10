import { motion, AnimatePresence } from "framer-motion";
import { type GovernanceDecision } from "../types";
import { Server, Database, BrainCircuit, ActivitySquare, CheckCircle, OctagonAlert, Eye, Code, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../i18n/useTranslation";

interface DecisionPipelineProps {
  currentDecision: GovernanceDecision | null;
}

export function DecisionPipeline({ currentDecision }: DecisionPipelineProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"simple" | "technical">("simple");
  const isIdle = !currentDecision;

  const isBlock = currentDecision?.decision === "BLOCK";
  const isApprove = currentDecision?.decision === "APPROVE";
  const isEscalate = currentDecision?.decision === "ESCALATE";

  const getNodeColor = (isActive: boolean, hasFailed: boolean = false) => {
    if (hasFailed) return "border-danger bg-danger/10 text-danger shadow-[0_0_20px_rgba(255,107,107,0.6)]";
    if (isActive) return "border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(58,91,255,0.6)]";
    return "border-gray-300 bg-white/50 text-gray-400";
  };

  const ruleCount = currentDecision?.rule_violations?.length ?? 0;
  const memoryCount = currentDecision?.memory_warnings?.length ?? 0;

  const pipelineNodes = [
    {
      icon: ActivitySquare,
      label: "Agent\nIntent",
      sublabel: currentDecision ? `${currentDecision.action_type?.toUpperCase()}` : "",
      isActive: !isIdle,
      hasFailed: false,
      delay: 0,
    },
    {
      icon: Server,
      label: "Rules\nEngine",
      sublabel: currentDecision ? (ruleCount > 0 ? `${ruleCount} violation${ruleCount > 1 ? 's' : ''}` : "✓ Passed") : "",
      isActive: !isIdle,
      hasFailed: ruleCount > 0,
      delay: 0.15,
    },
    {
      icon: Database,
      label: "Memory\nValidator",
      sublabel: currentDecision ? (memoryCount > 0 ? `${memoryCount} warning${memoryCount > 1 ? 's' : ''}` : "✓ Clear") : "",
      isActive: !isIdle,
      hasFailed: memoryCount > 0,
      delay: 0.3,
    },
    {
      icon: BrainCircuit,
      label: "Anomaly\nScorer",
      sublabel: currentDecision ? `Score: ${currentDecision.anomaly_score?.toFixed(0)}%` : "",
      isActive: !isIdle,
      hasFailed: (currentDecision?.anomaly_score ?? 0) > 50,
      delay: 0.45,
    },
  ];

  return (
    <div className="neo-card p-6 flex flex-col h-full bg-white relative overflow-hidden">
      <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-6">
        <h2 className="text-2xl font-bold">{t("live_pipeline")}</h2>
        {currentDecision && (
          <div className="flex border-2 border-black rounded-sm overflow-hidden text-xs font-bold">
            <button
              onClick={() => setViewMode("simple")}
              className={`px-3 py-1.5 flex items-center gap-1 transition-colors ${viewMode === "simple" ? "bg-primary text-white" : "bg-white text-charcoal hover:bg-gray-100"}`}
            >
              <Eye size={12} /> {t("simple")}
            </button>
            <button
              onClick={() => setViewMode("technical")}
              className={`px-3 py-1.5 flex items-center gap-1 border-l-2 border-black transition-colors ${viewMode === "technical" ? "bg-charcoal text-green-400" : "bg-white text-charcoal hover:bg-gray-100"}`}
            >
              <Code size={12} /> {t("technical")}
            </button>
          </div>
        )}
      </div>

      {/* Pipeline Nodes */}
      <div className="flex items-start justify-between px-2 z-10 w-full mb-4 relative">
        {/* Animated connecting line */}
        <div className="absolute top-8 left-12 right-24 h-0.5 bg-gray-200 z-0" />
        {!isIdle && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className={`absolute top-8 left-12 h-0.5 z-0 ${isBlock ? "bg-danger" : isApprove ? "bg-success" : "bg-warning"}`}
            style={{ maxWidth: "calc(100% - 6rem)" }}
          />
        )}

        {pipelineNodes.map((node, i) => (
          <div key={i} className="flex flex-col items-center max-w-[110px] z-10">
            <motion.div
              animate={!isIdle ? {
                scale: [1, 1.15, 1],
                transition: { delay: node.delay, duration: 0.4 }
              } : {}}
              className={`w-14 h-14 rounded-full border-3 flex items-center justify-center transition-all duration-500 ${getNodeColor(node.isActive, node.hasFailed)}`}
            >
              <node.icon size={24} />
            </motion.div>
            <div className="mt-2 text-center font-bold text-xs whitespace-pre-line leading-tight h-8">{node.label}</div>
            {node.sublabel && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: node.delay + 0.3 }}
                className={`text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded-sm border ${
                  node.hasFailed ? "bg-danger/10 text-danger border-danger/30" : "bg-success/10 text-success border-success/30"
                }`}
              >
                {node.sublabel}
              </motion.div>
            )}
          </div>
        ))}

        {/* Connector arrow to verdict */}
        {!isIdle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center self-center z-10 mt-1"
          >
            <ChevronRight size={20} className="text-gray-400" />
          </motion.div>
        )}

        {/* Final Verdict Node */}
        <div className="flex flex-col items-center z-10">
          <AnimatePresence mode="wait">
            {!isIdle ? (
              <motion.div
                key="verdict"
                initial={{ scale: 0, opacity: 0, rotate: -10 }}
                animate={{
                  scale: 1, opacity: 1, rotate: 0,
                  x: isBlock ? [-4, 4, -4, 4, 0] : 0
                }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                className={`w-16 h-16 rounded-md border-4 flex items-center justify-center text-white font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
                  isBlock ? "bg-danger border-black" :
                  isApprove ? "bg-success border-black" : "bg-warning border-black"
                }`}
              >
                {isBlock ? <OctagonAlert size={32} /> : isApprove ? <CheckCircle size={32} /> : "ESC"}
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-md border-3 flex items-center justify-center border-dashed border-gray-300 text-gray-300 text-2xl"
              >
                ?
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-2 text-center font-bold text-sm uppercase tracking-widest">
            {isIdle ? t("waiting") : currentDecision.decision === "BLOCK" ? t("blocked") : currentDecision.decision === "APPROVE" ? t("approved") : t("escalated")}
          </div>
        </div>
      </div>

      {/* Explanation Panel */}
      <AnimatePresence mode="wait">
        {currentDecision && viewMode === "simple" && (
          <motion.div
            key="simple"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`mt-4 p-4 rounded-sm border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
              isBlock ? "bg-danger/5" : isApprove ? "bg-success/5" : "bg-warning/5"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Eye size={16} className="text-primary" />
              <span className="font-bold text-sm text-primary uppercase tracking-wider">{t("plain_english_summary")}</span>
            </div>
            <p className="text-sm text-charcoal leading-relaxed">
              {currentDecision.simple_explanation || currentDecision.reasoning}
            </p>
          </motion.div>
        )}

        {currentDecision && viewMode === "technical" && (
          <motion.div
            key="technical"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mt-4 neo-card p-4 bg-[#1F2933] text-[#F7F7F7] font-mono text-xs max-h-52 overflow-y-auto"
          >
            <div className="flex border-b border-gray-600 pb-2 mb-2 items-center justify-between font-bold">
              <span className="text-primary flex items-center gap-1"><Code size={12} /> FORENSIC_ANALYSIS</span>
              <span className={isBlock ? "text-danger" : isEscalate ? "text-warning" : "text-success"}>
                [{currentDecision.decision}]
              </span>
            </div>
            <div className="space-y-1.5">
              <div><span className="text-gray-500">ACTION_ID:</span> {currentDecision.action_id}</div>
              <div><span className="text-gray-500">AGENT:</span> {currentDecision.agent_name}</div>
              <div><span className="text-gray-500">INTENT:</span> {currentDecision.action_type?.toUpperCase()} — ₹{currentDecision.amount?.toLocaleString()}</div>
              <div><span className="text-gray-500">RISK_SCORE:</span> {currentDecision.risk_score?.toFixed(2)}</div>
              <div><span className="text-gray-500">ANOMALY_SCORE:</span> {currentDecision.anomaly_score?.toFixed(2)}</div>

              {ruleCount > 0 && (
                <div className="mt-2 text-danger">
                  <span className="font-bold border-b border-danger inline-block mb-1">VIOLATIONS ({ruleCount}):</span>
                  {currentDecision.rule_violations.map((v, i) => (
                    <div key={i}>! {v.message} <span className="text-gray-500">({v.rule})</span></div>
                  ))}
                </div>
              )}

              {memoryCount > 0 && (
                <div className="mt-2 text-warning">
                  <span className="font-bold border-b border-warning inline-block mb-1">MEMORY_WARNINGS ({memoryCount}):</span>
                  {currentDecision.memory_warnings.map((v, i) => (
                    <div key={i}>* {v.message}</div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle state radar sweep */}
      {isIdle && (
        <div className="flex-1 flex items-center justify-center relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center"
          >
            <div className="w-16 h-0.5 bg-primary/40 origin-left" />
          </motion.div>
          <div className="absolute text-gray-400 font-bold tracking-widest uppercase text-sm mt-44 animate-pulse">
            {t("monitoring")}
          </div>
        </div>
      )}
    </div>
  );
}
