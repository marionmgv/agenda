
/* ---------------------------------------------------------------- */
/*  Palette                                                          */
/* ---------------------------------------------------------------- */
export const C = {
  paper: "#FBFCFC", card: "#FFFFFF",
  ink: "#16262E", ink2: "#4A6068", ink3: "#8CA2AA",
  line: "#E3EAEC", lineSoft: "#EFF4F5",
  accent: "#0F6B7E", accentBg: "#E8F3F5",
  cap: "#186C44", capBg: "#E9F3ED",
  mrc: "#0D7FA8", mrcBg: "#E7F2F7",
  coint: "#B0417A", cointBg: "#FAEBF2",
  isfec: "#6B4FA0", isfecBg: "#F0EBF8",
  paul: "#2F6FD0", paulBg: "#E9F0FB",
  romane: "#D6488E", romaneBg: "#FBEAF2",
  rdv: "#B4661C", rdvBg: "#FAF0E4",
  repas: "#8A6A2F", repasBg: "#FAF6EC",
  vac: "#9AA9AE", vacBg: "#F2F5F6",
};

export const uid = () => Math.random().toString(36).slice(2, 10);

/* ---------------------------------------------------------------- */
/*  Planning ISFEC 2026-2027 (lauréats ETP mi-temps)                 */
/*  [date, demi-journée, intitulé, mode P/D, horaires, bloc]         */
/* ---------------------------------------------------------------- */
export const ISFEC_RAW = [
  ["2026-08-24","AM","Rentrée institutionnelle – Fénelon","P","13h30–16h30","admin"],
  ["2026-08-25","M","Rentrée ISFEC","P","10h–12h","admin"],
  ["2026-08-25","AM","Accueillir sa classe","P","13h30–16h30","admin"],
  ["2026-08-26","M","Construire son enseignement","P","10h–12h30","bloc 2"],
  ["2026-08-26","AM","Construire son enseignement DU","D","13h30–16h","bloc 1"],
  ["2026-08-27","AM","R1 – Regroupement disciplinaire","D","","bloc 1"],
  ["2026-09-10","AM","R2 – Regroupement disciplinaire","D","","bloc 1"],
  ["2026-09-17","M","Présentation du Journal de formation","D","10h–12h","bloc 4"],
  ["2026-09-17","AM","R3 – Regroupement disciplinaire","D","","bloc 1"],
  ["2026-09-23","M","Article de recherche 1","D","10h–12h","bloc 4"],
  ["2026-09-24","AM","R4 – Regroupement disciplinaire","D","","bloc 1"],
  ["2026-10-01","AM","R5 – Regroupement disciplinaire","D","","bloc 1"],
  ["2026-10-07","M","Le contexte institutionnel","P","9h30–12h30","bloc 3"],
  ["2026-10-07","AM","Laïcité, valeurs de la République","P","13h30–16h30","bloc 3"],
  ["2026-10-08","AM","R6 – Regroupement disciplinaire","D","","bloc 1"],
  ["2026-10-14","J","Coopération et enjeux de société","P","9h30–12h30 / 13h30–16h30","bloc 3"],
  ["2026-10-15","M","ÉVALUER 1","P","9h30–12h30","bloc 2"],
  ["2026-10-15","AM","Analyse de pratique / JF 1","P","13h30–16h30","bloc 4"],
  ["2026-10-19","J","R7 – Regroupement disciplinaire (Rennes)","P","à définir","bloc 1"],
  ["2026-10-20","J","R7 – Regroupement disciplinaire (Rennes)","P","à définir","bloc 1"],
  ["2026-10-21","J","R7 – Regroupement disciplinaire (Rennes)","P","à définir","bloc 1"],
  ["2026-10-22","M","Article de recherche (asynchrone)","D","","bloc 4"],
  ["2026-11-04","J","Éducation inclusive","P","9h30–12h30 / 13h30–16h30","bloc 2"],
  ["2026-11-05","M","DIFFÉRENCIER 1","P","9h30–12h30","bloc 2"],
  ["2026-11-05","AM","Analyse de pratique / JF 2","P","13h30–16h30","bloc 4"],
  ["2026-11-12","M","Article de recherche 2","D","10h–12h","bloc 4"],
  ["2026-11-12","AM","R8 – Regroupement disciplinaire","D","","bloc 1"],
  ["2026-11-18","J","RV inspection","P","9h30–12h / 13h30–16h","bloc 1"],
  ["2026-11-19","AM","R9 – Regroupement disciplinaire","D","","bloc 1"],
  ["2026-11-25","J","Micro-gestes professionnels","P","9h30–12h30 / 13h30–16h30","bloc 2"],
  ["2026-11-26","AM","R10 – Regroupement disciplinaire","D","","bloc 1"],
  ["2026-12-02","M","Article de recherche 3","D","10h–12h","bloc 4"],
  ["2026-12-02","AM","Père Adrien","P","14h–16h30",""],
  ["2026-12-03","J","Approche raisonnée de l'IA","P","9h30–12h30 / 13h30–16h30","bloc 2"],
  ["2026-12-09","J","Psychologie de l'adolescent","P","9h30–12h30 / 13h30–16h30","bloc 2"],
  ["2026-12-10","AM","R11 – Regroupement disciplinaire","D","","bloc 1"],
  ["2026-12-17","M","PROJET","P","9h30–12h30","bloc 2"],
  ["2026-12-17","AM","Analyse de pratique / JF 3","P","13h30–16h30","bloc 4"],
  ["2027-01-07","AM","R12 – Regroupement disciplinaire","D","","bloc 1"],
  ["2027-01-13","M","Initiation MPP","P","9h30–12h30","bloc 3"],
  ["2027-01-13","AM","3PF","P","13h30–16h","bloc 3"],
  ["2027-01-14","AM","R13 – Regroupement disciplinaire","D","","bloc 1"],
  ["2027-01-20","M","Article de recherche 4","D","10h–12h","bloc 4"],
  ["2027-01-21","AM","R14 – Regroupement disciplinaire","D","","bloc 1"],
  ["2027-01-27","M","Égalité filles-garçons","P","9h30–12h30","bloc 3"],
  ["2027-01-27","AM","EVARS","P","13h30–16h30","bloc 3"],
  ["2027-01-28","M","ATTENTION / NEURO","P","9h30–12h30","bloc 2"],
  ["2027-01-28","AM","Analyse de pratique / JF 4","P","13h30–16h30","bloc 4"],
  ["2027-02-03","M","Article de recherche 5","D","10h–12h","bloc 4"],
  ["2027-02-04","J","Entretien 1","D","8h–12h / 13h–17h","bloc 4"],
  ["2027-02-10","J","Désir d'apprendre (P. Meirieu)","P","9h30–12h30 / 13h30–16h30","bloc 3"],
  ["2027-03-03","M","Article de recherche 6","P","9h30–12h30","bloc 4"],
  ["2027-03-03","AM","R15 – Regroupement disciplinaire","D","","bloc 1"],
  ["2027-03-04","M","ÉVALUER 2","P","9h30–12h30","bloc 2"],
  ["2027-03-04","AM","Outils numériques","P","13h30–16h30","bloc 2"],
  ["2027-03-11","AM","Analyse de pratique / JF 5","P","13h30–16h30","bloc 4"],
  ["2027-03-18","M","Mouvement de l'Emploi","P","10h–12h30","admin"],
  ["2027-03-18","AM","R16 – Regroupement disciplinaire","D","","bloc 1"],
  ["2027-03-25","AM","Gestion mentale","P","13h30–16h30","bloc 2"],
  ["2027-03-31","M","Article de recherche 7","P","9h30–12h30","bloc 4"],
  ["2027-03-31","AM","R17 – Regroupement disciplinaire","D","","bloc 1"],
  ["2027-04-01","AM","Outils numériques","P","13h30–16h30","bloc 2"],
  ["2027-04-07","M","Article de recherche – rendu 1","D","","bloc 4"],
  ["2027-04-07","AM","R18 – Regroupement disciplinaire","D","","bloc 1"],
  ["2027-04-08","M","DIFFÉRENCIER 2","P","9h30–12h30","bloc 2"],
  ["2027-04-08","AM","Analyse de pratique / JF 6","P","13h30–16h30","bloc 4"],
  ["2027-04-28","J","Ludopédagogie","P","9h30–12h30 / 13h30–16h30","bloc 2"],
  ["2027-04-29","J","Anthropologie","P","9h30–12h30 / 13h30–16h30","bloc 3"],
  ["2027-05-12","M","Entretiens 2","P","8h–12h","bloc 4"],
  ["2027-05-13","M","Éducation inclusive","D","10h–12h","bloc 2"],
  ["2027-05-19","M","Article de recherche – rendu 2","D","","bloc 4"],
  ["2027-05-19","AM","R19 – Regroupement disciplinaire","D","","bloc 1"],
  ["2027-06-03","J","ISLAM","P","9h30–12h30 / 13h30–16h30","bloc 3"],
  ["2027-06-03","J","Journée de fin d'année","P","9h30–12h30 / 13h30–14h30","admin"],
];

