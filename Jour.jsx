import { useState } from "react";
import {
  AlertCircle, CalendarDays, Check, ChevronLeft, ChevronRight, Clock,
  Pencil, Plus, RotateCcw, Sun, Trash2, Utensils, X,
} from "lucide-react";
import { C, offAt, uid } from "../data.js";
import { addDays, fmtLong, hFR, iso, numSemaine, semaineISO } from "../dates.js";
import {
  ajouterCoursPonctuel, annulerOccurrence, deplacerOccurrence,
  jourDe, retablirOccurrence, supprimerCoursPonctuel,
} from "../logic.js";
import { Bouton, Carte, LigneEvent, Pastille, Tache, TitreSection, champ, couleurDe } from "../ui.jsx";

/* Une ligne de cours, modifiable pour ce jour seulement. */
function LigneCours({ ev, state, setState, date }) {
  const [edition, setEdition] = useState(false);
  const [h, setH] = useState({ start: ev.start, end: ev.end });
  const c = couleurDe(ev);

  const enregistrer = () => {
    setState((s) => deplacerOccurrence(s, date, ev.slotId, h.start, h.end));
    setEdition(false);
  };

  return (
    <div className="py-1.5" style={{ borderTop: `1px solid ${C.lineSoft}` }}>
      <div className="flex gap-2.5">
        <div className="shrink-0 pt-0.5" style={{ width: 82, fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11.5, color: C.ink3, textDecoration: ev.annule ? "line-through" : "none" }}>
          {ev.horaires}
        </div>
        <div className="flex-1 min-w-0">
          <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.35,
            color: ev.annule ? C.ink3 : C.ink, textDecoration: ev.annule ? "line-through" : "none" }}>
            {ev.titre}{ev.numero ? ` · séance ${ev.numero}/${ev.total}` : ""}
          </span>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <Pastille fg={c.fg} bg={c.bg}>{c.label}</Pastille>
            {ev.quinzaine && <Pastille fg={C.ink3} bg={C.lineSoft}>quinzaine</Pastille>}
            {ev.modifie && <Pastille fg={C.rdv} bg={C.rdvBg}>horaire modifié</Pastille>}
            {ev.annule && <Pastille fg={C.rdv} bg={C.rdvBg}>annulé</Pastille>}
            {ev.extra && <Pastille fg={C.accent} bg={C.accentBg}>ponctuel</Pastille>}
          </div>
        </div>
        <div className="shrink-0 flex gap-1">
          {(ev.modifie || ev.annule) && (
            <button type="button" aria-label="Rétablir le créneau habituel" title="Rétablir le créneau habituel"
              onClick={() => setState((s) => retablirOccurrence(s, date, ev.slotId))}>
              <RotateCcw size={13} style={{ color: C.ink3 }} />
            </button>
          )}
          {ev.extra ? (
            <button type="button" aria-label="Supprimer ce cours ponctuel"
              onClick={() => setState((s) => supprimerCoursPonctuel(s, ev.slotId))}>
              <Trash2 size={13} style={{ color: C.ink3 }} />
            </button>
          ) : (
            <button type="button" aria-label="Modifier ce jour seulement" title="Modifier ce jour seulement"
              onClick={() => { setH({ start: ev.start, end: ev.end }); setEdition(!edition); }}>
              {edition ? <X size={13} style={{ color: C.ink3 }} /> : <Pencil size={13} style={{ color: C.ink3 }} />}
            </button>
          )}
        </div>
      </div>

      {edition && (
        <div className="mt-2 ml-[92px] flex gap-1.5 flex-wrap items-center">
          <input type="time" value={h.start} onChange={(e) => setH({ ...h, start: e.target.value })} aria-label="Nouveau début" style={champ} />
          <input type="time" value={h.end} onChange={(e) => setH({ ...h, end: e.target.value })} aria-label="Nouvelle fin" style={champ} />
          <Bouton size="sm" variant="solid" onClick={enregistrer}><Check size={12} /> Ce jour-là</Bouton>
          <Bouton size="sm" onClick={() => { setState((s) => annulerOccurrence(s, date, ev.slotId)); setEdition(false); }}>
            <X size={12} /> Annuler le cours
          </Bouton>
          <span style={{ fontSize: 11, color: C.ink3, flexBasis: "100%" }}>
            Ne change que le {fmtLong(date)}. Le créneau hebdomadaire reste intact.
          </span>
        </div>
      )}
    </div>
  );
}

