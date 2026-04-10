/**
 * NETRA i18n Translation System
 * Lightweight, zero-dependency internationalization.
 */

export type Language = "en" | "hi" | "es" | "mr";

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  es: "Español",
  mr: "मराठी"
};

type TranslationKey =
  | "app_name"
  | "app_subtitle"
  | "agent_radar"
  | "active"
  | "trust_score"
  | "live_pipeline"
  | "simple"
  | "technical"
  | "plain_english_summary"
  | "risk_metrics"
  | "block_rate"
  | "avg_risk"
  | "governed"
  | "roi"
  | "saved"
  | "heatmap_title"
  | "heatmap_click"
  | "decision_detail"
  | "approved"
  | "blocked"
  | "escalated"
  | "decision_log"
  | "risk"
  | "waiting"
  | "monitoring"
  | "memory_vault"
  | "queue"
  | "cio_brief"
  | "rogue_demo"
  | "voice_on"
  | "voice_off"
  | "rule_violations"
  | "memory_warnings"
  | "custom_scenario"
  | "run_scenario"
  | "amount"
  | "customer_id"
  | "action_type"
  | "what_if_title"
  | "what_if_desc"
  | "live_agent"
  | "manual_scenarios"
  | "safe_action"
  | "suspicious_action"
  | "fraud_historical"
  | "critical_breach";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    app_name: "NETRA",
    app_subtitle: "Network for Ethical Tool-use Risk Regulation Architecture",
    agent_radar: "Agent Radar",
    active: "ACTIVE",
    trust_score: "TRUST SCORE",
    live_pipeline: "Live Decision Pipeline",
    simple: "Simple",
    technical: "Technical",
    plain_english_summary: "Plain English Summary",
    risk_metrics: "Risk & Metrics",
    block_rate: "BLOCK RATE",
    avg_risk: "AVG RISK",
    governed: "GOVERNED",
    roi: "ROI",
    saved: "saved",
    heatmap_title: "RECENT DECISION HEATMAP",
    heatmap_click: "Click any cell to view details",
    decision_detail: "Decision Detail",
    approved: "APPROVED",
    blocked: "BLOCKED",
    escalated: "ESCALATED",
    decision_log: "Decision Log (Audit Trail)",
    risk: "RISK",
    waiting: "Waiting...",
    monitoring: "Monitoring Agent Intentions",
    memory_vault: "MEMORY VAULT",
    queue: "QUEUE",
    cio_brief: "CIO BRIEF",
    rogue_demo: "ROGUE DEMO",
    voice_on: "Voice ON",
    voice_off: "Voice OFF",
    rule_violations: "Rule Violations",
    memory_warnings: "Memory Warnings",
    custom_scenario: "Custom Scenario",
    run_scenario: "Run Scenario",
    amount: "Amount",
    customer_id: "Customer ID",
    action_type: "Action Type",
    what_if_title: "What-If Playground",
    what_if_desc: "Test any scenario — adjust the parameters and see what NETRA would do.",
    live_agent: "Live AI Agent",
    manual_scenarios: "Manual Scenarios",
    safe_action: "SAFE ACTION",
    suspicious_action: "SUSPICIOUS ACTION",
    fraud_historical: "FRAUD HISTORICAL",
    critical_breach: "CRITICAL BREACH",
  },
  hi: {
    app_name: "NETRA",
    app_subtitle: "नैतिक टूल-उपयोग जोखिम विनियमन वास्तुकला के लिए नेटवर्क",
    agent_radar: "एजेंट रडार",
    active: "सक्रिय",
    trust_score: "विश्वास स्कोर",
    live_pipeline: "लाइव निर्णय पाइपलाइन",
    simple: "सरल",
    technical: "तकनीकी",
    plain_english_summary: "सरल भाषा में सारांश",
    risk_metrics: "जोखिम और मेट्रिक्स",
    block_rate: "ब्लॉक दर",
    avg_risk: "औसत जोखिम",
    governed: "शासित",
    roi: "ROI",
    saved: "बचाया",
    heatmap_title: "हाल के निर्णय हीटमैप",
    heatmap_click: "विवरण देखने के लिए किसी भी सेल पर क्लिक करें",
    decision_detail: "निर्णय विवरण",
    approved: "स्वीकृत",
    blocked: "अवरुद्ध",
    escalated: "बढ़ाया गया",
    decision_log: "निर्णय लॉग (ऑडिट ट्रेल)",
    risk: "जोखिम",
    waiting: "प्रतीक्षा...",
    monitoring: "एजेंट इरादों की निगरानी",
    memory_vault: "मेमोरी वॉल्ट",
    queue: "कतार",
    cio_brief: "CIO ब्रीफ",
    rogue_demo: "रोग डेमो",
    voice_on: "आवाज़ चालू",
    voice_off: "आवाज़ बंद",
    rule_violations: "नियम उल्लंघन",
    memory_warnings: "मेमोरी चेतावनी",
    custom_scenario: "कस्टम परिदृश्य",
    run_scenario: "परिदृश्य चलाएं",
    amount: "राशि",
    customer_id: "ग्राहक ID",
    action_type: "कार्रवाई प्रकार",
    what_if_title: "क्या-अगर खेल का मैदान",
    what_if_desc: "किसी भी परिदृश्य का परीक्षण करें — पैरामीटर समायोजित करें और देखें NETRA क्या करेगा।",
    live_agent: "लाइव AI एजेंट",
    manual_scenarios: "मैन्युअल परिदृश्य",
    safe_action: "सुरक्षित कार्य",
    suspicious_action: "संदिग्ध कार्य",
    fraud_historical: "ऐतिहासिक धोखाधड़ी",
    critical_breach: "गंभीर उल्लंघन",
  },
  es: {
    app_name: "NETRA",
    app_subtitle: "Red para la Regulación Ética del Riesgo en el Uso de Herramientas",
    agent_radar: "Radar de Agentes",
    active: "ACTIVO",
    trust_score: "PUNTUACIÓN DE CONFIANZA",
    live_pipeline: "Pipeline de Decisiones en Vivo",
    simple: "Simple",
    technical: "Técnico",
    plain_english_summary: "Resumen en Lenguaje Simple",
    risk_metrics: "Riesgo y Métricas",
    block_rate: "TASA DE BLOQUEO",
    avg_risk: "RIESGO PROM.",
    governed: "GOBERNADOS",
    roi: "ROI",
    saved: "ahorrado",
    heatmap_title: "MAPA DE DECISIONES RECIENTES",
    heatmap_click: "Haz clic en cualquier celda para ver detalles",
    decision_detail: "Detalle de Decisión",
    approved: "APROBADO",
    blocked: "BLOQUEADO",
    escalated: "ESCALADO",
    decision_log: "Registro de Decisiones (Auditoría)",
    risk: "RIESGO",
    waiting: "Esperando...",
    monitoring: "Monitoreando Intenciones del Agente",
    memory_vault: "BÓVEDA DE MEMORIA",
    queue: "COLA",
    cio_brief: "INFORME CIO",
    rogue_demo: "DEMO ROGUE",
    voice_on: "Voz ON",
    voice_off: "Voz OFF",
    rule_violations: "Violaciones de Reglas",
    memory_warnings: "Advertencias de Memoria",
    custom_scenario: "Escenario Personalizado",
    run_scenario: "Ejecutar Escenario",
    amount: "Monto",
    customer_id: "ID de Cliente",
    action_type: "Tipo de Acción",
    what_if_title: "Laboratorio ¿Qué Pasaría Si?",
    what_if_desc: "Prueba cualquier escenario — ajusta los parámetros y observa qué haría NETRA.",
    live_agent: "Agente IA en Vivo",
    manual_scenarios: "Escenarios Manuales",
    safe_action: "ACCIÓN SEGURA",
    suspicious_action: "ACCIÓN SOSPECHOSA",
    fraud_historical: "FRAUDE HISTÓRICO",
    critical_breach: "VIOLACIÓN CRÍTICA",
  },
  mr: {
    app_name: "NETRA",
    app_subtitle: "नैतिक साधन-वापर जोखीम नियमन वास्तुकलासाठी नेटवर्क",
    agent_radar: "एजंट रडार",
    active: "सक्रिय",
    trust_score: "विश्वास स्कोअर",
    live_pipeline: "थेट निर्णय पाइपलाइन",
    simple: "सोपे",
    technical: "तांत्रिक",
    plain_english_summary: "साध्या भाषेतील सारांश",
    risk_metrics: "जोखीम आणि मेट्रिक्स",
    block_rate: "ब्लॉक रेट",
    avg_risk: "सरासरी जोखीम",
    governed: "नियंत्रित",
    roi: "ROI",
    saved: "वाचवले",
    heatmap_title: "अलीकडील निर्णय हीटमॅप",
    heatmap_click: "तपशील पाहण्यासाठी कोणत्याही सेलवर क्लिक करा",
    decision_detail: "निर्णय तपशील",
    approved: "मंजूर",
    blocked: "अवरोधित",
    escalated: "वाढवले",
    decision_log: "निर्णय लॉग (ऑडिट ट्रेल)",
    risk: "जोखीम",
    waiting: "वाट पाहत आहे...",
    monitoring: "एजंटच्या हेतूंचे निरीक्षण करत आहे",
    memory_vault: "मेमरी व्हॉल्ट",
    queue: "रांग",
    cio_brief: "सीआयओ संक्षिप्त अहवाल",
    rogue_demo: "रोग डेमो",
    voice_on: "आवाज चालू",
    voice_off: "आवाज बंद",
    rule_violations: "नियम उल्लंघन",
    memory_warnings: "मेमरी चेतावणी",
    custom_scenario: "सानुकूल परिस्थिती",
    run_scenario: "परिस्थिती चालवा",
    amount: "रक्कम",
    customer_id: "ग्राहक ओळखपत्र",
    action_type: "कृती प्रकार",
    what_if_title: "काय-जर खेळाचे मैदान",
    what_if_desc: "कोणत्याही परिस्थितीची चाचणी घ्या - मापदंड समायोजित करा आणि NETRA काय करेल ते पहा.",
    live_agent: "थेट AI एजंट",
    manual_scenarios: "मॅन्युअल परिस्थिती",
    safe_action: "सुरक्षित कृती",
    suspicious_action: "संशयास्पद कृती",
    fraud_historical: "ऐतिहासिक फसवणूक",
    critical_breach: "गंभीर उल्लंघन",
  },
};

let currentLanguage: Language = "en";
const listeners: Set<() => void> = new Set();

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  listeners.forEach((fn) => fn());
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function t(key: TranslationKey): string {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

export function onLanguageChange(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
