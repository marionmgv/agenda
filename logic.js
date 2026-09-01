import { addDays, dow, duree, hFR, minutes, numSemaine } from "./dates.js";
import { estVacances, offAt, uid } from "./data.js";

/**
 * Creneaux d'une date, exceptions ponctuelles appliquees.
 * Une exception ne touche qu'un seul jour : le creneau hebdomadaire reste intact.
 */
export function creneauxDu(state, date) {
  if (offAt(state, date).some((p) => p.type === "vac")) return [];
  const s2 = numSemaine(date, state.inverserSemaines) === 2;
  const exs = (state.exceptions || []).filter((e) => e.date === date);

  const base = state.slots
    .filter((sl) => sl.day === dow(date))
    .filter((sl) => !sl.quinzaine || s2)
    .filter((sl) => offAt(state, date, sl.classe).length === 0)
    .map((sl) => {
      const ex = exs.find((e) => e.slotId === sl.id);
      if (!ex) return sl;
      if (ex.action === "annule") return { ...sl, annule: true };
      return { ...sl, start: ex.start || sl.start, end: ex.end || sl.end, modifie: true };
    });

  const extras = (state.extras || [])
    .filter((e) => e.date === date)
    .map((e) => ({ ...e, extra: true }));

  return [...base, ...extras].sort((a, b) => minutes(a.start) - minutes(b.start));
}

/** Tout ce qui se passe une journee donnee, trie par heure. */
export function jourDe(state, date) {
  const out = [];

  state.isfec.filter((e) => e.date === date).forEach((e) => out.push({ ...e, ctx: "pro" }));

  creneauxDu(state, date).forEach((sl) => {
    const sc = state.seances.find((x) => x.date === date && x.slotId === sl.id);
    const seq = sc && state.sequences.find((q) => q.id === sc.seqId);
    out.push({
      id: `sl-${sl.id}-${date}`, date, ctx: "pro",
      kind: sl.type === "coint" ? "coint" : "cours",
      classe: sl.classe, slotId: sl.id, seanceId: sc ? sc.id : null,
      titre: seq ? seq.titre : sl.libelle || (sl.classe === "cap" ? "Terminale CAP EPC" : "2nde Bac Pro MRC"),
      numero: sc ? sc.numero : null, total: sc ? sc.total : null,
      quinzaine: !!sl.quinzaine, annule: !!sl.annule, modifie: !!sl.modifie, extra: !!sl.extra,
      start: sl.start, end: sl.end,
      horaires: `${hFR(sl.start)}–${hFR(sl.end)}`, sort: minutes(sl.start),
      modifiable: true,
    });
  });

  state.rdv.filter((e) => e.date === date).forEach((e) => out.push({ ...e, ctx: "famille", kind: "rdv" }));

  (state.kidRules || []).filter((r) => r.day === dow(date)).forEach((r) => {
    if (estVacances(state, date) && !r.vacances) return;
    out.push({
      id: `kr-${r.id}-${date}`, date, ctx: "famille", kind: "enfant",
      titre: r.titre, enfant: r.enfant,
      horaires: `${hFR(r.start)}–${hFR(r.end)}`, sort: minutes(r.start),
    });
  });

  return out.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
}

/* ------------------------------------------------------------------ */
/*  Exceptions ponctuelles : un seul jour, jamais toute l'annee        */
/* ------------------------------------------------------------------ */

export function deplacerOccurrence(state, date, slotId, start, end) {
  const autres = (state.exceptions || []).filter((e) => !(e.date === date && e.slotId === slotId));
  return { ...state, exceptions: [...autres, { id: uid(), date, slotId, action: "modifie", start, end }] };
}

export function annulerOccurrence(state, date, slotId) {
  const autres = (state.exceptions || []).filter((e) => !(e.date === date && e.slotId === slotId));
  return { ...state, exceptions: [...autres, { id: uid(), date, slotId, action: "annule" }] };
}

export function retablirOccurrence(state, date, slotId) {
  return {
    ...state,
    exceptions: (state.exceptions || []).filter((e) => !(e.date === date && e.slotId === slotId)),
  };
}

export function ajouterCoursPonctuel(state, { date, classe, start, end, libelle }) {
  return {
    ...state,
    extras: [...(state.extras || []), {
      id: uid(), date, classe, type: "cours", start, end,
      libelle: libelle || (classe === "cap" ? "Terminale CAP EPC" : "2nde Bac Pro MRC"),
    }],
  };
}

export function supprimerCoursPonctuel(state, id) {
  return {
    ...state,
    extras: (state.extras || []).filter((e) => e.id !== id),
    seances: state.seances.filter((s) => s.slotId !== id),
  };
}

/* ------------------------------------------------------------------ */
/*  Programmation d'une sequence                                       */
/*  Pose les seances sur le calendrier. Ne cree aucune tache.          */
/* ------------------------------------------------------------------ */
export function programmer(state, seqId, dateDebut) {
  const seq = state.sequences.find((s) => s.id === seqId);
  if (!seq) return state;

  const pris = new Set(state.seances.map((x) => `${x.date}|${x.slotId}`));
  const retenus = [];
  let cumul = 0, d = dateDebut, garde = 0;

  while (cumul < seq.heures - 0.01 && garde < 400) {
    garde += 1;
    creneauxDu(state, d)
      .filter((sl) => sl.classe === seq.classe && sl.type === "cours" && !sl.annule)
      .forEach((sl) => {
        if (cumul >= seq.heures - 0.01) return;
        if (pris.has(`${d}|${sl.id}`)) return;
        retenus.push({ date: d, slotId: sl.id });
        cumul += duree(sl);
      });
    d = addDays(d, 1);
  }
  if (retenus.length === 0) return state;

  const total = retenus.length;
  const seances = retenus.map((r, i) => ({
    id: uid(), seqId, date: r.date, slotId: r.slotId, numero: i + 1, total,
  }));

  return {
    ...state,
    seances: [...state.seances, ...seances],
    sequences: state.sequences.map((s) => s.id === seqId
      ? { ...s, programmee: true, debut: seances[0].date, fin: seances[total - 1].date, nbSeances: total }
      : s),
  };
}

export function deprogrammer(state, seqId) {
  return {
    ...state,
    seances: state.seances.filter((s) => s.seqId !== seqId),
    sequences: state.sequences.map((s) => s.id === seqId
      ? { ...s, programmee: false, debut: null, fin: null, nbSeances: null } : s),
  };
}
