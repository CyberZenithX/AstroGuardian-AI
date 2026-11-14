def detect_risk(current_reading: dict, baseline: dict) -> dict:
    """Analyzes current telemetry against personalized baseline and NASA safety limits."""
    alerts = []
    risk_level = "GREEN" # GREEN, YELLOW, RED
    
    hr_current = current_reading.get('heart_rate', 70)
    hr_mean = baseline.get('resting_hr_mean', 70)
    hr_std = baseline.get('resting_hr_std', 5)
    
    # Check for sudden heartbeat drift from personal baseline
    if hr_current > (hr_mean + 2 * max(hr_std, 2)):
        risk_level = "YELLOW"
        alerts.append(f"Elevated Heart Rate detected: {hr_current} BPM (Baseline mean: {hr_mean:.1f})")
        
    if hr_current > 110: # Critical space adaptation threshold
        risk_level = "RED"
        alerts.append(f"Critical Heart Rate anomaly: {hr_current} BPM exceeds safe limits!")

    # Check Blood Oxygen (SpO2) against space safety norms
    spo2 = current_reading.get('spo2', 98)
    if spo2 < 92:
        risk_level = "RED"
        alerts.append(f"Critical Low Blood Oxygen (SpO2): {spo2}%")
    elif spo2 < 95:
        if risk_level != "RED": 
            risk_level = "YELLOW"
        alerts.append(f"Reduced Blood Oxygen (SpO2): {spo2}%")

    # Check Sleep Deprivation (Major HRP hazard)
    sleep = current_reading.get('sleep_hours', 7)
    if sleep < 5:
        if risk_level != "RED": 
            risk_level = "YELLOW"
        alerts.append(f"Sleep deprivation risk: {sleep} hours recorded.")

    return {
        "risk_level": risk_level,
        "alerts": alerts
    }