function BlocTaches({ titre, icone, phase, taches, date, setState, vide, style }) {
  const [txt, setTxt] = useState("");
  const toggle = (id) => setState((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === id ? { ...t, fait: !t.fait } : t) }));
  const del = (id) => setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  const ajouter = () => {
    if (!txt.trim()) return;
    setState((s) => ({ ...s, tasks: [...s.tasks, { id: uid(), phase, texte: txt.trim(), date, fait: false }] }));
    setTxt("");
  };
  return (
    <Carte className="p-4" style={style}>
      <TitreSection icone={icone}>{titre}</TitreSection>
      {taches.length === 0
        ? <p style={{ fontSize: 13.5, color: C.ink3 }}>{vide}</p>
        : taches.map((t) => <Tache key={t.id} t={t} onToggle={toggle} onDelete={del} />)}
      <div className="flex gap-1.5 mt-3">
        <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ajouter()}
          placeholder="Ajouter…" aria-label={`Ajouter dans « ${titre} »`}
          className="flex-1 px-3 py-1.5 rounded-full outline-none"
          style={{ border: `1px solid ${C.line}`, fontSize: 13, color: C.ink, background: "#fff" }} />
        <Bouton size="sm" variant="solid" onClick={ajouter} title="Ajouter"><Plus size={13} /></Bouton>
      </div>
    </Carte>
  );
}

export default function Jour({ state, setState, date, setDate }) {
  const [ajout, setAjout] = useState(false);
  const [nc, setNc] = useState({ nature: "cap", start: "08:05", end: "09:00", libelle: "" });

  const ajouterPonctuel = () => {
    if (nc.nature === "autre") {
      setState((s) => ({ ...s, isfec: [...s.isfec, {
        id: uid(), date, kind: "etab", titre: nc.libelle.trim() || "Temps professionnel",
        horaires: `${hFR(nc.start)}–${hFR(nc.end)}`, sort: 0,
      }] }));
    } else {
      setState((s) => ajouterCoursPonctuel(s, {
        date, classe: nc.nature, start: nc.start, end: nc.end, libelle: nc.libelle,
      }));
    }
    setAjout(false);
    setNc({ ...nc, libelle: "" });
  };

  const evs = jourDe(state, date);
  const off = offAt(state, date);
  const sem = numSemaine(date, state.inverserSemaines);

  const filtre = (ph) => state.tasks.filter((t) => t.phase === ph && (t.fait ? t.date === date : t.date <= date));
  const prep = filtre("prep");
  const jour = state.tasks.filter((t) => t.phase === "jour" && t.date === date);
  const apres = filtre("apres");
  const retard = apres.filter((t) => !t.fait && t.date < date).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: ".1em", color: C.ink3, textTransform: "uppercase" }}>
            {date === iso(new Date()) ? "Aujourd'hui" : "Journée"} · S{sem} · semaine {semaineISO(date)}
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 600, color: C.ink, letterSpacing: "-.02em", textTransform: "capitalize" }}>
            {fmtLong(date)}
          </h2>
        </div>
        <div className="flex gap-1">
          <Bouton size="sm" title="Jour précédent" onClick={() => setDate(addDays(date, -1))}><ChevronLeft size={14} /></Bouton>
          <Bouton size="sm" onClick={() => setDate(iso(new Date()))}>Auj.</Bouton>
          <Bouton size="sm" title="Jour suivant" onClick={() => setDate(addDays(date, 1))}><ChevronRight size={14} /></Bouton>
        </div>
      </div>

      {off.map((p) => (
        <div key={p.nom} className="rounded-xl px-3.5 py-2" style={{ background: C.vacBg, color: C.ink2, fontSize: 13 }}>{p.nom}</div>
      ))}

      <Carte className="p-4">
        <TitreSection icone={<CalendarDays size={13} style={{ color: C.ink3 }} />}>Le déroulé</TitreSection>
        {evs.length === 0 && <p style={{ fontSize: 13.5, color: C.ink3 }}>Rien de posé sur cette journée.</p>}
        {evs.map((ev) => {
          if (ev.modifiable) return <LigneCours key={ev.id} ev={ev} state={state} setState={setState} date={date} />;
          if (ev.kind === "isfec" || ev.kind === "etab") {
            return (
              <div key={ev.id} className="relative group">
                <LigneEvent ev={ev} />
                <button type="button" aria-label="Supprimer cet événement" title="Supprimer"
                  className="absolute top-2 right-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  onClick={() => setState((st) => ({ ...st, isfec: st.isfec.filter((x) => x.id !== ev.id) }))}>
                  <Trash2 size={13} style={{ color: C.ink3 }} />
                </button>
              </div>
            );
          }
          return <LigneEvent key={ev.id} ev={ev} />;
        })}

        {state.meals[date] && (
          <div className="flex gap-2.5 py-1.5" style={{ borderTop: `1px solid ${C.lineSoft}` }}>
            <div className="shrink-0" style={{ width: 82, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: C.ink3 }}>le soir</div>
            <div className="flex items-center gap-1.5">
              <Utensils size={12} style={{ color: C.repas }} />
              <span style={{ fontSize: 14, color: C.ink }}>{state.meals[date]}</span>
            </div>
          </div>
        )}

        <div className="mt-3">
          {!ajout ? (
            <Bouton size="sm" onClick={() => setAjout(true)}><Plus size={13} /> Ajouter au déroulé</Bouton>
          ) : (
            <div className="flex gap-1.5 flex-wrap items-center">
              <select value={nc.nature} onChange={(e) => setNc({ ...nc, nature: e.target.value })} aria-label="Nature" style={champ}>
                <option value="cap">Cours CAP EPC</option>
                <option value="mrc">Cours 2nde MRC</option>
                <option value="autre">Réunion, ISFEC, autre</option>
              </select>
              <input type="time" value={nc.start} onChange={(e) => setNc({ ...nc, start: e.target.value })} aria-label="Début" style={champ} />
              <input type="time" value={nc.end} onChange={(e) => setNc({ ...nc, end: e.target.value })} aria-label="Fin" style={champ} />
              <input value={nc.libelle} onChange={(e) => setNc({ ...nc, libelle: e.target.value })}
                placeholder="Intitulé (facultatif)" aria-label="Intitulé" style={{ ...champ, flex: "1 1 140px" }} />
              <Bouton size="sm" variant="solid" onClick={ajouterPonctuel}><Check size={12} /> Ajouter</Bouton>
              <Bouton size="sm" onClick={() => setAjout(false)}><X size={12} /></Bouton>
            </div>
          )}
        </div>
      </Carte>

      <BlocTaches titre="Juste avant d'entrer en classe" phase="jour" taches={jour} date={date} setState={setState}
        icone={<Clock size={13} style={{ color: C.accent }} />}
        vide="Rien à vérifier. Ajoute ce que tu ne veux pas oublier en arrivant."
        style={{ borderColor: `${C.accent}55`, background: C.accentBg }} />

      <BlocTaches titre="À préparer" phase="prep" taches={prep} date={date} setState={setState}
        icone={<Pencil size={13} style={{ color: C.ink3 }} />}
        vide="Rien en préparation." />

      <Carte className="p-4">
        <TitreSection icone={<Sun size={13} style={{ color: C.ink3 }} />}>Après la journée</TitreSection>
        {retard > 0 && (
          <div className="flex items-center gap-1.5 mb-2" style={{ fontSize: 12, color: C.rdv }}>
            <AlertCircle size={13} /> {retard} {retard > 1 ? "reports" : "report"} des jours précédents
          </div>
        )}
        <BlocTachesInterieur taches={apres} date={date} setState={setState} />
      </Carte>
    </div>
  );
}

