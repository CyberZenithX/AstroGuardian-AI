import pandas as pd

def calculate_baseline(df: pd.DataFrame, astronaut_id: str) -> dict:
    """Calculates personalized normal health metrics for a specific astronaut based on past logs."""
    astro_data = df[df['astronaut_id'] == astronaut_id]
    if astro_data.empty:
        return {}
    
    baseline = {
        "resting_hr_mean": float(astro_data['heart_rate'].mean()),
        "resting_hr_std": float(astro_data['heart_rate'].std()),
        "spo2_mean": float(astro_data['spo2'].mean()),
        "temperature_mean": float(astro_data['temperature'].mean()),
        "sleep_hours_mean": float(astro_data['sleep_hours'].mean())
    }
    return baseline