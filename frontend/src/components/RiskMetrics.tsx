import { useEffect, useState } from "react";
import { type GovernanceMetrics, type GovernanceDecision } from "../types";
import { ShieldCheck, Target, Activity, TrendingUp } from "lucide-react";

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
  const [roi, setRoi] = useState<ROIData | null>(null);

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

  // Generate a mock heatmap grid based on recent logs
  const gridSize = 35; // 7x5
  const gridCells = Array(gridSize).fill("empty");
  
  recentLogs.slice(0, gridSize).forEach((log, i) => {
    gridCells[i] = log.decision;
  });

  const getHeatmapColor = (status: string) => {
    switch (status) {
      case "APPROVE": return "bg-success";
      case "BLOCK": return "bg-danger";
      case "ESCALATE": return "bg-warning";
      default: return "bg-gray-100 border-dashed";
    }
  };

  return (
    <div className="neo-card p-4 flex flex-col h-full bg-[#fdfdfd]">
      <h2 className="text-xl font-bold border-b-3 border-black pb-3 mb-4">
        Risk & Metrics
      </h2>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
            <Target size={14} /> BLOCK RATE
          </div>
          <div className="text-2xl font-bold text-danger">
            {metrics ? metrics.block_rate : "0.0%"}
          </div>
        </div>
        <div className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
            <Activity size={14} /> AVG RISK
          </div>
          <div className="text-2xl font-bold text-warning">
            {metrics ? metrics.avg_risk_score : "0.0"}
          </div>
        </div>
        <div className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
            <ShieldCheck size={14} /> GOVERNED
          </div>
          <div className="text-2xl font-bold text-primary">
            {metrics ? metrics.total_decisions : 0}
          </div>
        </div>

        {/* ROI Card */}
        <div className="border-2 border-black p-3 bg-success/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
            <TrendingUp size={14} /> ROI
          </div>
          <div className="text-2xl font-bold text-success">
            {roi ? `${roi.roi_multiplier.toLocaleString()}×` : "—"}
          </div>
          {roi && roi.damage_prevented > 0 && (
            <div className="text-[10px] font-bold text-charcoal mt-0.5">
              ₹{roi.damage_prevented.toLocaleString()} saved
            </div>
          )}
        </div>
      </div>

      {/* Heatmap */}
      <div>
        <h3 className="text-sm font-bold mb-2">RECENT DECISION HEATMAP</h3>
        <div className="grid grid-cols-7 gap-1">
          {gridCells.map((cell, i) => (
            <div 
              key={i} 
              className={`aspect-square border-2 border-black rounded-sm ${getHeatmapColor(cell)} transition-colors duration-500`}
              title={cell !== "empty" ? cell : ""}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs font-bold">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-success border border-black"/> APPROVED</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-danger border border-black"/> BLOCKED</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-warning border border-black"/> ESCALATED</div>
        </div>
      </div>
    </div>
  );
}

