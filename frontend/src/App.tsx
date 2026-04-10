import { useEffect, useState } from "react";
import { GlobalHeader } from "./components/GlobalHeader";
import { AgentRadar } from "./components/AgentRadar";
import { DecisionPipeline } from "./components/DecisionPipeline";
import { RiskMetrics } from "./components/RiskMetrics";
import { DecisionTimeline } from "./components/DecisionTimeline";
import { RogueAgentSimulator } from "./components/RogueAgentSimulator";
import { MemoryExplorer } from "./components/MemoryExplorer";
import { HitlInbox } from "./components/HitlInbox";
import { type GovernanceDecision, type GovernanceMetrics } from "./types";

function App() {
  const [showDemo, setShowDemo] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [resolvedInboxIds, setResolvedInboxIds] = useState<Set<string>>(new Set());
  const [metrics, setMetrics] = useState<GovernanceMetrics | null>(null);
  const [logs, setLogs] = useState<GovernanceDecision[]>([]);
  const [currentDecision, setCurrentDecision] = useState<GovernanceDecision | null>(null);

  const pendingEscalationsCount = logs.filter(l => l.decision === "ESCALATE" && !resolvedInboxIds.has(l.action_id)).length;

  // Clear the current decision after 10 seconds of inactivity
  useEffect(() => {
    if (currentDecision) {
      const timer = setTimeout(() => {
        setCurrentDecision(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [currentDecision]);

  // Initial Data Fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const metricsRes = await fetch("http://localhost:8000/api/v1/governance-metrics");
        if (metricsRes.ok) setMetrics(await metricsRes.json());

        const logsRes = await fetch("http://localhost:8000/api/v1/audit-log?limit=20");
        if (logsRes.ok) {
          const data = await logsRes.json();
          setLogs(data.items);
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    fetchInitialData();
  }, []);

  // SSE Subscription for real-time events
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8000/api/v1/events/stream");

    eventSource.addEventListener("connected", (e) => {
      console.log("SSE Connected:", e.data);
    });

    eventSource.addEventListener("decision", (e) => {
      const payload = JSON.parse(e.data);
      console.log("SSE Decision payload:", payload);
      
      const newDecision: GovernanceDecision = payload.data;
      
      // Update central pipeline animation
      setCurrentDecision(newDecision);
      
      // Prepend to logs
      setLogs((prevLogs) => [newDecision, ...prevLogs].slice(0, 50));
      
      // Optimistically update metrics
      setMetrics((prev) => {
        if (!prev) return prev;
        const total = prev.total_decisions + 1;
        const blocked = prev.blocked + (newDecision.decision === "BLOCK" ? 1 : 0);
        const approved = prev.approved + (newDecision.decision === "APPROVE" ? 1 : 0);
        const escalated = prev.escalated + (newDecision.decision === "ESCALATE" ? 1 : 0);
        
        return {
          ...prev,
          total_decisions: total,
          blocked,
          approved,
          escalated,
          block_rate: ((blocked / total) * 100).toFixed(1) + "%",
          // Rough avg risk update
          avg_risk_score: prev.avg_risk_score // keep static for optimism or calculate properly later
        };
      });
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="min-h-screen p-4 flex flex-col font-sans relative overflow-x-hidden">
      <GlobalHeader 
        onDemoTrigger={() => setShowDemo(true)} 
        onMemoryTrigger={() => setShowMemory(!showMemory)}
        onInboxTrigger={() => setShowInbox(true)}
        pendingEscalationsCount={pendingEscalationsCount}
      />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 h-[calc(100vh-380px)] min-h-[450px]">
        {/* Left Panel */}
        <div className="md:col-span-3 h-full">
          <AgentRadar />
        </div>

        {/* Center Panel */}
        <div className="md:col-span-6 h-full">
          <DecisionPipeline currentDecision={currentDecision} />
        </div>

        {/* Right Panel */}
        <div className="md:col-span-3 h-full">
          <RiskMetrics metrics={metrics} recentLogs={logs} />
        </div>
      </div>

      <div className="h-[300px] mt-4 shrink-0">
        <DecisionTimeline logs={logs} />
      </div>

      {showDemo && <RogueAgentSimulator onClose={() => setShowDemo(false)} />}
      
      {showMemory && <MemoryExplorer onClose={() => setShowMemory(false)} />}
      
      {showInbox && (
        <HitlInbox 
          logs={logs} 
          resolvedIds={resolvedInboxIds}
          onResolve={(id) => setResolvedInboxIds(prev => new Set(prev).add(id))}
          onClose={() => setShowInbox(false)} 
        />
      )}
    </div>
  );
}

export default App;
