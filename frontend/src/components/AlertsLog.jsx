import { Check, CloudUpload, MessageSquareText, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { StatusBadge } from "./Status.jsx";

const STATUS_TEXT = { open: "Open", resolved: "Resolved", superseded: "Superseded by a newer alert" };

export default function AlertsLog({ user, onOpen, onChanged }) {
  const [alerts, setAlerts] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("open");
  const can = (p) => user.permissions.includes(p);

  const load = useCallback(() => api.alerts().then(setAlerts).catch((e) => setError(e.message)), []);
  useEffect(() => {
    load();
  }, [load]);

  async function act(fn) {
    try {
      await fn();
      await load();
      onChanged?.();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!alerts) return error ? <p className="text-status-critical">{error}</p> : <p className="text-ink-3">Loading…</p>;
  const pending = alerts.filter((a) => !a.synced).length;
  const shown = alerts.filter((a) => (filter === "open" ? a.status === "open" : true));

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{user.role === "astronaut" ? "My alerts" : "Alert log"}</h1>
          <p className="text-ink-2">
            One alert per ongoing problem. Repeat readings update it; a new or worse problem opens a new one.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg bg-surface-2 p-1 text-sm" role="tablist">
            {[["open", "Open"], ["all", "All"]].map(([v, l]) => (
              <button key={v} role="tab" aria-selected={filter === v} onClick={() => setFilter(v)}
                      className={`rounded-md px-3 py-1 ${filter === v ? "bg-surface-3 text-ink-1" : "text-ink-3"}`}>{l}</button>
            ))}
          </div>
          {can("sync") && (
            <button onClick={() => act(api.syncComplete)} disabled={!pending}
                    className="inline-flex items-center gap-2 rounded-lg bg-surface-2 px-4 py-2 text-sm ring-1 ring-line hover:bg-surface-3 disabled:opacity-50">
              <CloudUpload className="h-4 w-4" />
              {pending ? `Receive ground sync (${pending} updates)` : "Up to date with spacecraft"}
            </button>
          )}
        </div>
      </div>
      {error && <p role="alert" className="mb-3 text-sm text-status-critical">{error}</p>}
      {shown.length === 0 ? (
        <p className="text-ink-2">{filter === "open" ? "No open alerts." : "No alerts recorded."}</p>
      ) : (
        <ul className="space-y-3">
          {shown.map((a) => (
            <AlertCard key={a.id} a={a} user={user} onOpen={onOpen}
                       onAck={() => act(() => api.ackAlert(a.id))}
                       onNote={(note) => act(() => api.noteAlert(a.id, note))} />
          ))}
        </ul>
      )}
    </section>
  );
}

function AlertCard({ a, user, onOpen, onAck, onNote }) {
  const [note, setNote] = useState("");
  const can = (p) => user.permissions.includes(p);
  const closed = a.status !== "open";

  return (
    <li className={`rounded-xl bg-surface-1 p-4 ring-1 ring-line ${closed ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge level={a.risk_level} />
          <button onClick={() => onOpen(a.astronaut_id)} className="font-medium hover:underline">{a.astronaut_name}</button>
          <span className="text-sm text-ink-3">
            {STATUS_TEXT[a.status]} · opened {new Date(a.opened_at).toLocaleString()}
            {a.occurrences > 1 && ` · seen ${a.occurrences}×, last ${new Date(a.last_seen_at).toLocaleTimeString()}`}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-ink-3">
          {can("sync") && <span>{a.synced ? "received on ground" : "new data from spacecraft"}</span>}
          {a.acknowledged ? (
            <span className="flex items-center gap-1"><Check className="h-4 w-4" /> acknowledged by {a.acknowledged_by}</span>
          ) : can("acknowledge_alert") && !closed ? (
            <button onClick={onAck} className="rounded-md bg-surface-3 px-3 py-1 text-ink-1 hover:bg-line">Acknowledge</button>
          ) : (
            !closed && <span>awaiting CMO acknowledgement</span>
          )}
        </div>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-2">
        {a.findings.map((f, i) => <li key={i}>{f.message}</li>)}
      </ul>
      {a.ground_note && (
        <div className="mt-3 flex gap-2 rounded-lg bg-surface-2 p-3 text-sm">
          <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-series" aria-hidden />
          <div>
            <span className="text-ink-3">Flight surgeon:</span> <span className="text-ink-1">{a.ground_note}</span>
          </div>
        </div>
      )}
      {can("ground_note") && !closed && (
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (note.trim()) { onNote(note); setNote(""); } }}>
          <label htmlFor={`note-${a.id}`} className="sr-only">Advice for the crew</label>
          <input id={`note-${a.id}`} value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000}
                 placeholder={a.ground_note ? "Replace advice for the crew…" : "Add advice for the crew…"}
                 className="min-w-0 flex-1 rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-ink-1 ring-1 ring-line placeholder:text-ink-3 focus:outline-none focus:ring-series" />
          <button type="submit" disabled={!note.trim()} aria-label="Send advice"
                  className="rounded-lg bg-surface-3 px-3 text-ink-1 hover:bg-line disabled:opacity-50">
            <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </li>
  );
}