/* Circulaire de rentrée du 21 août 2026 — ensemble scolaire Notre-Dame des Collines */
export const ETAB_RAW = [
  ["2026-08-31","J","Pré-rentrée : accueil, photo, assemblée générale au gymnase","8h30–15h30"],
  ["2026-08-31","AM","Reprise des travaux par entité","13h45"],
  ["2026-08-31","AM","Réunion des professeurs principaux","15h30"],
  ["2026-09-01","M","Rentrée des 2nde MRC","9h15"],
  ["2026-09-03","M","Rentrée des 2es années CAP","9h00"],
];

/* ---------------------------------------------------------------- */
/*  Périodes sans cours                                              */
/* ---------------------------------------------------------------- */
export const PERIODES_SEED = [
  { nom: "Vacances de la Toussaint", du: "2026-10-17", au: "2026-11-01", type: "vac" },
  { nom: "Vacances de Noël",         du: "2026-12-19", au: "2027-01-03", type: "vac" },
  { nom: "Vacances d'hiver",         du: "2027-02-13", au: "2027-02-28", type: "vac" },
  { nom: "Vacances de printemps",    du: "2027-04-10", au: "2027-04-25", type: "vac" },
  { nom: "PFMP 3 – CAP EPC",         du: "2026-11-23", au: "2026-12-19", type: "pfmp", classe: "cap" },
  { nom: "PFMP 4 – CAP EPC",         du: "2027-03-22", au: "2027-04-10", type: "pfmp", classe: "cap" },
  { nom: "PFMP 1 – 2nde MRC",        du: "2027-01-04", au: "2027-01-23", type: "pfmp", classe: "mrc" },
  { nom: "PFMP 2 – 2nde MRC",        du: "2027-06-07", au: "2027-06-26", type: "pfmp", classe: "mrc" },
];

