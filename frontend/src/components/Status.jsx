import { AlertTriangle, CheckCircle2, HelpCircle, OctagonAlert } from "lucide-react";

// Status is always colour + icon + text — never colour alone.
export const STATUS = {
  GREEN: { label: "Nominal", icon: CheckCircle2, text: "text-status-good", bg: "bg-status-good/15", ring: "ring-status-good/50", dot: "bg-status-good" },
  YELLOW: { label: "Caution", icon: AlertTriangle, text: "text-status-warning", bg: "bg-status-warning/15", ring: "ring-status-warning/50", dot: "bg-status-warning" },
  RED: { label: "Critical", icon: OctagonAlert, text: "text-status-critical", bg: "bg-status-critical/15", ring: "ring-status-critical/60", dot: "bg-status-critical" },
  UNKNOWN: { label: "Unknown", icon: HelpCircle, text: "text-ink-2", bg: "bg-surface-3", ring: "ring-line", dot: "bg-status-unknown" },
};

export function StatusBadge({ level, size = "md" }) {
  const s = STATUS[level] ?? STATUS.UNKNOWN;
  const Icon = s.icon;
  const big = size === "lg";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full ring-1 ${s.bg} ${s.ring} ${s.text} font-semibold ${
        big ? "px-4 py-2 text-lg" : "px-2.5 py-1 text-sm"
      }`}
    >
      <Icon className={big ? "h-6 w-6" : "h-4 w-4"} aria-hidden />
      <span>{level}</span>
      <span className="font-normal text-ink-2">· {s.label}</span>
    </span>
  );
}

const KIND_LABEL = {
  absolute: "Safety limit", baseline: "Personal baseline", pattern: "Multi-day pattern", trend: "Prediction", missing: "Data",
};

export function FindingRow({ f }) {
  const s = STATUS[f.severity] ?? STATUS.UNKNOWN;
  const Icon = s.icon;
  return (
    <li className="flex gap-3 rounded-lg bg-surface-2 p-3">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${s.text}`} aria-label={f.severity} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-ink-3">
          <span>{f.label}</span>
          <span className="rounded bg-surface-3 px-1.5 py-0.5 normal-case tracking-normal text-ink-2">
            {KIND_LABEL[f.kind] ?? f.kind}
          </span>
        </div>
        <p className="mt-1 text-ink-1">{f.message}</p>
        {f.source_text && <p className="mt-1 text-xs text-ink-3">Source: {f.source_text}</p>}
      </div>
    </li>
  );
}

export function timeAgo(iso) {
  if (!iso) return "never";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} days ago`;
}
