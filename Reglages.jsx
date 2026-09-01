import { useRef, useState } from "react";
import { CalendarDays, Clock, Download, Plus, Repeat, Trash2, Upload } from "lucide-react";
import { C, uid } from "../data.js";
import { J_LONG, duree, fmtShort, hFR, iso, minutes, numSemaine, semaineISO } from "../dates.js";
import { exporter, importer } from "../storage.js";
import { Bouton, Carte, Entete, Pastille, TitreSection, champ } from "../ui.jsx";

const nb = (n) => String(n).replace(".", ",");

export default function Reglages({ state, setState }) {
  const [s, setS] = useState({ day: 1, start: "08:05", end: "09:00", classe: "cap", type: "cours" });
  const [message, setMessage] = useState("");
  const [per, setPer] = useState({ nom: "", type: "vac", classe: "cap", du: iso(new Date()), au: iso(new Date()) });
  const fichierRef = useRef(null);

  const heures = state.slots.reduce((a, x) => a + duree(x) * (x.quinzaine ? 0.5 : 1), 0);
  const aujourdhui = iso(new Date());
  const semISO = semaineISO(aujourdhui);
  const semCourante = numSemaine(aujourdhui, state.inverserSemaines);

  const surImport = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const data = await importer(f);
      setState(data);
      setMessage("Sauvegarde restaurée.");
    } catch (err) {
      setMessage(err.message);
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <Entete eyebrow="Le socle" titre="Réglages" />

      <Carte className="p-4">
        <TitreSection icone={<Repeat size={13} style={{ color: C.ink3 }} />}>Alternance des semaines</TitreSection>
        <p style={{ fontSize: 13, color: C.ink2, lineHeight: 1.5 }}>
          Semaine impaire = S1, semaine paire = S2. Nous sommes en <strong>semaine {semISO}</strong>,
          donc en <strong>S{semCourante}</strong>. Les créneaux de quinzaine — co-intervention du lundi
          et groupe T-COM1 du vendredi — n'ont lieu qu'en S2.
        </p>
        <div className="mt-2.5">
          <Bouton size="sm" onClick={() => setState((st) => ({ ...st, inverserSemaines: !st.inverserSemaines }))}>
            <Repeat size={12} /> Inverser la règle
          </Bouton>
        </div>
        <p className="mt-2" style={{ fontSize: 11.5, color: C.ink3, lineHeight: 1.5 }}>
          À n'utiliser que si l'établissement compte S1 et S2 autrement que par la parité.
        </p>
      </Carte>

      <Carte className="p-4">
        <TitreSection icone={<Clock size={13} style={{ color: C.ink3 }} />}>
          Notre-Dame des Collines — {nb(heures)} h
        </TitreSection>
        {state.slots.slice().sort((a, b) => a.day - b.day || minutes(a.start) - minutes(b.start)).map((x) => (
          <div key={x.id} className="flex items-center gap-2.5 py-1.5 group flex-wrap" style={{ borderTop: `1px solid ${C.lineSoft}` }}>
            <Pastille fg={x.type === "coint" ? C.coint : (x.classe === "cap" ? C.cap : C.mrc)}
                      bg={x.type === "coint" ? C.cointBg : (x.classe === "cap" ? C.capBg : C.mrcBg)}>
              {x.type === "coint" ? "Co-interv." : (x.classe === "cap" ? "CAP EPC" : "2nde MRC")}
            </Pastille>
            <span style={{ width: 160, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: C.ink2 }}>
              {J_LONG[x.day]} {hFR(x.start)}–{hFR(x.end)}
            </span>
            {x.libelle && <span style={{ fontSize: 12, color: C.ink3 }}>{x.libelle}</span>}
            {x.quinzaine && <Pastille fg={C.ink3} bg={C.lineSoft}>quinzaine</Pastille>}
            <span className="flex-1" />
            <button type="button" aria-label="Supprimer le créneau" className="opacity-0 group-hover:opacity-100 focus:opacity-100"
              onClick={() => setState((st) => ({ ...st, slots: st.slots.filter((y) => y.id !== x.id) }))}>
              <Trash2 size={13} style={{ color: C.ink3 }} />
            </button>
          </div>
        ))}
        <p className="mt-2 mb-1" style={{ fontSize: 11.5, color: C.ink3, lineHeight: 1.5 }}>
          Ces créneaux valent pour toute l'année. Pour un changement sur un seul jour, passe par
          l'onglet Aujourd'hui : le crayon en face du cours modifie ou annule cette date-là uniquement.
        </p>
        <div className="flex gap-1.5 mt-3 flex-wrap">
          <select value={s.classe} onChange={(e) => setS({ ...s, classe: e.target.value })} aria-label="Classe" style={champ}>
            <option value="cap">CAP EPC</option><option value="mrc">2nde MRC</option>
          </select>
          <select value={s.type} onChange={(e) => setS({ ...s, type: e.target.value })} aria-label="Type" style={champ}>
            <option value="cours">Cours</option><option value="coint">Co-intervention</option>
          </select>
          <select value={s.day} onChange={(e) => setS({ ...s, day: e.target.value })} aria-label="Jour" style={champ}>
            {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{J_LONG[d]}</option>)}
          </select>
          <input type="time" value={s.start} onChange={(e) => setS({ ...s, start: e.target.value })} aria-label="Début" style={champ} />
          <input type="time" value={s.end} onChange={(e) => setS({ ...s, end: e.target.value })} aria-label="Fin" style={champ} />
          <Bouton size="sm" variant="solid"
            onClick={() => setState((st) => ({ ...st, slots: [...st.slots, { id: uid(), ...s, day: Number(s.day) }] }))}>
            <Plus size={13} /> Ajouter
          </Bouton>
        </div>
      </Carte>

      <Carte className="p-4">
        <TitreSection icone={<CalendarDays size={13} style={{ color: C.ink3 }} />}>
          Vacances et PFMP
        </TitreSection>
        {(state.periodes || []).slice().sort((a, b) => a.du.localeCompare(b.du)).map((p) => (
          <div key={p.id} className="flex items-center gap-2.5 py-1.5 group flex-wrap" style={{ borderTop: `1px solid ${C.lineSoft}` }}>
            <Pastille fg={p.type === "vac" ? C.ink3 : (p.classe === "cap" ? C.cap : C.mrc)}
                      bg={p.type === "vac" ? C.lineSoft : (p.classe === "cap" ? C.capBg : C.mrcBg)}>
              {p.type === "vac" ? "vacances" : "PFMP"}
            </Pastille>
            <span className="flex-1" style={{ fontSize: 13, color: C.ink, minWidth: 140 }}>{p.nom}</span>
            <input type="date" value={p.du} aria-label={`Début de ${p.nom}`}
              onChange={(e) => setState((st) => ({ ...st, periodes: st.periodes.map((x) => x.id === p.id ? { ...x, du: e.target.value } : x) }))}
              style={{ ...champ, padding: "3px 7px", fontSize: 12 }} />
            <input type="date" value={p.au} aria-label={`Fin de ${p.nom}`}
              onChange={(e) => setState((st) => ({ ...st, periodes: st.periodes.map((x) => x.id === p.id ? { ...x, au: e.target.value } : x) }))}
              style={{ ...champ, padding: "3px 7px", fontSize: 12 }} />
            <button type="button" aria-label="Supprimer la période" className="opacity-0 group-hover:opacity-100 focus:opacity-100"
              onClick={() => setState((st) => ({ ...st, periodes: st.periodes.filter((x) => x.id !== p.id) }))}>
              <Trash2 size={13} style={{ color: C.ink3 }} />
            </button>
          </div>
        ))}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          <input value={per.nom} onChange={(e) => setPer({ ...per, nom: e.target.value })}
            placeholder="Nom de la période" aria-label="Nom" style={{ ...champ, flex: "1 1 150px" }} />
          <select value={per.type} onChange={(e) => setPer({ ...per, type: e.target.value })} aria-label="Type" style={champ}>
            <option value="vac">Vacances</option><option value="pfmp">PFMP</option>
          </select>
          {per.type === "pfmp" && (
            <select value={per.classe} onChange={(e) => setPer({ ...per, classe: e.target.value })} aria-label="Classe" style={champ}>
              <option value="cap">CAP EPC</option><option value="mrc">2nde MRC</option>
            </select>
          )}
          <input type="date" value={per.du} onChange={(e) => setPer({ ...per, du: e.target.value })} aria-label="Du" style={champ} />
          <input type="date" value={per.au} onChange={(e) => setPer({ ...per, au: e.target.value })} aria-label="Au" style={champ} />
          <Bouton size="sm" variant="solid" onClick={() => {
            if (!per.nom.trim()) return;
            setState((st) => ({ ...st, periodes: [...(st.periodes || []), { id: uid(), ...per, nom: per.nom.trim() }] }));
            setPer({ ...per, nom: "" });
          }}><Plus size={13} /> Ajouter</Bouton>
        </div>
        <p className="mt-2" style={{ fontSize: 11.5, color: C.ink3, lineHeight: 1.5 }}>
          Pendant une période de vacances, plus aucun cours. Pendant une PFMP, seuls les cours de la
          classe concernée disparaissent.
        </p>
      </Carte>

      <Carte className="p-4">
        <TitreSection icone={<Download size={13} style={{ color: C.ink3 }} />}>Sauvegarde</TitreSection>
        <p style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.5 }}>
          Les données restent dans ce navigateur. Exporte un fichier de temps en temps, et importe-le
          pour retrouver ton agenda sur un autre appareil.
        </p>
        <div className="flex gap-1.5 mt-2.5 flex-wrap items-center">
          <Bouton size="sm" onClick={() => exporter(state)}><Download size={12} /> Exporter</Bouton>
          <Bouton size="sm" onClick={() => fichierRef.current?.click()}><Upload size={12} /> Importer</Bouton>
          <input ref={fichierRef} type="file" accept="application/json" onChange={surImport} style={{ display: "none" }} />
          {message && <span style={{ fontSize: 12, color: C.ink2 }}>{message}</span>}
        </div>
      </Carte>
    </div>
  );
}
