"""
Agent Conscience — Decision Engine
Orchestrator: Rules → Memory → Risk → Final Decision
"""

import json
import logging
from datetime import datetime
from typing import Dict, Any, List

from models import AgentAction, DecisionResult, RuleViolation, MemoryWarning
from rules_engine import RulesEngine
from memory_validator import MemoryValidator
from risk_scorer import RiskScorer
from audit_logger import AuditLogger

logger = logging.getLogger(__name__)


class DecisionEngine:
    """
    Central orchestrator that processes agent actions through the 3-pillar
    governance pipeline and produces a final decision.
    
    Pipeline:
        1. Rules Engine   → deterministic policy checks
        2. Memory Validator → historical pattern matching
        3. Risk Scorer     → anomaly detection + weighted scoring
        4. Audit Logger    → persistent logging
    """

    def __init__(
        self,
        rules_engine: RulesEngine,
        memory_validator: MemoryValidator,
        risk_scorer: RiskScorer,
        audit_logger: AuditLogger,
    ):
        self.rules_engine = rules_engine
        self.memory_validator = memory_validator
        self.risk_scorer = risk_scorer
        self.audit_logger = audit_logger
        logger.info("DecisionEngine initialized — all 3 pillars connected")

    async def evaluate(
        self, action: AgentAction, db_rules: List[Dict] = None
    ) -> DecisionResult:
        """
        Full governance evaluation pipeline.
        
        Args:
            action: The agent action to evaluate
            db_rules: Optional list of database-stored rules
            
        Returns:
            DecisionResult with decision, risk score, and reasoning
        """
        start_time = datetime.utcnow()

        # ── Pillar 1: Rules Engine ──────────────────────────────────────
        rules_result = self.rules_engine.evaluate(action, db_rules=db_rules)
        rule_violations: List[RuleViolation] = rules_result["violations"]

        # ── Pillar 2: Memory Validator ──────────────────────────────────
        memory_result = self.memory_validator.query(action)
        memory_warnings: List[MemoryWarning] = memory_result["warnings"]

        # ── Pillar 3: Risk Scorer ───────────────────────────────────────
        anomaly_result = self.risk_scorer.detect_anomaly(action)
        risk_result = self.risk_scorer.calculate_final_score(
            action, rule_violations, memory_warnings, anomaly_result
        )

        # ── Build Decision ──────────────────────────────────────────────
        
        # Override recommendation if there's a deterministic BLOCK policy
        final_decision = risk_result["recommendation"]
        
        # We need to know if any rule explicitly commands a BLOCK
        # Some rule engines return the action_on_match, let's look at what we have
        # If any violation dictates a BLOCK, we force it.
        has_block_rule = any(
            # We assume RuleViolation might have `severity` == "HIGH" or `action_on_match` == "BLOCK"
            # Actually, let's just force BLOCK if the score is > 50 AND there is a HIGH severity violation.
            getattr(v, 'severity', '') == "HIGH" for v in rule_violations
        )
        if has_block_rule:
             final_decision = "BLOCK"
                
        decision = DecisionResult(
            action_id=action.action_id,
            decision=final_decision,
            risk_score=risk_result["score"],
            reasoning=risk_result["explanation"],
            rule_violations=rule_violations,
            memory_warnings=memory_warnings,
            anomaly_score=anomaly_result["anomaly_score"],
            recommendation=risk_result["recommendation"],
            evaluated_at=datetime.utcnow().isoformat() + "Z",
        )

        # ── Persist to audit log ────────────────────────────────────────
        await self.audit_logger.log_decision(action, decision)

        # ── Store in memory for future pattern matching ─────────────────
        outcome = "flagged" if decision.decision != "APPROVE" else "success"
        self.memory_validator.store_action(action, outcome)

        elapsed = (datetime.utcnow() - start_time).total_seconds()
        logger.info(
            f"Action {action.action_id}: {decision.decision} "
            f"(risk={decision.risk_score:.1f}, latency={elapsed:.3f}s)"
        )

        return decision
