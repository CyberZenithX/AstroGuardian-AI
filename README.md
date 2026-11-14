# AstroGuardian-AI
### Intelligent Astronaut Health Monitoring & Early Warning System

> **Mission Statement:** To empower astronauts on long-duration space missions with intelligent, personalized, and reliable health monitoring, helping them recognize potential health risks and take timely action.

---

## 🌌 The Challenge & Context
During long-duration space missions, astronauts experience extreme physiological stressors that differ drastically from life on Earth—including **microgravity-induced bone and muscle loss, cardiovascular deconditioning, space radiation risks, isolation, and disrupted sleep cycles**. With limited access to real-time medical professionals, spacecraft require autonomous, reliable decision-support tools that operate **offline** without relying on continuous internet connectivity.

---

## ✨ Key Differentiators
AstroGuardian-AI goes beyond a standard health dashboard by introducing five core capabilities:
1. **Personalized AI Baselines:** Detects anomalous health drift based on each individual astronaut's normal historical patterns rather than rigid, generic human thresholds.
2. **Predictive Risk Analysis:** Flags concerning physiological trends (e.g., resting heart rate creeping up, sleep steadily declining) *before* they cross a safety limit.
3. **Comprehensive Mental & Physical Tracking:** Monitors cardiovascular vitals alongside sleep deprivation and stress indicators.
4. **Offline-First Architecture:** Fully operational locally within spacecraft systems, with alert sync to ground when a comms window opens.
5. **Explainable NASA-Aligned Alerts:** Translates raw anomaly data into clear **GREEN, YELLOW, and RED** alert tiers (plus **UNKNOWN** when data is missing) paired with action guidance derived from NASA Human Research Program (HRP) risk areas, and explained in plain language by an LLM assistant.

---

## 🧠 How the AI Works — Two Layers

```text
 Sensor / check-in data
          │
          ▼
┌───────────────────────────────┐      ┌─────────────────────────────────┐
│ LAYER 1 — Analysis Engine     │      │ LAYER 2 — Language Assistant    │
│ ai/baseline.py                │      │ ai/llm_explainer.py             │
│ ai/risk_detection.py          │ ───► │ GPT-OSS-20B                     │
│ ai/recommendations.py         │      │ • explains the result           │
│ • personal baselines (z-score)│      │ • answers crew questions        │
│ • safety limits (HRP doc)     │      │ • CANNOT change the alert tier  │
│ • trend prediction (3 days)   │      └─────────────────────────────────┘
│ • DECIDES GREEN/YELLOW/RED    │
└───────────────────────────────┘
```

**Layer 1 — Analysis engine (always local, deterministic).** Pandas + NumPy. For every reading it:
- builds a **personal baseline** from the astronaut's previous 14 readings (the current reading is excluded so an anomaly cannot hide itself);
- checks **fixed safety limits** from [`research/health_indicators.md`](research/health_indicators.md);
- flags readings that are **unusual for this astronaut** even when they are inside generic limits — only if strong (z > 3) or **persistent** (z > 2 on 2 of the last 3 days), so one noisy reading doesn't raise an alert;
- detects **multi-day patterns**: sleep debt, sustained low mood, skipped exercise countermeasures, cumulative radiation dose;
- fits a **trend line** over the last 7 daily averages and raises an early warning if a vital is projected to cross a limit within 3 days;
- **fails safe:** missing vitals or data older than 36 h produce **UNKNOWN**, never GREEN.