/* Le bloc du soir vit dans sa propre carte a cause du compteur de reports. */
function BlocTachesInterieur({ taches, date, setState }) {
  const [txt, setTxt] = useState("");
  const toggle = (id) => setState((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === id ? { ...t, fait: !t.fait } : t) }));
  const del = (id) => setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  const ajouter = () => {
    if (!txt.trim()) return;
    setState((s) => ({ ...s, tasks: [...s.tasks, { id: uid(), phase: "apres", texte: txt.trim(), date, fait: false }] }));
    setTxt("");
  };
  return (
    <>
      {taches.length === 0
        ? <p style={{ fontSize: 13.5, color: C.ink3 }}>Rien en attente. Bonne soirée.</p>
        : taches.map((t) => <Tache key={t.id} t={t} onToggle={toggle} onDelete={del} />)}
      <div className="flex gap-1.5 mt-3">
        <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ajouter()}
          placeholder="Ajouter une tâche du soir" aria-label="Ajouter une tâche du soir"
          className="flex-1 px-3 py-1.5 rounded-full outline-none"
          style={{ border: `1px solid ${C.line}`, fontSize: 13, color: C.ink }} />
        <Bouton size="sm" variant="solid" onClick={ajouter} title="Ajouter"><Plus size={13} /></Bouton>
      </div>
    </>
  );
}
