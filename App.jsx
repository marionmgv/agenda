import { useEffect, useRef, useState } from "react";
import { BookOpen, CalendarDays, Home, Settings, Sun } from "lucide-react";
import { C, seed } from "./data.js";
import { iso } from "./dates.js";
import { charger, sauver } from "./storage.js";
import Jour from "./views/Jour.jsx";
import Semaine from "./views/Semaine.jsx";
import Famille from "./views/Famille.jsx";
import Progressions from "./views/Progressions.jsx";
import Reglages from "./views/Reglages.jsx";

const ONGLETS = [
  ["jour", "Aujourd'hui", Sun],
  ["semaine", "Semaine", CalendarDays],
  ["famille", "Famille", Home],
  ["prog", "Progressions", BookOpen],
  ["reglages", "Réglages", Settings],
];

export default function App() {
  const [state, setState] = useState(null);
  const [vue, setVue] = useState("jour");
  const [date, setDate] = useState(iso(new Date()));
  const [filtre, setFiltre] = useState("tout");
  const [statut, setStatut] = useState("");
  const premier = useRef(true);

  useEffect(() => {
    const enregistre = charger();
    setState(enregistre && enregistre.version === 3 ? enregistre : seed());
  }, []);

  useEffect(() => {
    if (!state) return undefined;
    if (premier.current) { premier.current = false; return undefined; }
    const t = setTimeout(() => {
      const ok = sauver(state);
      setStatut(ok ? "enregistré" : "non enregistré");
      setTimeout(() => setStatut(""), 1600);
    }, 500);
    return () => clearTimeout(t);
  }, [state]);

  if (!state) {
    return (
      <div style={{ background: C.paper, minHeight: "100vh", display: "grid", placeItems: "center", color: C.ink3, fontSize: 13 }}>
        Ouverture de l'agenda…
      </div>
    );
  }

  return (
    <div style={{ background: C.paper, minHeight: "100vh" }}>
      <header className="app-entete px-4 pt-5 pb-3 mx-auto" style={{ maxWidth: 1180 }}>
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-2.5">
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, color: C.ink, letterSpacing: "-.03em" }}>
              Ma semaine
            </span>
            <span style={{ fontSize: 12, color: C.ink3 }}>2026 – 2027</span>
          </div>
          <span aria-live="polite" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: C.ink3 }}>{statut}</span>
        </div>
      </header>

      <nav className="app-nav px-4 mx-auto" style={{ maxWidth: 1180, position: "sticky", top: 0, zIndex: 20, background: C.paper }}>
        <div className="flex gap-1 overflow-x-auto pb-2" style={{ borderBottom: `1px solid ${C.line}` }}>
          {ONGLETS.map(([k, l, Icone]) => (
            <button key={k} type="button" onClick={() => setVue(k)}
              aria-current={vue === k ? "page" : undefined}
              className="px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shrink-0"
              style={{ fontSize: 13, fontWeight: 500, background: vue === k ? C.ink : "transparent",
                       color: vue === k ? "#fff" : C.ink2, border: `1px solid ${vue === k ? C.ink : "transparent"}` }}>
              <Icone size={15} /> {l}
            </button>
          ))}
        </div>
      </nav>

      <main className="app-corps px-4 py-5 mx-auto" style={{ maxWidth: 1180 }}>
        {vue === "jour"     && <Jour state={state} setState={setState} date={date} setDate={setDate} />}
        {vue === "semaine"  && <Semaine state={state} setState={setState} date={date} setDate={setDate} filtre={filtre} setFiltre={setFiltre} />}
        {vue === "famille"  && <Famille state={state} setState={setState} />}
        {vue === "prog"     && <Progressions state={state} setState={setState} />}
        {vue === "reglages" && <Reglages state={state} setState={setState} />}
      </main>

      <footer className="app-pied px-4 pb-8 pt-2 mx-auto" style={{ maxWidth: 1180 }}>
        <p style={{ fontSize: 11, color: C.ink3, lineHeight: 1.5 }}>
          Emploi du temps LP Notre-Dame des Collines, édition du 30/08/2026. Planning ISFEC
          « Lauréats ETP mi-temps 2026-2027 », sous réserve de modifications.
        </p>
      </footer>
    </div>
  );
}
