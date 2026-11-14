import { Bell, CloudOff, LogOut, Repeat, Satellite, ShieldCheck, UserRound, Users, WifiOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api, clearApiCache, on } from "./api.js";
import { Gate, RolePicker } from "./components/Access.jsx";
import AlertsLog from "./components/AlertsLog.jsx";
import AstronautDetail from "./components/AstronautDetail.jsx";
import CrewOverview from "./components/CrewOverview.jsx";

// Minimal hash router: #/  #/astronaut/ID  #/alerts
function useRoute() {
  const parse = () => window.location.hash.replace(/^#\/?/, "").split("/");
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onHash = () => setRoute(parse());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return [route, (path) => { window.location.hash = `/${path}`; }];
}

export default function App() {
  const [auth, setAuth] = useState(null); // {unlocked, user, roles, astronauts}
  const [authError, setAuthError] = useState(null);

  const loadAuth = useCallback(async () => {
    try {
      setAuth(await api.authState());
      setAuthError(null);
    } catch (e) {
      setAuthError(e.message);
    }
  }, []);

  useEffect(() => {
    loadAuth();
    return on("unauthorized", loadAuth);
  }, [loadAuth]);

  async function switchRole() {
    await api.switchRole().catch(() => {});
    await clearApiCache();
    window.location.hash = "/";
    loadAuth();
  }

  async function lock() {
    await api.logout().catch(() => {});
    await clearApiCache();
    window.location.hash = "/";
    loadAuth();
  }

  if (!auth) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-3">
        {authError ? <span className="flex items-center gap-2"><WifiOff className="h-4 w-4" /> {authError}</span> : "Loading…"}
      </div>
    );
  }
  if (!auth.unlocked) return <Gate onUnlocked={loadAuth} />;
  if (!auth.user) return <RolePicker state={auth} onChosen={loadAuth} onLock={lock} />;
  return <Dashboard user={auth.user} onSwitchRole={switchRole} onLock={lock} />;
}

function Dashboard({ user, onSwitchRole, onLock }) {
  const [route, go] = useRoute();
  const [crew, setCrew] = useState([]);
  const [config, setConfig] = useState(null);
  const [offline, setOffline] = useState(false);
  const [cachedAt, setCachedAt] = useState(null);
  const isAstronaut = user.role === "astronaut";

  useEffect(() => on("cache", setCachedAt), []);

  const refresh = useCallback(async () => {
    try {
      const [c, cfg] = await Promise.all([api.crew(), api.config()]);
      setCrew(c);
      setConfig(cfg);
      setOffline(false);
    } catch (e) {
      if (e.status === 0) setOffline(true);
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 30000);
    return () => clearInterval(t);
  }, [refresh]);

  const [page, param] = route;
  const llm = config?.llm;
  // Astronauts land on their own page; everyone else on the crew overview.
  const detailId = page === "astronaut" && param ? param : isAstronaut ? user.astronaut_id : null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line bg-surface-0/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <button onClick={() => go("")} className="flex items-center gap-2 text-lg font-semibold">
            <ShieldCheck className="h-6 w-6 text-series" aria-hidden /> AstroGuardian
          </button>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            <NavBtn active={page !== "alerts"} onClick={() => go("")} icon={isAstronaut ? UserRound : Users}>
              {isAstronaut ? "My health" : "Crew"}
            </NavBtn>
            <NavBtn active={page === "alerts"} onClick={() => go("alerts")} icon={Bell}>
              {isAstronaut ? "My alerts" : "Alerts"}
              {config?.unsynced_alerts ? (
                <span className="ml-1 rounded-full bg-surface-3 px-1.5 text-xs text-ink-2" title="Awaiting ground sync">
                  {config.unsynced_alerts}
                </span>
              ) : null}
            </NavBtn>
            <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
            <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-ink-2" data-testid="role-chip">
              {user.role_label}{user.astronaut_id ? ` · ${user.astronaut_id}` : ""}
            </span>
            <button onClick={onSwitchRole} title="Switch role" aria-label="Switch role"
                    className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink-1">
              <Repeat className="h-4 w-4" />
            </button>
            <button onClick={onLock} title="Lock" aria-label="Lock"
                    className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink-1">
              <LogOut className="h-4 w-4" />
            </button>
          </nav>
        </div>
        {llm?.demo_mode && (
          <div className="border-t border-line bg-surface-1 px-4 py-1.5 text-center text-xs text-ink-3">
            <Satellite className="mr-1 inline h-3.5 w-3.5" aria-hidden />
            Demo mode: the AI assistant calls {llm.model} via the Groq API. In flight, the same open-weight model runs
            onboard with no internet. Health alerts are always computed locally.
            {!llm.enabled && " (GROQ_API_KEY not set: showing template explanations.)"}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {cachedAt && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-status-warning/15 px-4 py-3 text-sm ring-1 ring-status-warning/50">
            <CloudOff className="h-4 w-4 shrink-0" />
            Offline: showing data saved at {new Date(cachedAt).toLocaleString()}. New readings can't be submitted until the
            server is reachable.
          </div>
        )}
        {offline && !cachedAt && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-status-critical/15 px-4 py-3 text-sm ring-1 ring-status-critical/50">
            <WifiOff className="h-4 w-4" /> Cannot reach the onboard AstroGuardian server. Status shown may be out of date.
          </div>
        )}
        {page === "alerts" ? (
          <AlertsLog user={user} onOpen={(id) => go(`astronaut/${id}`)} onChanged={refresh} />
        ) : detailId ? (
          <AstronautDetail key={detailId} id={detailId} user={user} llm={llm}
                           onBack={isAstronaut ? null : () => go("")} onChanged={refresh} />
        ) : (
          <CrewOverview crew={crew} onOpen={(id) => go(`astronaut/${id}`)} />
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-ink-3">
        Decision support only, not a medical diagnosis. Always follow the Crew Medical Officer and flight surgeon guidance.
      </footer>
    </div>
  );
}

function NavBtn({ active, onClick, icon: Icon, children }) {
  return (
    <button onClick={onClick} aria-current={active ? "page" : undefined}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${active ? "bg-surface-2 text-ink-1" : "text-ink-2 hover:text-ink-1"}`}>
      <Icon className="h-4 w-4" aria-hidden /> {children}
    </button>
  );
}
