/* Utilitaires de dates — tout est manipule en chaines "AAAA-MM-JJ". */

export const J_LONG  = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
export const J_COURT = ["dim","lun","mar","mer","jeu","ven","sam"];
export const M_LONG  = ["janvier","février","mars","avril","mai","juin",
                        "juillet","août","septembre","octobre","novembre","décembre"];

export const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };

export const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };

export const dow = (s) => parse(s).getDay();

export const fmtLong  = (s) => { const d = parse(s); return `${J_LONG[d.getDay()]} ${d.getDate()} ${M_LONG[d.getMonth()]}`; };
export const fmtShort = (s) => { const d = parse(s); return `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, "0")}`; };

export const minutes = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
export const hFR = (t) => t.replace(":", "h").replace(/h00$/, "h");
export const duree = (slot) => (minutes(slot.end) - minutes(slot.start)) / 60;

export function lundiDe(s) {
  const d = parse(s);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return iso(d);
}

/** Numero de semaine ISO (norme francaise : la semaine 1 contient le 4 janvier). */
export function semaineISO(date) {
  const d = parse(date);
  const jeudi = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  jeudi.setDate(jeudi.getDate() - ((d.getDay() + 6) % 7) + 3);
  const premier = new Date(jeudi.getFullYear(), 0, 4);
  premier.setDate(premier.getDate() - ((premier.getDay() + 6) % 7) + 3);
  return 1 + Math.round((jeudi - premier) / (7 * 86400000));
}

/** Semaine impaire = S1, semaine paire = S2. Le reglage "inverser" retourne la regle. */
export function numSemaine(date, inverser) {
  const s = semaineISO(date) % 2 === 1 ? 1 : 2;
  return inverser ? (s === 1 ? 2 : 1) : s;
}