/* Les periodes vivent desormais dans l'etat, donc modifiables dans l'application. */
export const offAt = (state, date, classe) => (state.periodes || []).filter(
  (p) => date >= p.du && date <= p.au && (p.type === "vac" || !classe || p.classe === classe)
);
export const estVacances = (state, date) =>
  (state.periodes || []).some((p) => p.type === "vac" && date >= p.du && date <= p.au);

/* ---------------------------------------------------------------- */
/*  Emploi du temps LP Notre-Dame des Collines (édition 30/08/2026)  */
/* ---------------------------------------------------------------- */
export const EDT = [
  { day: 1, start: "08:05", end: "09:55", classe: "cap", type: "cours" },
  { day: 1, start: "11:05", end: "12:00", classe: "mrc", type: "cours" },
  { day: 1, start: "14:35", end: "15:30", classe: "cap", type: "coint", quinzaine: true, libelle: "Co-intervention français" },
  { day: 2, start: "13:40", end: "14:35", classe: "mrc", type: "cours" },
  { day: 2, start: "14:35", end: "16:40", classe: "cap", type: "cours" },
  { day: 5, start: "10:10", end: "11:05", classe: "cap", type: "cours", quinzaine: true, libelle: "Groupe T-COM1" },
  { day: 5, start: "11:05", end: "12:00", classe: "mrc", type: "cours" },
  { day: 5, start: "14:35", end: "15:30", classe: "cap", type: "cours" },
  { day: 5, start: "15:45", end: "16:40", classe: "cap", type: "coint", libelle: "Co-intervention français" },
];

