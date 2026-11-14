"""End-to-end mission scenarios through the API (as the Crew Medical Officer)."""


def _post(client, aid, **reading):
    return client.post(f"/api/astronauts/{aid}/readings", json=reading).json()["evaluation"]


def test_scenario_healthy_astronaut_stays_green(cmo):
    ev = _post(cmo, "ASTRO_01", heart_rate=65, spo2=98, blood_pressure_sys=118, blood_pressure_dia=76,
               temperature=36.6, sleep_hours=7.5, stress_level="Low", fatigue=2, mood=4,
               exercise_minutes=150, radiation_msv=0.5)
    assert ev["risk_level"] == "GREEN"
    assert ev["findings"] == []


def test_scenario_overworked_astronaut_is_caught_early(cmo):
    ev = cmo.get("/api/astronauts/ASTRO_02").json()["evaluation"]
    kinds = {f["kind"] for f in ev["findings"]}
    metrics = {f["metric"] for f in ev["findings"]}
    assert ev["risk_level"] == "YELLOW"
    assert {"pattern", "baseline"} <= kinds
    assert {"sleep_hours", "exercise_minutes"} <= metrics
    # Nothing crossed a RED limit: this is early warning.
    assert all(f["severity"] != "RED" for f in ev["findings"])


def test_scenario_acute_hypoxia_is_red_with_cmo_action(cmo):
    ev = cmo.get("/api/astronauts/ASTRO_03").json()["evaluation"]
    assert ev["risk_level"] == "RED"
    assert any(f["metric"] == "spo2" and f["severity"] == "RED" for f in ev["findings"])
    assert any("CMO" in a for a in ev["actions"])


def test_scenario_sensor_dropout_is_unknown(cmo):
    ev = _post(cmo, "ASTRO_01", sleep_hours=7, stress_level="Low")
    assert ev["risk_level"] == "UNKNOWN"


def test_scenario_exhaustion_is_red(cmo):
    ev = _post(cmo, "ASTRO_01", heart_rate=66, spo2=98, fatigue=7)
    assert ev["risk_level"] == "RED"
    assert any("safety-critical" in a for a in ev["actions"])


def test_scenario_solar_particle_event(cmo):
    ev = _post(cmo, "ASTRO_01", heart_rate=66, spo2=98, radiation_msv=260)
    assert ev["risk_level"] == "RED"
    assert any("shelter" in a.lower() for a in ev["actions"])


def test_scenario_recovery_after_rest(cmo):
    assert _post(cmo, "ASTRO_01", heart_rate=66, spo2=93)["risk_level"] == "YELLOW"
    assert _post(cmo, "ASTRO_01", heart_rate=65, spo2=98, sleep_hours=7.4)["risk_level"] == "GREEN"
