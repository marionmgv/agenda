import { ChevronLeft, ChevronRight, Printer, Utensils } from "lucide-react";
import { C, offAt } from "../data.js";
import { J_COURT, M_LONG, addDays, dow, fmtShort, iso, lundiDe, numSemaine, parse } from "../dates.js";
import { jourDe } from "../logic.js";
import { Bouton, couleurDe } from "../ui.jsx";

export default function Semaine({ state, setState, date, setDate, filtre, setFiltre }) {
  const lundi = lundiDe(date);
  const jours = Array.from({ length: 7 }, (_, i) => addDays(lundi, i));
  const fin = jours[6];
  const sem = numSemaine(lundi, state.inverserSemaines);
  const libelle = `${parse(lundi).getDate()} ${M_LONG[parse(lundi).getMonth()]} → ${parse(fin).getDate()} ${M_LONG[parse(fin).getMonth()]} ${parse(fin).getFullYear()}`;
  const setRepas = (d, v) => setState((s) => ({ ...s, meals: { ...s.meals, [d]: v } }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: ".1em", color: C.ink3, textTransform: "uppercase" }}>Semaine {sem}</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: "-.02em" }}>{libelle}</h2>
        </div>
        <div className="flex gap-1 no-print">
          <Bouton size="sm" title="Semaine précédente" onClick={() => setDate(addDays(lundi, -7))}><ChevronLeft size={14} /></Bouton>
          <Bouton size="sm" onClick={() => setDate(iso(new Date()))}>Cette semaine</Bouton>
          <Bouton size="sm" title="Semaine suivante" onClick={() => setDate(addDays(lundi, 7))}><ChevronRight size={14} /></Bouton>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap no-print">
        <span style={{ fontSize: 12, color: C.ink3 }}>Export&nbsp;:</span>
        {[["tout", "Semaine complète"], ["famille", "Famille seulement"]].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setFiltre(k)} className="px-3 py-1 rounded-full"
            style={{ fontSize: 12, fontWeight: 500, background: filtre === k ? C.accent : "#fff",
                     color: filtre === k ? "#fff" : C.ink2, border: `1px solid ${filtre === k ? C.accent : C.line}` }}>
            {l}
          </button>
        ))}
        <Bouton size="sm" variant="solid" onClick={() => window.print()}>
          <Printer size={13} /> Exporter en PDF
        </Bouton>
      </div>

      <div id="feuille-semaine">
        <div className="print-entete" style={{ display: "none" }}>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, fontWeight: 600 }}>
            Semaine du {libelle} · semaine {sem}{filtre === "famille" ? " — organisation famille" : ""}
          </div>
        </div>

        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
          {jours.map((d) => {
            const evs = jourDe(state, d);
            const off = offAt(state, d);
            const auj = d === iso(new Date());
            return (
              <div key={d} className="rounded-xl overflow-hidden jour-col"
                style={{ background: C.card, border: `1px solid ${auj ? `${C.accent}66` : C.line}` }}>
                <div className="px-2.5 py-1.5 flex items-baseline justify-between" style={{ background: auj ? C.accentBg : C.lineSoft }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: ".06em", color: auj ? C.accent : C.ink2, textTransform: "uppercase" }}>
                    {J_COURT[dow(d)]}
                  </span>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, fontWeight: 600, color: auj ? C.accent : C.ink }}>
                    {fmtShort(d)}
                  </span>
                </div>

                <div className="px-2.5 py-1.5" style={{ minHeight: 88 }}>
                  {off.map((p) => (
                    <div key={p.nom} className="rounded px-1.5 py-1 mb-1" style={{ background: C.vacBg, color: C.ink2, fontSize: 10.5 }}>{p.nom}</div>
                  ))}
                  {evs.length === 0 && off.length === 0 && <div style={{ fontSize: 11, color: C.ink3, paddingTop: 4 }}>—</div>}
                  {evs.map((ev) => {
                    if (filtre === "famille" && ev.ctx === "pro") {
                      return (
                        <div key={ev.id} className="rounded px-1.5 py-1 mb-1" style={{ background: C.vacBg, color: C.ink2, fontSize: 10.5, lineHeight: 1.3 }}>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                            {ev.horaires || (ev.demi === "AM" ? "après-midi" : "matin")}
                          </span> — occupée
                        </div>
                      );
                    }
                    const c = couleurDe(ev);
                    return (
                      <div key={ev.id} className="rounded px-1.5 py-1 mb-1" style={{ background: c.bg, borderLeft: `2.5px solid ${c.fg}`, lineHeight: 1.3 }}>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: c.fg }}>
                          {ev.horaires || (ev.demi === "AM" ? "après-midi" : "matin")}{ev.mode === "D" ? " · distanciel" : ""}
                        </div>
                        <div style={{ fontSize: 11, color: C.ink, fontWeight: 500 }}>
                          {ev.titre}{ev.numero ? ` (${ev.numero}/${ev.total})` : ""}
                        </div>
                        {ev.enfant && <div style={{ fontSize: 9.5, color: c.fg }}>{ev.enfant}</div>}
                      </div>
                    );
                  })}
                </div>

                <div className="px-2.5 py-1.5" style={{ background: C.repasBg, borderTop: `1px solid ${C.line}` }}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <Utensils size={9} style={{ color: C.repas }} />
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: ".06em", color: C.repas, textTransform: "uppercase" }}>le soir</span>
                  </div>
                  <input value={state.meals[d] || ""} onChange={(e) => setRepas(d, e.target.value)}
                    placeholder="…" aria-label={`Repas du ${fmtShort(d)}`}
                    className="w-full bg-transparent outline-none" style={{ fontSize: 11.5, color: C.ink }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