This layer alone sets the alert tier. It is fully testable and explainable — every alert shows the numbers behind it **and the source of its threshold** (see the [threshold sources table](research/health_indicators.md#threshold-sources)).

**What is tracked:** heart rate, SpO₂, blood pressure, temperature, sleep, fatigue (Samn-Perelli scale), mood, stress, countermeasure exercise minutes and radiation dose (against NASA's 600 mSv career limit).

**Layer 2 — Language assistant (LLM).** An LLM turns Layer 1's output into a short plain-language explanation and answers follow-up questions ("Why is my heart rate flagged?"). It receives the already-computed tier, findings and actions, and is instructed never to change them. If the LLM is unreachable, the app falls back to template explanations and keeps working.

### 🛰️ LLM deployment: demo vs. flight

| | **Hackathon demo** (this repo, default) | **Flight configuration** |
|---|---|---|
| Model | **GPT-OSS-20B** (OpenAI open-weight, Apache 2.0) | **The same GPT-OSS-20B** weights |
| Runs on | Groq cloud API | Onboard spacecraft computer (Ollama / llama.cpp / vLLM) |
| Internet needed | Yes | **No** |
| Setting | `LLM_PROVIDER=groq` | `LLM_PROVIDER=local` |

> ⚠️ **The Groq API is used *purely for demonstration purposes*.** It lets judges and teammates run the assistant on any laptop without downloading a ~14 GB model or owning a GPU. Once the astronaut leaves Earth, the identical open-weight model runs **locally on the spacecraft**, with no internet connection.

Why this is a credible path to flight, not a hand-wave:
- **Same model, not a substitute.** GPT-OSS-20B is an open-weight model that is designed to run within ~16 GB of memory on a single GPU or edge device, so the demo and flight models are the same.
- **Same code.** Groq and local servers such as Ollama both expose the OpenAI-compatible Chat Completions API. Switching is one environment variable; `ai/llm_explainer.py` is unchanged.
- **Safety does not depend on the LLM.** Alerts are computed by Layer 1 on the spacecraft in both modes. If the LLM fails or is switched off, every alert, finding and action is still shown.

To try the flight configuration locally:
```bash
ollama pull gpt-oss:20b
```
Then set `LLM_PROVIDER=local` in `.env`.

---

## 🛠️ Technology Stack
* **Frontend:** React + Tailwind CSS + Recharts (built with Vite)
* **Backend & API:** Python + FastAPI
* **AI & Data Analysis:** Pandas + NumPy (Layer 1), GPT-OSS-20B via an OpenAI-compatible API (Layer 2)
* **Database & Storage:** SQLite (local / onboard) or Postgres (Neon, for the hosted demo) — same code, chosen by `DATABASE_URL`
* **Offline:** service worker caches the app and last data; works when the server is unreachable
* **Quality Assurance:** Pytest (engine, API, roles, scenarios — on SQLite and Postgres), Vitest + Testing Library, GitHub Actions CI

---

## 🔐 Access & Roles

The demo is behind a shared password — **`NASA`** — to keep bots out. After entering it, pick a role. Permissions are enforced by the API, not just hidden in the UI.

| | Astronaut | Crew Medical Officer | Ground Flight Surgeon |
|---|:-:|:-:|:-:|
| See own status, vitals, alerts | ✅ | ✅ | ✅ |
| See other astronauts | ❌ | ✅ | ✅ |
| Log readings | own only (daily check-in) | anyone | ❌ (read-only) |
| AI assistant | own data | anyone | anyone |
| Acknowledge alerts | ❌ | ✅ | ❌ |
| Add medical advice to alerts | ❌ | ❌ | ✅ (crew sees it) |
| Ground sync | ❌ | ❌ | ✅ |

> The password is a bot filter for a public demo, **not real authentication**: anyone who knows it can choose any role. A flight system would use individual crew credentials.

---

## ▶️ Running It

Prerequisites: Python 3.10+, Node.js 18+.

**1. Backend**

From the repository root, install the Python dependencies:
```bash
pip install -r backend/requirements.txt
```

Create your env file, then add your `GROQ_API_KEY` to it (free at console.groq.com). Leave it blank to run with template explanations only.
```bash
cp .env.example .env
```

Start the API:
```bash
uvicorn backend.main:app --reload
```
The API runs at http://localhost:8000 (interactive docs at `/docs`). With no `DATABASE_URL`, it uses SQLite: on first request it creates `backend/astroguardian.db` and seeds 21 days of simulated telemetry for three astronauts, shifted so the latest reading is today.

**2. Frontend** (second terminal)
```bash
cd frontend && npm install && npm run dev
```
Open http://localhost:5173 and enter the password `NASA`.

**Single-process mode (as it would run aboard):** run `npm run build` in `frontend/`, then start only the backend. It serves the dashboard (with offline support) at http://localhost:8000.

**Tests**

Backend:
```bash
python -m pytest
```

Frontend:
```bash
cd frontend && npm test
```

To also run the API tests against Postgres, set `TEST_DATABASE_URL` to a throwaway database before running pytest. CI does this automatically.

**Demo data stays fresh:** with `DEMO_KEEP_FRESH=true` (default), if the newest reading is more than 20 h old, the whole timeline is shifted forward by whole days. To start over completely:
```bash
python -m backend.seed --reset
```
To regenerate the simulated CSV itself, run `python data/generate_sample_data.py`.

---

## ☁️ Deploying to Vercel (Hobby) + Neon

Vercel serves the built React app from its CDN and runs FastAPI as a Python function (`api/index.py`). Its filesystem isn't persistent, so the hosted demo stores data in Neon Postgres.

1. Create a free project at [neon.tech](https://neon.tech) and copy its connection string (`postgresql://…?sslmode=require`).
2. Create the tables and demo data in Neon, from your machine:
   ```bash
   DATABASE_URL="postgresql://…" python -m backend.seed
   ```
3. Import the GitHub repo in Vercel. `vercel.json` already sets the build. Under **Settings → Environment Variables** add:
   - `DATABASE_URL`: the Neon string
   - `SECRET_KEY`: a random string, from `python -c "import secrets; print(secrets.token_hex(32))"`
   - `GROQ_API_KEY`: your Groq key
   - optional: `DEMO_PASSWORD`
4. Deploy.

Notes:
- Vercel Hobby is for non-commercial use.
- Neon's free compute sleeps after 5 minutes idle, so the first request after a pause takes a moment. Open the app a minute before you present.
- Hosting is for the demo only. In flight, the same FastAPI app runs on the spacecraft computer with SQLite, just as the LLM moves from Groq to an onboard model.

### Demo crew
| Astronaut | Scenario | Expected status |
|---|---|---|
| ASTRO_01 · Cmdr. Elena Vasquez | Stable | 🟢 GREEN |
| ASTRO_02 · Dr. Kenji Mori | Overworked: heart rate creeping up, sleep debt, rising fatigue, skipped exercise over a week. Caught by personal-baseline and multi-day-pattern rules before any vital crosses a fixed limit | 🟡 YELLOW |
| ASTRO_03 · Amara Okafor | Acute event: SpO₂ 90 %, HR 121 | 🔴 RED |

Log in as an astronaut (daily check-in) or the CMO (log reading) and submit new values to watch the status re-evaluate. Repeat readings update the existing alert instead of creating duplicates. A new or worse problem opens a fresh alert that needs acknowledging.

---

## 📂 Repository Structure
```text
AstroGuardian-AI/
├── api/                  # Vercel entry point (imports the FastAPI app)
├── frontend/             # React dashboard, role picker, service worker (public/sw.js), Vitest tests
├── backend/              # FastAPI routes (main.py), roles (auth.py), alert lifecycle (service.py),
│                         #   SQLite/Postgres storage (db.py), seed script (seed.py)
├── ai/                   # Layer 1 engine (baseline, risk_detection, recommendations, thresholds)
│                         #   + Layer 2 LLM assistant (llm_explainer.py)
├── research/             # Scientific validation & NASA HRP risk documentation
├── tests/                # Pytest: engine, API, roles/permissions, end-to-end scenarios
├── .github/workflows/    # CI: pytest on SQLite + Postgres, frontend tests and build
├── docs/                 # System architecture and user guide
└── data/                 # Simulated astronaut telemetry + generator script
```

---

## ⚠️ Disclaimer
AstroGuardian-AI is a hackathon prototype for decision support, not a medical device. Thresholds labelled **team rule** in the [sources table](research/health_indicators.md#threshold-sources) are this project's choices and need review by a flight surgeon. All telemetry is simulated.