/* ---------------------------------------------------------------- */
/*  Progressions                                                     */
/*  CAP EPC : 132 h sur 24 semaines à 5 h 30                         */
/* ---------------------------------------------------------------- */
export const SEQ_CAP = [
  { titre: "Séq. 0 — Rentrée : cadre de classe et portfolio numérique CCF", heures: 5.5, etat: "prête", note: "1 semaine · transversal · à faire valider par la collègue de binôme" },
  { titre: "Séq. 1 — Darty : adopter une attitude professionnelle", heures: 16.5, etat: "prête", note: "3 semaines · bloc 3 · 5 missions individuelles + vidéo « accueil raté »" },
  { titre: "Séq. 2 — NOUS anti gaspi : la démarque au service de l'image", heures: 11, etat: "prête", note: "2 semaines · blocs 2 et 3 · produits impropres, démarque, gaspillage" },
  { titre: "Séq. 3 — Nova Distribution : préparer une ouverture de magasin", heures: 16.5, etat: "prête", note: "3 semaines · blocs 1, 2 et 3 · jeu en équipe sur trois journées" },
  { titre: "Évaluation sommative « Grand Frais » et préparation PFMP 3", heures: 5.5, etat: "prête", note: "1 semaine · écrit individuel 1 h, /20, 5 missions de 4 points" },
  { titre: "Séq. 4 — Le rayon vivant", heures: 16.5, etat: "à construire", note: "3 semaines · blocs 2, 1 et 3 · retour PFMP 3, mise en rayon, inventaire" },
  { titre: "Séq. 5 — L'espace qui parle", heures: 16.5, etat: "à construire", note: "3 semaines · blocs 2 et 3 · mise en valeur, ambiance, signalétique, sortie vitrines" },
  { titre: "Séq. 6 — Le bon conseil", heures: 11, etat: "à construire", note: "2 semaines · blocs 3 et 2 · conseil, démonstration, services associés" },
  { titre: "Séq. 7 — De la commande au colis", heures: 16.5, etat: "à construire", note: "3 semaines · blocs 1, 3 et 2 · commande, conditionnement, remise" },
  { titre: "Séq. 8 — Encaisser et prendre congé", heures: 16.5, etat: "à construire", note: "3 semaines · blocs 3 et 1 · caisse au magasin pédagogique, fidélisation, réclamation" },
];

export const SEQ_MRC = [
  { titre: "Séq. 1 — Intermarché Super Rive-de-Gier · « Le samedi matin »", heures: 9, etat: "prête", note: "C1.1 / C1.2 · gérer simultanément les activités" },
  { titre: "Séq. 2 — Decathlon", heures: 9, etat: "à construire" },
  { titre: "Séq. 3 — Action", heures: 9, etat: "à construire" },
  { titre: "Séq. 4 — Commerce indépendant du centre-ville", heures: 9, etat: "à construire" },
  { titre: "Séq. 5 — Boulanger / Fnac-Darty", heures: 9, etat: "à construire" },
  { titre: "Séq. 6 — Kiabi / Jules", heures: 9, etat: "à construire" },
  { titre: "Séq. 7 — McDonald's Rive-de-Gier", heures: 9, etat: "à construire" },
  { titre: "Séq. 8 — Yves Rocher / Sephora", heures: 9, etat: "à construire" },
  { titre: "Séq. 9 — Mairie, banque, office de tourisme", heures: 9, etat: "à construire" },
];


/* ---------------------------------------------------------------- */
/*  État initial                                                     */
/* ---------------------------------------------------------------- */
export function seed() {
  return {
    version: 3,
    isfec: [
      ...ISFEC_RAW.map(([date, demi, titre, mode, horaires, bloc]) => ({
        id: uid(), date, kind: "isfec", titre, demi, mode, horaires, bloc,
        sort: demi === "AM" ? 810 : 570,
      })),
      ...ETAB_RAW.map(([date, demi, titre, horaires]) => ({
        id: uid(), date, kind: "etab", titre, demi, horaires,
        sort: demi === "AM" ? 815 : 480,
      })),
    ],
    slots: EDT.map((s) => ({ id: uid(), ...s })),
    periodes: PERIODES_SEED.map((p) => ({ id: uid(), ...p })),
    sequences: [
      ...SEQ_CAP.map((s, i) => ({ id: uid(), classe: "cap", ordre: i, programmee: false, ...s })),
      ...SEQ_MRC.map((s, i) => ({ id: uid(), classe: "mrc", ordre: i, programmee: false, ...s })),
    ],
    seances: [],
    exceptions: [],   // changements ponctuels d'horaire, un seul jour a la fois
    extras: [],       // cours ajoutes ponctuellement
    rdv: [],
    tasks: [],        // saisies a la main, jamais generees
    meals: {},
    kidRules: [],
    inverserSemaines: false,
  };
}
