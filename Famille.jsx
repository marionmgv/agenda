import { useState } from "react";
import { CalendarDays, Plus, Trash2, Users, Utensils } from "lucide-react";
import { C, uid } from "../data.js";
import { J_COURT, J_LONG, addDays, dow, fmtShort, hFR, iso, minutes } from "../dates.js";
import { Bouton, Carte, Pastille, TitreSection, Entete, champ } from "../ui.jsx";

export default function Famille({ state, setState }) {
  const [ongl, setOngl] = useState("rdv");
  const [f, setF] = useState({ titre: "", date: iso(new Date()), start: "18:00", end: "19:00", enfant: "Paul", day: 3 });

  const rdv = state.rdv
    .filter((e) => e.date >= iso(new Date()))
    .sort((a, b) => a.date.localeCompare(b.date) || a.sort - b.sort);

  const ajRdv = () => {
    if (!f.titre.trim()) return;
    setState((s) => ({ ...s, rdv: [...s.rdv, {
      id: uid(), date: f.date, titre: f.titre.trim(),
      horaires: `${hFR(f.start)}–${hFR(f.end)}`, sort: minutes(f.start),
    }] }));
    setF({ ...f, titre: "" });
  };

  const ajAct = () => {
    if (!f.titre.trim()) return;
    setState((s) => ({ ...s, kidRules: [...(s.kidRules || []), {
      id: uid(), enfant: f.enfant, day: Number(f.day),
      start: f.start, end: f.end, titre: f.titre.trim(), vacances: false,
    }] }));
    setF({ ...f, titre: "" });
  };

  return (
    <div className="space-y-4">
      <Entete eyebrow="La maison" titre="Famille" />

      <div className="flex gap-1.5 flex-wrap">
        {[["rdv", "Rendez-vous"], ["enfants", "Paul et Romane"], ["repas", "Les repas"]].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setOngl(k)} className="px-3 py-1.5 rounded-full"
            style={{ fontSize: 12.5, fontWeight: 500, background: ongl === k ? C.accent : "#fff",
                     color: ongl === k ? "#fff" : C.ink2, border: `1px solid ${ongl === k ? C.accent : C.line}` }}>
            {l}
          </button>
        ))}
      </div>

      {ongl === "rdv" && (
        <Carte className="p-4">
          <TitreSection icone={<CalendarDays size={13} style={{ color: C.rdv }} />}>À venir</TitreSection>
          {rdv.length === 0 && <p style={{ fontSize: 13.5, color: C.ink3 }}>Aucun rendez-vous posé.</p>}
          {rdv.map((e) => (
            <div key={e.id} className="flex items-center gap-2.5 py-1.5 group" style={{ borderTop: `1px solid ${C.lineSoft}` }}>
              <span style={{ width: 100, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.ink3 }}>
                {fmtShort(e.date)} · {e.horaires.split("–")[0]}
              </span>
              <span className="flex-1" style={{ fontSize: 13.5, color: C.ink }}>{e.titre}</span>
              <button type="button" aria-label="Supprimer" className="opacity-0 group-hover:opacity-100 focus:opacity-100"
                onClick={() => setState((s) => ({ ...s, rdv: s.rdv.filter((x) => x.id !== e.id) }))}>
                <Trash2 size={13} style={{ color: C.ink3 }} />
              </button>
            </div>
          ))}
          <div className="flex gap-1.5 mt-3 flex-wrap">
            <input value={f.titre} onChange={(e) => setF({ ...f, titre: e.target.value })}
              placeholder="Dentiste, syndic…" aria-label="Intitulé du rendez-vous" style={{ ...champ, flex: "1 1 160px" }} />
            <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} aria-label="Date" style={champ} />
            <input type="time" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} aria-label="Heure" style={champ} />
            <Bouton size="sm" variant="solid" onClick={ajRdv}><Plus size={13} /> Ajouter</Bouton>
          </div>
        </Carte>
      )}

      {ongl === "enfants" && (
        <Carte className="p-4">
          <TitreSection icone={<Users size={13} style={{ color: C.paul }} />}>Activités de la semaine</TitreSection>
          {(state.kidRules || []).length === 0 && (
            <p style={{ fontSize: 13.5, color: C.ink3 }}>Aucune activité enregistrée. Saisis-les une fois, elles reviennent chaque semaine.</p>
          )}
          {(state.kidRules || []).slice().sort((a, b) => a.day - b.day || minutes(a.start) - minutes(b.start)).map((r) => (
            <div key={r.id} className="flex items-center gap-2.5 py-1.5 group" style={{ borderTop: `1px solid ${C.lineSoft}` }}>
              <Pastille fg={r.enfant === "Paul" ? C.paul : C.romane} bg={r.enfant === "Paul" ? C.paulBg : C.romaneBg}>{r.enfant}</Pastille>
              <span style={{ width: 132, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.ink3 }}>
                {J_LONG[r.day]} {hFR(r.start)}
              </span>
              <span className="flex-1" style={{ fontSize: 13.5, color: C.ink }}>{r.titre}</span>
              <button type="button" aria-label="Supprimer" className="opacity-0 group-hover:opacity-100 focus:opacity-100"
                onClick={() => setState((s) => ({ ...s, kidRules: s.kidRules.filter((x) => x.id !== r.id) }))}>
                <Trash2 size={13} style={{ color: C.ink3 }} />
              </button>
            </div>
          ))}
          <div className="flex gap-1.5 mt-3 flex-wrap">
            <select value={f.enfant} onChange={(e) => setF({ ...f, enfant: e.target.value })} aria-label="Enfant" style={champ}>
              <option>Paul</option><option>Romane</option>
            </select>
            <select value={f.day} onChange={(e) => setF({ ...f, day: e.target.value })} aria-label="Jour" style={champ}>
              {[1, 2, 3, 4, 5, 6, 0].map((d) => <option key={d} value={d}>{J_LONG[d]}</option>)}
            </select>
            <input type="time" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} aria-label="Début" style={champ} />
            <input type="time" value={f.end} onChange={(e) => setF({ ...f, end: e.target.value })} aria-label="Fin" style={champ} />
            <input value={f.titre} onChange={(e) => setF({ ...f, titre: e.target.value })}
              placeholder="Judo, danse…" aria-label="Activité" style={{ ...champ, flex: "1 1 140px" }} />
            <Bouton size="sm" variant="solid" onClick={ajAct}><Plus size={13} /> Ajouter</Bouton>
          </div>
        </Carte>
      )}

      {ongl === "repas" && (
        <Carte className="p-4">
          <TitreSection icone={<Utensils size={13} style={{ color: C.repas }} />}>Les quatorze prochains soirs</TitreSection>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
            {Array.from({ length: 14 }, (_, i) => addDays(iso(new Date()), i)).map((d) => (
              <div key={d} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5" style={{ background: C.repasBg }}>
                <span style={{ width: 62, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: C.repas }}>
                  {J_COURT[dow(d)]} {fmtShort(d)}
                </span>
                <input value={state.meals[d] || ""} aria-label={`Repas du ${fmtShort(d)}`}
                  onChange={(e) => setState((s) => ({ ...s, meals: { ...s.meals, [d]: e.target.value } }))}
                  placeholder="…" className="flex-1 bg-transparent outline-none" style={{ fontSize: 12.5, color: C.ink }} />
              </div>
            ))}
          </div>
        </Carte>
      )}
    </div>
  );
}
