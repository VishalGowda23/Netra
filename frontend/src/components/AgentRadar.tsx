import { useState } from "react";
import { Bot, AlertTriangle, Key, Activity, GitCommit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../i18n/useTranslation";

interface Agent {
  id: string;
  name: string;
  trustScore: number;
  warnings: number;
  status: "active" | "idle";
  details: {
    permissions: string;
    version: string;
    last_active: string;
  };
}

const MOCK_AGENTS: Agent[] = [
  { 
    id: "1", name: "Support Bot", trustScore: 92, warnings: 0, status: "active",
    details: { permissions: "Zendesk, Postgres(Read)", version: "v2.1.0", last_active: "12s ago" }
  },
  { 
    id: "2", name: "Finance Bot", trustScore: 84, warnings: 1, status: "active",
    details: { permissions: "Stripe, Plaid(R/W)", version: "v1.4.3", last_active: "4m ago" }
  },
  { 
    id: "3", name: "DevOps Agent", trustScore: 76, warnings: 2, status: "idle",
    details: { permissions: "AWS, GitHub, Vercel", version: "v3.0.1", last_active: "2h ago" }
  },
  { 
    id: "4", name: "Inventory Bot", trustScore: 45, warnings: 5, status: "active",
    details: { permissions: "Shopify(Admin), DB(W)", version: "v1.0.9", last_active: "Active Now" }
  },
];

export function AgentRadar() {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="neo-card p-4 flex flex-col h-full bg-[#fdfdfd]">
      <h2 className="text-xl font-bold border-b-3 border-black pb-3 mb-4 flex items-center justify-between">
        {t("agent_radar")}
        <span className="neo-badge bg-primary text-white border-black">{MOCK_AGENTS.length} {t("active")}</span>
      </h2>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {MOCK_AGENTS.map((agent) => (
          <div 
            key={agent.id} 
            onClick={() => toggleExpand(agent.id)}
            className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-sm group hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold">
                <Bot size={18} className="text-primary" />
                {agent.name}
              </div>
              {agent.warnings > 0 && (
                <div className="flex items-center gap-1 text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 border border-danger">
                  <AlertTriangle size={12} />
                  {agent.warnings}
                </div>
              )}
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>{t("trust_score")}</span>
                <span className={agent.trustScore < 50 ? "text-danger" : "text-success"}>
                  {agent.trustScore}%
                </span>
              </div>
              <div className="h-3 w-full bg-gray-200 border-2 border-black rounded-sm overflow-hidden">
                <div
                  className={`h-full border-r-2 border-black ${
                    agent.trustScore > 80 ? "bg-success" : agent.trustScore > 50 ? "bg-warning" : "bg-danger"
                  }`}
                  style={{ width: `${agent.trustScore}%` }}
                />
              </div>
            </div>

            <AnimatePresence>
              {expandedId === agent.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: "1rem" }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t-2 border-dashed border-gray-300 pt-3 flex flex-col gap-2 text-xs font-mono text-charcoal">
                    <div className="flex items-start gap-2">
                      <Key size={14} className="text-gray-500 mt-0.5 shrink-0" />
                      <span className="break-all"><strong className="text-black">ACCESS:</strong> {agent.details.permissions}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <div className="flex items-center gap-2">
                        <GitCommit size={14} className="text-gray-500 shrink-0" />
                        <span><strong className="text-black">VER:</strong> {agent.details.version}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-gray-500 shrink-0" />
                        <span className="text-right"><strong className="text-black">LST_ACT:</strong> {agent.details.last_active}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ))}
      </div>
    </div>
  );
}
