# 🚀 AstroGuardian-AI
### Intelligent Astronaut Health Monitoring & Early Warning System

> **Mission Statement:** To empower astronauts on long-duration space missions with intelligent, personalized, and reliable health monitoring, helping them recognize potential health risks and take timely action[cite: 13].

---

## 🌌 The Challenge & Context
During long-duration space missions, astronauts experience extreme physiological stressors that differ drastically from life on Earth—including **microgravity-induced bone and muscle loss, cardiovascular deconditioning, space radiation risks, isolation, and disrupted sleep cycles**[cite: 1, 2]. With limited access to real-time medical professionals, spacecraft require autonomous, reliable decision-support tools that operate **offline** without relying on continuous internet connectivity[cite: 2, 9].

---

## ✨ Key Differentiators
AstroGuardian-AI goes beyond a standard health dashboard by introducing five core capabilities:
1. **Personalized AI Baselines:** Detects anomalous health drift based on each individual astronaut's normal historical patterns rather than rigid, generic human thresholds[cite: 6, 12].
2. **Predictive Risk Analysis:** Flags concerning physiological trends (e.g., resting heart rate spikes, drop in blood oxygen saturation) before they escalate[cite: 5, 12].
3. **Comprehensive Mental & Physical Tracking:** Monitors cardiovascular vitals alongside sleep deprivation and stress indicators[cite: 5, 12].
4. **Offline-First Architecture:** Fully operational locally within spacecraft systems with data synchronization capabilities[cite: 9, 12].
5. **Explainable NASA-Aligned Alerts:** Translates raw anomaly data into clear **GREEN, YELLOW, and RED** alert tiers paired with action guidance derived from NASA Human Research Program (HRP) protocols[cite: 5, 8, 12].

---

## 🛠️ Technology Stack
* **Frontend:** React + Tailwind CSS[cite: 8, 9]
* **Backend & API:** Python + FastAPI[cite: 8, 9]
* **AI & Data Analysis:** Pandas + NumPy[cite: 8, 9]
* **Database & Storage:** SQLite[cite: 8, 9]
* **Quality Assurance:** Pytest

---

## 📂 Repository Structure
```text
AstroGuardian-AI/
├── frontend/             # React user interface and dashboard components
├── backend/              # FastAPI server routes, services, and database schemas
├── ai/                   # Core AI engine (baselines, risk detection, recommendations)
├── research/             # Scientific validation & NASA HRP risk documentation
│   └── space_health_risks.md
├── tests/                # Automated unit and integration test scripts
├── docs/                 # System architecture and user guides
└── data/                 # Simulated astronaut telemetry datasets