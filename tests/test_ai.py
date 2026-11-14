from ai.baseline import calculate_baseline
from ai.risk_detection import detect_risk
import pandas as pd

def test_baseline_calculation():
    df = pd.DataFrame({
        'astronaut_id': ['ASTRO_01', 'ASTRO_01'],
        'heart_rate': [70, 80],
        'spo2': [98, 97],
        'temperature': [36.8, 36.9],
        'sleep_hours': [7.0, 6.5]
    })
    baseline = calculate_baseline(df, 'ASTRO_01')
    assert baseline['resting_hr_mean'] == 75.0

def test_risk_detection():
    baseline = {'resting_hr_mean': 70.0, 'resting_hr_std': 5.0}
    current = {'heart_rate': 90, 'spo2': 90}
    result = detect_risk(current, baseline)
    assert result['risk_level'] == 'RED'