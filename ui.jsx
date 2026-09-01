import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { C } from "./data.js";

export function couleurDe(ev) {
  if (ev.kind === "isfec")  return { fg: C.isfec, bg: C.isfecBg, label: "ISFEC" };
  if (ev.kind === "etab")   return { fg: C.ink2, bg: C.lineSoft, label: "Établissement" };
  if (ev.kind === "coint")  return { fg: C.coint, bg: C.cointBg, label: "Co-intervention" };
  if (ev.kind === "cours")  return ev.classe === "cap"
    ? { fg: C.cap, bg: C.capBg, label: "CAP EPC" }
    : { fg: C.mrc, bg: C.mrcBg, label: "2nde MRC" };
  if (ev.kind === "enfant") return ev.enfant === "Paul"
    ? { fg: C.paul, bg: C.paulBg, label: "Paul" }
    : { fg: C.romane, bg: C.romaneBg, label: "Romane" };
  return { fg: C.rdv, bg: C.rdvBg, label: "Rendez-vous" };
}

export const Pastille = ({ children, fg, bg }) => (
  <span className="inline-block px-2 py-0.5 rounded-full"
    style={{ background: bg, color: fg, fontSize: 10.5, fontFamily: "'IBM Plex Mono', monospace" }}>
    {children}
  </span>
);

export function Bouton({ children, onClick, variant = "ghost", size = "md", title }) {
  const st = {
    solid: { background: C.accent, color: "#fff", border: `1px solid ${C.accent}` },
    ghost: { background: "#fff", color: C.ink2, border: `1px solid ${C.line}` },
  }[variant];
  return (
    <button type="button" onClick={onClick} title={title}
      className={`${size === "sm" ? "px-2.5 py-1" : "px-3.5 py-1.5"} inline-flex items-center gap-1.5`}
      style={{ ...st, borderRadius: 999, fontWeight: 500, fontSize: size === "sm" ? 12 : 13 }}>
      {children}
    </button>
  );
}

export const Carte = ({ children, className = "", style = {} }) => (
  <div className={`rounded-2xl ${className}`}
    style={{ background: C.card, border: `1px solid ${C.line}`, ...style }}>
    {children}
  </div>
);

export const TitreSection = ({ children, icone }) => (
  <div className="flex items-center gap-2 mb-2.5">
    {icone}
    <h3 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: ".09em",
                 textTransform: "uppercase", color: C.ink3, fontWeight: 500 }}>{children}</h3>
  </div>
);

export const Entete = ({ eyebrow, titre }) => (
  <div>
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: ".1em",
                  color: C.ink3, textTransform: "uppercase" }}>{eyebrow}</div>
    <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 600,
                 color: C.ink, letterSpacing: "-.02em" }}>{titre}</h2>
  </div>
);

export const champ = {
  border: `1px solid ${C.line}`, borderRadius: 10, padding: "6px 10px",
  fontSize: 13, color: C.ink, outline: "none", background: "#fff",
};

export function Tache({ t, onToggle, onDelete }) {
  return (
    <div className="flex items-start gap-2.5 group py-1">
      <button type="button" onClick={() => onToggle(t.id)} className="mt-0.5 shrink-0"
        aria-label={t.fait ? "Décocher" : "Cocher"}>
        {t.fait ? <CheckCircle2 size={16} style={{ color: C.accent }} />
                : <Circle size={16} style={{ color: C.ink3 }} />}
      </button>
      <span className="flex-1" style={{ fontSize: 13.5, lineHeight: 1.45,
        color: t.fait ? C.ink3 : C.ink, textDecoration: t.fait ? "line-through" : "none" }}>
        {t.texte}
      </span>
      <button type="button" onClick={() => onDelete(t.id)} aria-label="Supprimer"
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 mt-0.5">
        <Trash2 size={13} style={{ color: C.ink3 }} />
      </button>
    </div>
  );
}

export function LigneEvent({ ev }) {
  const c = couleurDe(ev);
  return (
    <div className="flex gap-2.5 py-1.5" style={{ borderTop: `1px solid ${C.lineSoft}` }}>
      <div className="shrink-0 pt-0.5" style={{ width: 82, fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11.5, color: C.ink3, lineHeight: 1.35 }}>
        {ev.horaires || (ev.demi === "AM" ? "après-midi" : "matin")}
      </div>
      <div className="flex-1 min-w-0">
        <span style={{ fontSize: 14, color: C.ink, fontWeight: 500, lineHeight: 1.35 }}>
          {ev.titre}{ev.numero ? ` · séance ${ev.numero}/${ev.total}` : ""}
        </span>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <Pastille fg={c.fg} bg={c.bg}>{c.label}</Pastille>
          {ev.kind === "isfec" && (
            <Pastille fg={ev.mode === "P" ? "#2E6B45" : "#8A5A1E"}
                      bg={ev.mode === "P" ? "#EAF3ED" : "#FAF1E4"}>
              {ev.mode === "P" ? "présentiel" : "distanciel"}
            </Pastille>
          )}
          {ev.quinzaine && <Pastille fg={C.ink3} bg={C.lineSoft}>quinzaine</Pastille>}
          {ev.bloc && <span style={{ fontSize: 10.5, color: C.ink3 }}>{ev.bloc}</span>}
        </div>
      </div>
    </div>
  );
}
