import { useState } from "react";
import { Activity, ShieldAlert, Database, Inbox, FileText, Volume2, VolumeX, Globe, ChevronDown } from "lucide-react";
import { useTranslation, setLanguage, LANGUAGE_NAMES, type Language } from "../i18n/useTranslation";
import { isNarratorEnabled, setNarratorEnabled } from "../lib/narrator";

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
  pendingEscalationsCount,
}: GlobalHeaderProps) {
  const { t } = useTranslation();
  const [voiceOn, setVoiceOn] = useState(isNarratorEnabled());
  const [langOpen, setLangOpen] = useState(false);

  const toggleVoice = () => {
    const newState = !voiceOn;
    setVoiceOn(newState);
    setNarratorEnabled(newState);
  };

  const downloadCIOBrief = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/cio-brief");
      if (!response.ok) throw new Error("Failed to generate brief");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `netra_brief_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("CIO Brief download failed:", e);
    }
  };

  return (
    <header className="neo-card mb-4 flex items-center justify-between px-6 py-3 bg-white shrink-0 relative z-[100]">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-white p-2 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Activity size={24} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-mono tracking-wider text-green-400">
              {t("app_name")}
            </span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="All systems operational" />
          </div>
          <span className="text-[10px] text-gray-400 font-mono tracking-wide hidden lg:block">
            {t("app_subtitle")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="neo-btn bg-white hover:bg-gray-100 flex items-center gap-1 text-xs px-2 py-2"
          >
            <Globe size={16} className="text-primary" />
            <ChevronDown size={12} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-[9999] rounded-sm overflow-hidden">
              {(Object.entries(LANGUAGE_NAMES) as [Language, string][]).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => { setLanguage(code); setLangOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm font-bold hover:bg-primary/10 transition-colors"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Voice Toggle */}
        <button
          onClick={toggleVoice}
          className={`neo-btn flex items-center gap-1 text-xs px-2 py-2 ${voiceOn ? "bg-primary/10" : "bg-white hover:bg-gray-100"}`}
          title={voiceOn ? t("voice_on") : t("voice_off")}
        >
          {voiceOn ? <Volume2 size={16} className="text-primary" /> : <VolumeX size={16} className="text-gray-400" />}
        </button>

        <button
          onClick={onMemoryTrigger}
          className="neo-btn bg-white hover:bg-gray-100 flex items-center gap-2 text-sm px-3 py-2"
        >
          <Database size={18} className="text-primary" />
          <span className="hidden md:inline">{t("memory_vault")}</span>
        </button>

        <button
          onClick={onInboxTrigger}
          className="neo-btn bg-white hover:bg-gray-100 flex items-center gap-2 text-sm px-3 py-2 relative"
        >
          <Inbox size={18} className="text-warning" />
          <span className="hidden md:inline">{t("queue")}</span>
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
          <span className="hidden lg:inline">{t("cio_brief")}</span>
        </button>

        <div className="w-px h-8 bg-black mx-1 opacity-20 hidden md:block" />

        <button
          onClick={onDemoTrigger}
          className="neo-button bg-danger hover:bg-danger/90 text-white px-4 py-2 flex items-center gap-2"
        >
          <ShieldAlert size={18} />
          <span className="hidden sm:inline">{t("rogue_demo")}</span>
        </button>
      </div>
    </header>
  );
}
