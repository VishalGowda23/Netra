import { useMemo } from "react";
import { motion } from "framer-motion";
import { Inbox, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import type { GovernanceDecision } from "../types";

export function HitlInbox({ 
  logs, 
  resolvedIds, 
  onResolve, 
  onClose 
}: { 
  logs: GovernanceDecision[], 
  resolvedIds: Set<string>,
  onResolve: (id: string) => void,
  onClose: () => void 
}) {
  const escalations = useMemo(() => logs.filter(l => l.decision === "ESCALATE"), [logs]);
  const activeEscalations = escalations.filter(e => !resolvedIds.has(e.action_id));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#fdfdfd] border-4 border-black shadow-[15px_15px_0_0_#000] max-w-3xl w-full flex flex-col overflow-hidden max-h-[85vh]"
      >
        <div className="bg-warning text-black p-4 flex items-center justify-between border-b-4 border-black">
          <div className="flex items-center gap-3">
            <Inbox size={28} className="fill-black/10" />
            <h2 className="font-black text-2xl tracking-wider uppercase">Supervisory Review Queue</h2>
            {activeEscalations.length > 0 && (
              <span className="bg-danger text-white px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                {activeEscalations.length} PENDING
              </span>
            )}
          </div>
          <button onClick={onClose} className="neo-btn bg-white hover:bg-gray-100 px-3 py-1 text-sm font-bold">CLOSE</button>
        </div>

        <div className="p-6 overflow-y-auto bg-gray-50 flex-1 space-y-4">
          {activeEscalations.length === 0 ? (
            <div className="text-center py-20">
              <CheckCircle size={64} className="mx-auto mb-4 text-success opacity-50" />
              <h3 className="text-xl font-bold font-mono text-gray-500">QUEUE IS EMPTY</h3>
              <p className="text-sm font-mono text-gray-400 mt-2">All agent escalations have been resolved.</p>
            </div>
          ) : (
            activeEscalations.map((esc) => (
              <div key={esc.action_id} className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_#000] flex flex-col font-mono text-sm relative">
                <div className="absolute top-0 right-0 bg-warning text-black font-bold px-2 border-l-2 border-b-2 border-black text-xs">
                  AWAITING REVIEW
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-gray-200 border border-black p-3 rounded-full mt-1">
                    <AlertTriangle size={24} className="text-danger" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-lg mb-1">{esc.agent_name}</h4>
                    <div className="mb-2">
                      <span className="bg-gray-200 px-2 py-0.5 border border-black font-bold">
                        ACTION: {esc.action_type} - ₹{esc.amount}
                      </span>
                    </div>
                    <div className="text-gray-600 mb-3 break-words bg-gray-50 p-2 border border-gray-300 border-l-4 border-l-warning">
                      <strong>AI REASONING:</strong> {esc.reasoning}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-300">
                      <button 
                        onClick={() => onResolve(esc.action_id)}
                        className="neo-btn bg-success text-white flex-1 py-2 flex items-center justify-center gap-2 hover:bg-green-600"
                      >
                        <CheckCircle size={18} /> APPROVE ACTION
                      </button>
                      <button 
                        onClick={() => onResolve(esc.action_id)}
                        className="neo-btn bg-danger text-white flex-[0.5] py-2 flex items-center justify-center gap-2 hover:bg-red-600"
                      >
                        <XCircle size={18} /> REJECT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
