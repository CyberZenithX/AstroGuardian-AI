def get_nasa_recommendation(risk_level: str, alerts: list) -> str:
    """Generates explainable action guidance aligned with NASA Human Research Program protocols."""
    if risk_level == "GREEN":
        return "All physiological indicators are stable within personalized baseline parameters. Continue scheduled mission operations."
    elif risk_level == "YELLOW":
        return (
            "Caution: Minor physiological deviation from baseline detected. "
            "Per NASA HRP guidelines for fatigue and cardiovascular adaptation: "
            "1. Re-verify sensor placement and re-measure vitals in 30 minutes. "
            "2. Review sleep hygiene and hydration protocols. "
            "3. Log symptoms in the crew portal if persistent."
        )
    else:
        return (
            "CRITICAL ALERT: Significant anomaly detected! "
            "Immediate Action Required per Spaceflight Medical Protocol: "
            "1. Notify the Crew Medical Officer (CMO) immediately. "
            "2. Rest in a stable posture and initiate offline medical diagnostic check. "
            "3. Prepare for telemetry sync with ground flight surgeons when communication window opens."
        )