# User Guide

## Getting in
Enter the access password **NASA**, then choose a role:
- **Astronaut**: pick who you are. You see only your own data, can log a daily check-in, and can ask the AI assistant about your status.
- **Crew Medical Officer**: sees the whole crew, logs readings for anyone, and acknowledges alerts.
- **Ground Flight Surgeon**: sees the whole crew (read-only vitals), adds advice to alerts (the crew sees it on their page), and runs ground sync.

Use the ⇄ icon in the header to switch role, and the exit icon to lock the app.

## Crew overview
The home screen shows one card per astronaut, most urgent first. Each status is shown as a colour, an icon and a word:

| Status | Meaning | What to do |
|---|---|---|
| 🟢 GREEN · Nominal | Within personal baseline and safety limits | Continue operations |
| 🟡 YELLOW · Caution | Drift from personal normal, or a predicted problem | Follow the listed actions and re-check |
| 🔴 RED · Critical | A safety limit was crossed | Stop non-essential tasks, notify the CMO now |
| ⚪ UNKNOWN | Required data missing or too old | Check sensors, take a new reading |

## Astronaut page
- **Why — findings:** each reason for the status, tagged by type:
  - *Safety limit*: crossed a fixed threshold.
  - *Personal baseline*: unusual for this astronaut specifically.
  - *Multi-day pattern*: sleep debt, low mood for 3 days, skipped exercise, or cumulative radiation.
  - *Prediction*: currently fine, but trending toward a limit within 3 days.
  - *Data*: something is missing.

  Each finding also shows the source of its threshold.
- **What to do:** ordered actions derived from NASA HRP risk areas.
- **AI health assistant:** *Explain my status* gives a short plain-language summary, and you can ask follow-up questions. The assistant explains the alert; it can't change it.
- **Vitals:** 21-day charts. The shaded band is your personal normal range, and the dashed line is the safety limit. Switch to *Table* to see exact numbers.
- **Career radiation dose:** progress toward NASA's 600 mSv career limit.
- **Daily check-in / Log reading:** vitals plus fatigue (Samn-Perelli 1–7), mood, stress, exercise minutes and dosimeter dose. The status updates immediately.

## Alert log
There is one alert per ongoing problem. Repeat readings update it ("seen 3×"), and a new or worse problem opens a fresh alert. When readings return to GREEN, the alert is resolved. The CMO **acknowledges** alerts. The ground flight surgeon adds **advice** and marks updates as **received on ground** (in flight, this happens at each comms window).

## Offline
If the server can't be reached, the app keeps showing the last data it saw, with a banner giving the time. New readings can't be submitted offline: you'll see an error rather than losing them silently.
