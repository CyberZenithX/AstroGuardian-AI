import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AlertsLog from "../components/AlertsLog.jsx";
import { StatusBadge } from "../components/Status.jsx";
import { mockApi } from "./setup.js";

const ALERT = {
  id: 7, astronaut_id: "ASTRO_03", astronaut_name: "Amara Okafor", risk_level: "RED", status: "open",
  opened_at: "2026-11-14T08:00:00+00:00", last_seen_at: "2026-11-14T09:00:00+00:00", occurrences: 3,
  findings: [{ message: "SpO2 90% is below the 92% critical limit." }], acknowledged: false,
  acknowledged_by: null, ground_note: null, synced: false,
};
const users = {
  astronaut: { role: "astronaut", permissions: ["use_assistant", "submit_own_reading"] },
  cmo: { role: "cmo", permissions: ["view_all_crew", "acknowledge_alert", "submit_any_reading"] },
  ground: { role: "ground", permissions: ["view_all_crew", "ground_note", "sync"] },
};

async function renderAs(role) {
  mockApi({ "GET /api/alerts": [ALERT] });
  render(<AlertsLog user={users[role]} onOpen={() => {}} />);
  await screen.findByText("Amara Okafor");
}

describe("alert log per role", () => {
  it("CMO can acknowledge, but not add notes or sync", async () => {
    await renderAs("cmo");
    expect(screen.getByRole("button", { name: "Acknowledge" })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/advice for the crew/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /ground sync/i })).not.toBeInTheDocument();
  });

  it("ground can add advice and sync, but not acknowledge", async () => {
    await renderAs("ground");
    expect(screen.getByPlaceholderText(/advice for the crew/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ground sync/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Acknowledge" })).not.toBeInTheDocument();
  });

  it("astronaut gets a read-only view", async () => {
    await renderAs("astronaut");
    expect(screen.queryByRole("button", { name: "Acknowledge" })).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/advice for the crew/i)).not.toBeInTheDocument();
    expect(screen.getByText(/awaiting CMO acknowledgement/i)).toBeInTheDocument();
  });

  it("shows repeat count instead of duplicate alerts", async () => {
    await renderAs("cmo");
    expect(screen.getByText(/seen 3×/)).toBeInTheDocument();
  });
});

describe("status badge", () => {
  it.each([["GREEN", "Nominal"], ["YELLOW", "Caution"], ["RED", "Critical"], ["UNKNOWN", "Unknown"]])(
    "%s is labelled in text, not colour alone", (level, label) => {
      render(<StatusBadge level={level} />);
      expect(screen.getByText(level)).toBeInTheDocument();
      expect(screen.getByText(`· ${label}`)).toBeInTheDocument();
    });
});
