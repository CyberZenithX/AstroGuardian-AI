import pandas as pd
from baseline import calculate_baseline
from risk_detection import detect_risk
from recommendations import get_nasa_recommendation

class AstroHealthMonitor:
    def __init__(self, historical_csv_path: str):
        self.df = pd.read_csv(historical_csv_path)

    def evaluate_astronaut(self, astronaut_id: str, current_reading: dict) -> dict:
        """Runs the full AI health intelligence pipeline for an astronaut."""
        baseline = calculate_baseline(self.df, astronaut_id)
        risk_eval = detect_risk(current_reading, baseline)
        recommendation = get_nasa_recommendation(risk_eval['risk_level'], risk_eval['alerts'])
        
        return {
            "astronaut_id": astronaut_id,
            "baseline": baseline,
            "risk_level": risk_eval['risk_level'],
            "alerts": risk_eval['alerts'],
            "recommendation": recommendation
        }

if __name__ == "__main__":
    # Test script locally
    monitor = AstroHealthMonitor("data/sample_health_data.csv")
    sample_current = {"heart_rate": 88, "spo2": 93, "temperature": 37.2, "sleep_hours": 4.5}
    result = monitor.evaluate_astronaut("ASTRO_01", sample_current)
    print("AI Evaluation Result:", result)