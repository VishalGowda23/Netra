import { Activity, ShieldAlert, Database, Inbox, FileText } from "lucide-react";

interface GlobalHeaderProps {
  onDemoTrigger: () => void;
  onMemoryTrigger: () => void;
  onInboxTrigger: () => void;
  pendingEscalationsCount: number;
}

export function GlobalHeader({ 
  onDemoTrigger, 
  onMemoryTrigger, 
  onInboxTrigger, 
  pendingEscalationsCount 
}: GlobalHeaderProps) {

  const downloadCIOBrief = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/cio-brief");
      if (!response.ok) throw new Error("Failed to generate brief");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `agent_conscience_brief_${new Date().toISOString().slice(0,10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("CIO Brief download failed:", e);
    }
  };

  return (
    <header className="h-16 neo-card mb-4 flex items-center justify-between px-6 bg-white shrink-0">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-white p-2 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Activity size={24} />
        </div>
          <span className="text-xl font-bold font-mono tracking-wider text-green-400">
          NETRA
          </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onMemoryTrigger}
          className="neo-btn bg-white hover:bg-gray-100 flex items-center gap-2 text-sm px-3 py-2"
        >
          <Database size={18} className="text-primary" />
          <span className="hidden md:inline">MEMORY VAULT</span>
        </button>

        <button
          onClick={onInboxTrigger}
          className="neo-btn bg-white hover:bg-gray-100 flex items-center gap-2 text-sm px-3 py-2 relative"
        >
          <Inbox size={18} className="text-warning" />
          <span className="hidden md:inline">QUEUE</span>
          {pendingEscalationsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-danger text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-black">
              {pendingEscalationsCount}
            </span>
          )}
        </button>

        <button
          onClick={downloadCIOBrief}
          className="neo-btn bg-white hover:bg-gray-100 flex items-center gap-2 text-sm px-3 py-2"
          title="Download CIO Governance Brief (PDF)"
        >
          <FileText size={18} className="text-success" />
          <span className="hidden lg:inline">CIO BRIEF</span>
        </button>

        <div className="w-px h-8 bg-black mx-1 opacity-20 hidden md:block" />

        <button
          onClick={onDemoTrigger}
          className="neo-button bg-danger hover:bg-danger/90 text-white px-4 py-2 flex items-center gap-2"
        >
          <ShieldAlert size={18} />
          <span className="hidden sm:inline">ROGUE DEMO</span>
        </button>
      </div>
    </header>
  );
}

