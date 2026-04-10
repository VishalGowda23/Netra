import { type GovernanceDecision } from "../types";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface DecisionTimelineProps {
  logs: GovernanceDecision[];
}

export function DecisionTimeline({ logs }: DecisionTimelineProps) {
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

  return (
    <div className="neo-card p-4 h-full flex flex-col bg-white">
      <h2 className="text-lg font-bold border-b-3 border-black pb-2 mb-3">
        Decision Log (Audit Trail)
      </h2>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {logs.map((log) => (
          <div 
            key={log.action_id} 
            className={`border-2 border-black border-l-8 p-3 flex items-start justify-between font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] transition-transform ${getStyle(log.decision)}`}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {getIcon(log.decision)}
                <span className="font-bold">{log.decision}</span>
                <span className="text-gray-500 text-xs">
                  {new Date(log.evaluated_at).toLocaleTimeString()}
                </span>
                <span className="bg-black text-white px-1 ml-2 text-xs">
                  {log.agent_name}
                </span>
              </div>
              <div className="text-charcoal font-sans text-sm">
                Requested <span className="font-bold">{log.action_type.toUpperCase()}</span> (₹{log.amount}) for {log.customer_id}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold font-sans">RISK</div>
              <div className={`font-bold ${log.risk_score > 50 ? 'text-danger' : 'text-charcoal'}`}>
                {log.risk_score.toFixed(1)}
              </div>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center text-gray-500 font-mono py-4">Waiting for agent actions...</div>
        )}
      </div>
    </div>
  );
}
