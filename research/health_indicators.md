$indicatorsContent = @"
# Tracked Spacecraft Health Indicators & Thresholds

AstroGuardian-AI monitors key physiological parameters tailored to microgravity adaptation and operational stress during space missions.

## 1. Cardiovascular Metrics
* **Heart Rate (HR):** 
  * *Normal Baseline:* Personalized mean $\pm$ standard deviation per astronaut.
  * *Warning Tier (YELLOW):* Deviation $> 15\%$ above baseline or acute spike $> 110$ BPM during resting phase.
  * *Critical Tier (RED):* Sustained tachycardia $> 130$ BPM or severe bradycardia $< 45$ BPM.
* **Blood Pressure (BP):**
  * *Systolic / Diastolic monitoring* to catch orthostatic intolerance risks caused by fluid shifts.

## 2. Respiratory & Oxygenation
* **Blood Oxygen Saturation ($SpO_2$):**
  * *Normal Range:* $95\% - 100\%$ in pressurized cabin environments.
  * *Warning Tier (YELLOW):* $92\% - 94\%$ (indicates potential cabin air quality fluctuation or mild hypoxia).
  * *Critical Tier (RED):* $< 92\%$ (triggers immediate emergency alert protocol).

## 3. Circadian & Recovery Metrics
* **Sleep Duration:** 
  * *Target:* $\ge 7$ hours per 24-hour cycle.
  * *Risk Flag:* $< 5$ hours triggers fatigue-induced cognitive impairment warnings per NASA HRP circadian guidelines.
* **Core Body Temperature:**
  * *Monitoring:* Tracks febrile responses or environmental thermal regulation anomalies ($> 37.8^\circ\text{C}$ or $< 35.5^\circ\text{C}$).
"@

