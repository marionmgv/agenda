import { useState } from "react";
import { Check, Pencil, Plus, Trash2, Wand2, X } from "lucide-react";
import { C, uid } from "../data.js";
import { duree, fmtShort, iso } from "../dates.js";
import { deprogrammer, programmer } from "../logic.js";
import { Bouton, Carte, Entete, Pastille, champ } from "../ui.jsx";

const nb = (n) => String(n).replace(".", ",");

export default function Progressions({ state, setState }) {
  const [classe, setClasse] = useState("cap");
  const [debut, setDebut] = useState(iso(new Date()));
  const [edit, setEdit] = useState(null);          // id de la sequence en cours d'edition
  const [brouillon, setBrouillon] = useState({ titre: "", heures: 5.5, note: "" });
  const [ajout, setAjout] = useState(false);
  const [neuve, setNeuve] = useState({ titre: "", heures: 5.5, note: "" });

  const majSeq = (id, champs) => setState((st) => ({
    ...st, sequences: st.sequences.map((x) => (x.id === id ? { ...x, ...champs } : x)),
  }));
  const supprSeq = (id) => setState((st) => ({
    ...st,
    sequences: st.sequences.filter((x) => x.id !== id),
    seances: st.seances.filter((x) => x.seqId !== id),
  }));

  const seqs = state.sequences.filter((s) => s.classe === classe).sort((a, b) => a.ordre - b.ordre);
  const col = classe === "cap" ? { fg: C.cap, bg: C.capBg } : { fg: C.mrc, bg: C.mrcBg };
  const dispo = state.slots.filter((s) => s.classe === classe && s.type === "cours");
  const hSem = dispo.reduce((a, s) => a + duree(s) * (s.quinzaine ? 0.5 : 1), 0);
  const programmees = seqs.filter((s) => s.programmee).reduce((a, s) => a + s.heures, 0);
  const total = seqs.reduce((a, s) => a + s.heures, 0);

  return (
    <div className="space-y-4">
      <Entete eyebrow="Mes classes" titre="Progressions" />

      <div className="flex gap-1.5">
        {[["cap", "Terminale CAP EPC"], ["mrc", "2nde Bac Pro MRC"]].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setClasse(k)} className="px-3 py-1.5 rounded-full"
            style={{ fontSize: 12.5, fontWeight: 500,
                     background: classe === k ? (k === "cap" ? C.cap : C.mrc) : "#fff",
                     color: classe === k ? "#fff" : C.ink2,
                     border: `1px solid ${classe === k ? (k === "cap" ? C.cap : C.mrc) : C.line}` }}>
            {l}
          </button>
        ))}
      </div>

      <Carte className="p-3.5" style={{ background: col.bg, borderColor: `${col.fg}33` }}>
        <div style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.5 }}>
          {dispo.length} créneaux par semaine, {nb(hSem)} h.
          {classe === "mrc"
            ? " Trois blocs d'une heure lundi, mardi et vendredi : une étude de cas conçue pour 3 h se joue sur trois jours différents."
            : " Deux blocs de 2 h lundi et mardi, 1 h le vendredi, plus le groupe T-COM1 en semaine 2."}
          {" "}{nb(programmees)} h programmées sur {nb(total)} h de séquences.
        </div>
      </Carte>

      <Carte className="p-4">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <label htmlFor="debut" style={{ fontSize: 12.5, color: C.ink2 }}>Programmer à partir du</label>
          <input id="debut" type="date" value={debut} onChange={(e) => setDebut(e.target.value)}
            style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "5px 9px", fontSize: 12.5, color: C.ink, outline: "none" }} />
        </div>

        {seqs.map((s) => (
          <div key={s.id} className="py-2.5" style={{ borderTop: `1px solid ${C.lineSoft}` }}>
            <div className="flex items-start gap-3 flex-wrap">
              <div className="flex-1" style={{ minWidth: 200 }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{s.titre}</span>
                  <Pastille fg={s.etat === "prête" ? col.fg : C.ink3} bg={s.etat === "prête" ? col.bg : C.lineSoft}>{s.etat}</Pastille>
                  <span style={{ fontSize: 11, color: C.ink3 }}>{nb(s.heures)} h</span>
                </div>
                {s.note && <p className="mt-0.5" style={{ fontSize: 12, color: C.ink2, lineHeight: 1.4 }}>{s.note}</p>}
                {s.programmee && s.debut && (
                  <p className="mt-1" style={{ fontSize: 11.5, color: col.fg, fontFamily: "'IBM Plex Mono', monospace" }}>
                    {s.nbSeances} séances · {fmtShort(s.debut)} → {fmtShort(s.fin)}
                  </p>
                )}
                {edit === s.id && (
                  <div className="mt-2 flex gap-1.5 flex-wrap items-center">
                    <input value={brouillon.titre} onChange={(e) => setBrouillon({ ...brouillon, titre: e.target.value })}
                      aria-label="Titre" style={{ ...champ, flex: "1 1 220px" }} />
                    <input type="number" step="0.5" min="0.5" value={brouillon.heures}
                      onChange={(e) => setBrouillon({ ...brouillon, heures: Number(e.target.value) })}
                      aria-label="Heures" style={{ ...champ, width: 80 }} />
                    <input value={brouillon.note} onChange={(e) => setBrouillon({ ...brouillon, note: e.target.value })}
                      placeholder="Note" aria-label="Note" style={{ ...champ, flex: "1 1 200px" }} />
                    <Bouton size="sm" variant="solid" onClick={() => { majSeq(s.id, brouillon); setEdit(null); }}>
                      <Check size={12} /> Enregistrer
                    </Bouton>
                    <Bouton size="sm" onClick={() => { if (confirm("Supprimer cette séquence ?")) { supprSeq(s.id); setEdit(null); } }}>
                      <Trash2 size={12} /> Supprimer
                    </Bouton>
                  </div>
                )}
              </div>
              <div className="shrink-0 flex gap-1 items-start">
                <button type="button" aria-label="Modifier la séquence" title="Modifier"
                  onClick={() => { setEdit(edit === s.id ? null : s.id); setBrouillon({ titre: s.titre, heures: s.heures, note: s.note || "" }); }}>
                  {edit === s.id ? <X size={13} style={{ color: C.ink3 }} /> : <Pencil size={13} style={{ color: C.ink3 }} />}
                </button>
                {s.programmee
                  ? <Bouton size="sm" onClick={() => setState((st) => deprogrammer(st, s.id))}><X size={12} /> Retirer</Bouton>
                  : <Bouton size="sm" variant="solid" onClick={() => setState((st) => programmer(st, s.id, debut))}><Wand2 size={12} /> Programmer</Bouton>}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-3" style={{ borderTop: `1px solid ${C.lineSoft}` }}>
          {!ajout ? (
            <Bouton size="sm" onClick={() => setAjout(true)}><Plus size={13} /> Nouvelle séquence</Bouton>
          ) : (
            <div className="flex gap-1.5 flex-wrap items-center">
              <input value={neuve.titre} onChange={(e) => setNeuve({ ...neuve, titre: e.target.value })}
                placeholder="Titre de la séquence" aria-label="Titre" style={{ ...champ, flex: "1 1 220px" }} />
              <input type="number" step="0.5" min="0.5" value={neuve.heures}
                onChange={(e) => setNeuve({ ...neuve, heures: Number(e.target.value) })}
                aria-label="Heures" style={{ ...champ, width: 80 }} />
              <Bouton size="sm" variant="solid" onClick={() => {
                if (!neuve.titre.trim()) return;
                setState((st) => ({ ...st, sequences: [...st.sequences, {
                  id: uid(), classe, ordre: seqs.length, programmee: false,
                  titre: neuve.titre.trim(), heures: neuve.heures, note: neuve.note, etat: "à construire",
                }] }));
                setNeuve({ titre: "", heures: 5.5, note: "" });
                setAjout(false);
              }}><Check size={12} /> Ajouter</Bouton>
              <Bouton size="sm" onClick={() => setAjout(false)}><X size={12} /></Bouton>
            </div>
          )}
        </div>
      </Carte>

      <p style={{ fontSize: 11.5, color: C.ink3, lineHeight: 1.55 }}>
        Programmer une séquence pose ses heures sur les créneaux libres de la classe et saute les
        vacances et les PFMP. Aucune tâche n'est créée : les listes de l'onglet Aujourd'hui se
        remplissent à la main. Le créneau T-COM1 de quinzaine est compté dans les heures, la
        co-intervention français ne reçoit pas de séance.
      </p>
    </div>
  );
}
