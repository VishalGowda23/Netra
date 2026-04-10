import { motion, AnimatePresence } from "framer-motion";
import { type GovernanceDecision } from "../types";
import { Server, Database, BrainCircuit, ActivitySquare, CheckCircle, OctagonAlert } from "lucide-react";

interface DecisionPipelineProps {
  currentDecision: GovernanceDecision | null;
}

export function DecisionPipeline({ currentDecision }: DecisionPipelineProps) {
  // If no decision, show idle state
  const isIdle = !currentDecision;
  
  // States: pending -> evaluating -> decided
  
  // Block node styling helper
  const getNodeStateClass = (isActive: boolean, hasFailed: boolean = false) => {
    if (hasFailed) return "border-danger bg-danger/10 text-danger shadow-[0_0_15px_rgba(255,107,107,0.5)]";
    if (isActive) return "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(58,91,255,0.5)]";
    return "border-black bg-white opacity-50";
  };

  const isBlock = currentDecision?.decision === "BLOCK";
  const isApprove = currentDecision?.decision === "APPROVE";
  const isEscalate = currentDecision?.decision === "ESCALATE";

  // Detailed forensic breakdown if decision is made
  const renderForensics = () => {
    if (!currentDecision) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 neo-card p-4 bg-[#1F2933] text-[#F7F7F7] font-mono text-sm max-h-48 overflow-y-auto"
      >
        <div className="flex border-b border-gray-600 pb-2 mb-2 items-center justify-between font-bold">
          <span className="text-primary">FORENSIC_ANALYSIS</span>
          <span className={isBlock ? "text-danger" : isEscalate ? "text-warning" : "text-success"}>
            [{currentDecision.decision}]
          </span>
        </div>
        <div className="space-y-2">
          <div><span className="text-gray-400">ACTION_ID:</span> {currentDecision.action_id}</div>
          <div><span className="text-gray-400">AGENT:</span> {currentDecision.agent_name}</div>
          <div><span className="text-gray-400">INTENT:</span> {currentDecision.action_type.toUpperCase()} - ₹{currentDecision.amount}</div>
          <div><span className="text-gray-400">RISK_SCORE:</span> {currentDecision.risk_score.toFixed(2)}</div>
          
          {currentDecision.rule_violations?.length > 0 && (
            <div className="mt-2 text-danger">
              <span className="font-bold border-b border-danger inline-block mb-1">VIOLATIONS:</span>
              {currentDecision.rule_violations.map((v, i) => (
                <div key={i}>! {v.message} ({v.rule})</div>
              ))}
            </div>
          )}
          
          {currentDecision.memory_warnings?.length > 0 && (
            <div className="mt-2 text-warning">
              <span className="font-bold border-b border-warning inline-block mb-1">MEMORY_WARNINGS:</span>
              {currentDecision.memory_warnings.map((v, i) => (
                <div key={i}>* {v.message}</div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="neo-card p-6 flex flex-col h-full bg-white relative overflow-hidden">
      <h2 className="text-2xl font-bold border-b-3 border-black pb-3 mb-8">
        Live Decision Pipeline
      </h2>

      {/* Decorative pulse line background */}
      <div className="absolute top-[160px] left-10 right-10 h-1 bg-gray-200 -z-10" />

      <div className="flex justify-between items-start flex-1 px-4 z-10 w-full mb-10">
        
        {/* Node 1: Intent Received */}
        <div className="flex flex-col items-center max-w-[120px]">
          <motion.div 
            animate={{ scale: isIdle ? 1 : 1.1 }}
            className={`w-16 h-16 rounded-full border-3 flex items-center justify-center bg-white ${getNodeStateClass(!isIdle)} transition-all duration-300`}
          >
            <ActivitySquare size={28} />
          </motion.div>
          <div className="mt-3 text-center font-bold text-sm h-10">Agent Intent</div>
        </div>

        {/* Node 2: Rules Engine */}
        <div className="flex flex-col items-center max-w-[120px]">
          <motion.div 
             animate={!isIdle ? { 
                scale: [1, 1.1, 1],
                borderColor: (currentDecision.rule_violations?.length ?? 0) > 0 ? "#FF6B6B" : "#3A5BFF"
             } : {}}
             transition={{ delay: 0.2 }}
            className={`w-16 h-16 rounded-sm border-3 flex items-center justify-center bg-white ${getNodeStateClass(!isIdle, (currentDecision?.rule_violations?.length ?? 0) > 0)} transition-all duration-300`}
          >
            <Server size={28} />
          </motion.div>
          <div className="mt-3 text-center font-bold text-sm h-10">Rules<br/>Engine</div>
        </div>

        {/* Node 3: Memory Validator */}
        <div className="flex flex-col items-center max-w-[120px]">
          <motion.div 
             animate={!isIdle ? { 
                scale: [1, 1.1, 1],
                borderColor: (currentDecision.memory_warnings?.length ?? 0) > 0 ? "#FFD95A" : "#3A5BFF"
             } : {}}
             transition={{ delay: 0.4 }}
            className={`w-16 h-16 rounded-sm border-3 flex items-center justify-center bg-white ${getNodeStateClass(!isIdle, false)} transition-all duration-300`}
          >
            <Database size={28} />
          </motion.div>
          <div className="mt-3 text-center font-bold text-sm h-10">Memory<br/>Validator</div>
        </div>

        {/* Node 4: Risk Scorer */}
        <div className="flex flex-col items-center max-w-[120px]">
          <motion.div 
             animate={!isIdle ? { scale: [1, 1.1, 1] } : {}}
             transition={{ delay: 0.6 }}
            className={`w-16 h-16 rounded-sm border-3 flex items-center justify-center bg-white ${getNodeStateClass(!isIdle, false)} transition-all duration-300`}
          >
            <BrainCircuit size={28} />
          </motion.div>
          <div className="mt-3 text-center font-bold text-sm h-10">Anomaly<br/>Risk Scorer</div>
        </div>

        {/* Final Decision Node */}
        <div className="flex flex-col items-center max-w-[120px]">
          <AnimatePresence mode="wait">
            {!isIdle ? (
              <motion.div
                key="verdict"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  x: isBlock ? [-5, 5, -5, 5, 0] : 0 // Shake effect on block
                }}
                transition={{ delay: 0.8 }}
                className={`w-20 h-20 rounded-md border-4 flex items-center justify-center text-white font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
                  isBlock ? "bg-danger border-black" : 
                  isApprove ? "bg-success border-black" : "bg-warning border-black"
                }`}
              >
                {isBlock ? <OctagonAlert size={36} /> : isApprove ? <CheckCircle size={36} /> : "ESC"}
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-20 h-20 rounded-md border-4 flex items-center justify-center border-dashed border-gray-300 text-gray-300"
              >
                ?
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-4 text-center font-bold text-lg h-10 uppercase tracking-widest">
            {isIdle ? "Waiting..." : currentDecision.decision}
          </div>
        </div>

      </div>

      {renderForensics()}

      {isIdle && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-20">
          <div className="text-gray-400 font-bold tracking-widest uppercase opacity-30 text-2xl animate-pulse">
            Monitoring Agent Intentions
          </div>
        </div>
      )}
    </div>
  );
}
