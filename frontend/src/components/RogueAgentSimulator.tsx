import { useState } from "react";
import { X, AlertOctagon, Terminal, Cpu, Zap, Play, FlaskConical } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";

interface RogueAgentSimulatorProps {
  onClose: () => void;
}

export function RogueAgentSimulator({ onClose }: RogueAgentSimulatorProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentLogs, setAgentLogs] = useState<
    { step: string; message: string; timestamp: string }[]
  >([]);
  const [agentResult, setAgentResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"live" | "manual" | "whatif">("live");

  // What-If state
  const [wifAmount, setWifAmount] = useState("50000");
  const [wifCustomer, setWifCustomer] = useState("cust_test_123");
  const [wifAction, setWifAction] = useState("refund");
  const [wifTier, setWifTier] = useState("bronze");
  const [wifResult, setWifResult] = useState<any>(null);
  const [wifLoading, setWifLoading] = useState(false);

  const simulateAction = async (
    actionType: string,
    amount: number,
    customerId: string
  ) => {
    setLoading(true);
    try {
      await fetch("http://localhost:8000/api/v1/evaluate-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action_id: `demo_${Date.now()}`,
          agent_name: "Inventory Bot",
          action_type: actionType,
          amount: amount,
          customer_id: customerId,
          customer_tier: "bronze",
          timestamp: new Date().toISOString(),
          context: { source: "rogue_demo" },
        }),
      });
      onClose();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const runLiveAgent = async (scenario: string) => {
    setAgentRunning(true);
    setAgentResult(null);
    setAgentLogs([
      {
        step: "boot",
        message: "🚀 Booting Finance Bot [Model: llama-3.3-70b-versatile via Groq]...",
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/run-live-agent?scenario=${scenario}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (data.steps) {
        setAgentLogs(data.steps);
      }

      const statusEmoji =
        data.status === "blocked"
          ? "🛑"
          : data.status === "completed"
          ? "✅"
          : "❌";
      setAgentResult(
        `${statusEmoji} ${data.status?.toUpperCase()}: ${data.result || data.error || "Unknown"}`
      );
    } catch (e) {
      setAgentResult(`❌ CONNECTION ERROR: ${e}`);
    } finally {
      setAgentRunning(false);
    }
  };

  const runWhatIf = async () => {
    setWifLoading(true);
    setWifResult(null);
    try {
      const response = await fetch("http://localhost:8000/api/v1/evaluate-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action_id: `whatif_${Date.now()}`,
          agent_name: "What-If Simulator",
          action_type: wifAction,
          amount: parseFloat(wifAmount) || 0,
          customer_id: wifCustomer,
          customer_tier: wifTier,
          timestamp: new Date().toISOString(),
          context: { source: "whatif_playground" },
        }),
      });
      const data = await response.json();
      setWifResult(data);
    } catch (e) {
      setWifResult({ error: `Connection failed: ${e}` });
    } finally {
      setWifLoading(false);
    }
  };

  const tabStyles = (tab: string) =>
    `px-4 py-2 text-sm font-bold border-b-3 transition-colors ${
      activeTab === tab
        ? "border-primary text-primary"
        : "border-transparent text-gray-400 hover:text-charcoal"
    }`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="neo-card bg-white w-full max-w-3xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] flex flex-col">
        <div className="bg-danger text-white p-4 border-b-3 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 font-bold text-xl uppercase tracking-widest">
            <AlertOctagon />
            {t("rogue_demo")}
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded-sm"
          >
            <X />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-gray-200 px-4 bg-gray-50">
          <button className={tabStyles("live")} onClick={() => setActiveTab("live")}>
            <span className="flex items-center gap-1"><Cpu size={14} /> {t("live_agent")}</span>
          </button>
          <button className={tabStyles("manual")} onClick={() => setActiveTab("manual")}>
            <span className="flex items-center gap-1"><Terminal size={14} /> {t("manual_scenarios")}</span>
          </button>
          <button className={tabStyles("whatif")} onClick={() => setActiveTab("whatif")}>
            <span className="flex items-center gap-1"><FlaskConical size={14} /> {t("what_if_title")}</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-gray-400 mb-4 text-sm">
            Select a scenario to launch an autonomous AI Agent. Its actions will be intercepted and evaluated live by the
            NETRA interception layer.
          </p>

          {/* ── Live Agent Tab ──────────────────────────────────────── */}
          {activeTab === "live" && (
            <div className="border-3 border-primary bg-primary/5 p-4 rounded-sm">
              <div className="flex items-center gap-2 mb-3">
                <Cpu size={20} className="text-primary" />
                <h3 className="font-bold text-lg uppercase tracking-wider">
                  Live AI Agent
                </h3>
                <span className="text-xs bg-primary text-white px-2 py-0.5 font-bold border border-black ml-auto">
                  REAL LLM
                </span>
              </div>
              <p className="text-sm text-charcoal mb-3">
                Launch a <strong>real AI agent</strong> powered by Groq
                llama-3.3-70b-versatile. The agent autonomously decides to use tools — and NETRA
                intercepts each tool call in real-time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  disabled={agentRunning}
                  onClick={() => runLiveAgent("dangerous_refund")}
                  className="neo-button bg-danger hover:bg-danger/90 text-white p-3 text-left"
                >
                  <div className="font-bold text-sm flex items-center gap-2">
                    <Zap size={14} /> DANGEROUS
                  </div>
                  <div className="text-xs mt-1 opacity-90">
                    ₹1,00,000 → unverified user
                  </div>
                </button>
                <button
                  disabled={agentRunning}
                  onClick={() => runLiveAgent("fraud_refund")}
                  className="neo-button bg-warning hover:bg-warning/90 text-black p-3 text-left"
                >
                  <div className="font-bold text-sm flex items-center gap-2">
                    <Zap size={14} /> FRAUD TARGET
                  </div>
                  <div className="text-xs mt-1">₹75,000 → known bad actor</div>
                </button>
                <button
                  disabled={agentRunning}
                  onClick={() => runLiveAgent("safe_refund")}
                  className="neo-button bg-success hover:bg-success/90 text-white p-3 text-left"
                >
                  <div className="font-bold text-sm flex items-center gap-2">
                    <Play size={14} /> SAFE
                  </div>
                  <div className="text-xs mt-1 opacity-90">
                    ₹500 → verified gold user
                  </div>
                </button>
              </div>

              {/* Terminal Output */}
              {agentLogs.length > 0 && (
                <div className="mt-4 bg-gray-900 text-green-400 font-mono text-xs p-4 border-2 border-black max-h-48 overflow-y-auto rounded-sm">
                  <div className="text-gray-500 mb-2">
                    ── AGENT EXECUTION LOG ──
                  </div>
                  {agentLogs.map((log, i) => (
                    <div key={i} className="mb-1">
                      <span className="text-gray-500">
                        [{log.step?.toUpperCase()}]
                      </span>{" "}
                      <span
                        className={
                          log.step === "governance_block"
                            ? "text-red-400 font-bold"
                            : log.step === "execution_complete"
                            ? "text-green-300"
                            : ""
                        }
                      >
                        {log.message}
                      </span>
                    </div>
                  ))}
                  {agentRunning && (
                    <div className="text-yellow-400 animate-pulse mt-1">
                      ▌ Agent executing...
                    </div>
                  )}
                  {agentResult && (
                    <div className="mt-2 pt-2 border-t border-gray-700 text-white font-bold">
                      {agentResult}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Manual Scenarios Tab ────────────────────────────────── */}
          {activeTab === "manual" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                disabled={loading}
                onClick={() => simulateAction("refund", 500, "cust_clean_123")}
                className="neo-button bg-[#F7F7F7] p-4 text-left group"
              >
                <div className="font-bold text-success mb-1 flex items-center justify-between">
                  {t("safe_action")}
                  <Terminal size={16} />
                </div>
                <div className="text-sm font-mono text-charcoal">
                  Normal ₹500 support refund.
                </div>
                <div className="mt-2 text-xs font-bold bg-white border border-black inline-block px-2">
                  EXPECTED: APPROVE
                </div>
              </button>

              <button
                disabled={loading}
                onClick={() => simulateAction("refund", 15000, "cust_789")}
                className="neo-button bg-[#F7F7F7] p-4 text-left group"
              >
                <div className="font-bold text-warning mb-1 flex items-center justify-between">
                  {t("suspicious_action")}
                  <Terminal size={16} />
                </div>
                <div className="text-sm font-mono text-charcoal">
                  High value refund for a new bronze user.
                </div>
                <div className="mt-2 text-xs font-bold bg-white border border-black inline-block px-2">
                  EXPECTED: ESCALATE
                </div>
              </button>

              <button
                disabled={loading}
                onClick={() => simulateAction("refund", 75000, "cust_456")}
                className="neo-button bg-[#FFD95A] p-4 text-left group"
              >
                <div className="font-bold text-danger mb-1 flex items-center justify-between">
                  {t("fraud_historical")}
                  <Terminal size={16} />
                </div>
                <div className="text-sm font-mono text-charcoal">
                  Large refund to known bad actor.
                </div>
                <div className="mt-2 text-xs font-bold bg-white border border-black inline-block px-2">
                  EXPECTED: BLOCK (Memory)
                </div>
              </button>

              <button
                disabled={loading}
                onClick={() =>
                  simulateAction(
                    "unauthorized_transfer",
                    1000000,
                    "hacker_99"
                  )
                }
                className="neo-button bg-danger text-white p-4 text-left group"
              >
                <div className="font-bold mb-1 flex items-center justify-between">
                  {t("critical_breach")}
                  <Terminal size={16} />
                </div>
                <div className="text-sm font-mono">
                  Agent hallucination dumping ₹10L.
                </div>
                <div className="mt-2 text-xs font-bold bg-black text-white inline-block px-2 border border-white">
                  EXPECTED: INSTANT BLOCK
                </div>
              </button>
            </div>
          )}

          {/* ── What-If Playground Tab ──────────────────────────────── */}
          {activeTab === "whatif" && (
            <div className="border-3 border-accent bg-accent/5 p-4 rounded-sm">
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical size={20} className="text-accent" />
                <h3 className="font-bold text-lg uppercase tracking-wider">
                  {t("what_if_title")}
                </h3>
              </div>
              <p className="text-sm text-charcoal mb-4">
                {t("what_if_desc")}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">{t("action_type")}</label>
                  <select
                    value={wifAction}
                    onChange={(e) => setWifAction(e.target.value)}
                    className="w-full border-2 border-black p-2 text-sm font-mono bg-white rounded-sm"
                  >
                    <option value="refund">Refund</option>
                    <option value="transfer">Transfer</option>
                    <option value="approve_contract">Approve Contract</option>
                    <option value="close_account">Close Account</option>
                    <option value="unauthorized_transfer">Unauthorized Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">{t("amount")} (₹)</label>
                  <input
                    type="number"
                    value={wifAmount}
                    onChange={(e) => setWifAmount(e.target.value)}
                    className="w-full border-2 border-black p-2 text-sm font-mono rounded-sm"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">{t("customer_id")}</label>
                  <input
                    type="text"
                    value={wifCustomer}
                    onChange={(e) => setWifCustomer(e.target.value)}
                    className="w-full border-2 border-black p-2 text-sm font-mono rounded-sm"
                    placeholder="cust_test_123"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Customer Tier</label>
                  <select
                    value={wifTier}
                    onChange={(e) => setWifTier(e.target.value)}
                    className="w-full border-2 border-black p-2 text-sm font-mono bg-white rounded-sm"
                  >
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                  </select>
                </div>
              </div>

              <button
                disabled={wifLoading}
                onClick={runWhatIf}
                className="neo-button bg-accent hover:bg-accent/90 text-white px-6 py-2 w-full flex items-center justify-center gap-2"
              >
                <FlaskConical size={16} />
                {wifLoading ? t("waiting") : t("run_scenario")}
              </button>

              {/* What-If Result */}
              {wifResult && !wifResult.error && (
                <div className={`mt-4 p-4 border-3 border-black rounded-sm ${
                  wifResult.decision === "BLOCK" ? "bg-danger/10" :
                  wifResult.decision === "APPROVE" ? "bg-success/10" :
                  "bg-warning/10"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-black text-lg ${
                      wifResult.decision === "BLOCK" ? "text-danger" :
                      wifResult.decision === "APPROVE" ? "text-success" :
                      "text-warning"
                    }`}>
                      {wifResult.decision === "BLOCK" ? "🛑" : wifResult.decision === "APPROVE" ? "✅" : "⚠️"} {wifResult.decision}
                    </span>
                    <span className="font-bold text-sm">Risk: {wifResult.risk_score?.toFixed(1)}/100</span>
                  </div>
                  <p className="text-sm text-charcoal leading-relaxed">
                    {wifResult.simple_explanation || wifResult.reasoning}
                  </p>
                  {wifResult.rule_violations?.length > 0 && (
                    <div className="mt-2 text-xs text-danger font-mono">
                      {wifResult.rule_violations.map((v: any, i: number) => (
                        <div key={i}>! {v.message}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {wifResult?.error && (
                <div className="mt-4 p-3 bg-danger/10 border-2 border-danger text-danger text-sm font-mono rounded-sm">
                  {wifResult.error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
