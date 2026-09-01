# Ma semaine — agenda 2026-2027

Agenda pédagogique et familial pour une année de stage : les cours, la formation
ISFEC, les checklists de préparation, les repas du soir et le planning des enfants
dans une seule application, avec un export PDF de la semaine.

## Ce que l'application fait

**Aujourd'hui** — le déroulé de la journée et trois listes que l'on remplit
soi-même : à vérifier juste avant d'entrer en classe, à préparer, à faire le soir.
Rien n'est généré automatiquement. Les tâches non cochées remontent les jours
suivants.

Chaque cours porte un crayon : il modifie l'horaire ou annule le cours **pour
cette date seulement**, sans toucher au créneau hebdomadaire. Un bouton permet
aussi d'ajouter un cours ponctuel. Une exception se défait avec la flèche de
retour en arrière.

**Semaine** — les sept jours côte à côte, une bande « le soir » sous chaque
colonne pour le repas, et le bouton d'export. Deux filtres : la semaine complète,
ou la version famille où les cours deviennent des blocs « occupée ».

**Famille** — les rendez-vous, les activités récurrentes de Paul et Romane, et le
semainier des repas sur quinze jours.

**Progressions** — les séquences des deux classes. Un clic sur *Programmer* pose
les séances sur les créneaux réels et saute les vacances et les PFMP. Aucune tâche
n'est créée.

**Réglages** — les créneaux hebdomadaires, les dates de vacances et de PFMP,
l'alternance S1 / S2, et l'export ou l'import d'une sauvegarde.

## Tout se modifie depuis l'application

Il n'est pas nécessaire de toucher au code pour faire vivre l'agenda au fil de
l'année :

| Ce qui change | Où le modifier |
|---|---|
| Une heure déplacée ou un cours annulé, un seul jour | Aujourd'hui, crayon en face du cours |
| Un cours, une réunion ou un temps ISFEC en plus | Aujourd'hui, « Ajouter au déroulé » |
| Un temps ISFEC supprimé | Aujourd'hui, corbeille en face de la ligne |
| L'emploi du temps hebdomadaire | Réglages, « Notre-Dame des Collines » |
| Les dates de vacances et de PFMP | Réglages, « Vacances et PFMP » |
| Le titre, le volume ou la note d'une séquence | Progressions, crayon en face de la séquence |
| Une séquence en plus ou en moins | Progressions, « Nouvelle séquence » |
| Les tâches | Aujourd'hui, saisie libre dans les trois blocs |

Le code n'est à reprendre que pour changer l'apparence ou ajouter une
fonctionnalité.

## Démarrer

```bash
npm install
npm run dev
```

L'application s'ouvre sur `http://localhost:5173`.

```bash
npm run build     # construit le site dans dist/
npm run preview   # sert le résultat en local
```

## Mettre en ligne sur GitHub Pages

1. Créer un dépôt et y pousser le projet sur la branche `main`.
2. Dans **Settings → Pages**, choisir **GitHub Actions** comme source.
3. Pousser : le workflow `.github/workflows/deploy.yml` construit et publie.

L'adresse est `https://<utilisateur>.github.io/<dépôt>/`. Le workflow renseigne
tout seul le chemin de base via `VITE_BASE`, il n'y a rien à modifier.

Sur téléphone, ouvrir cette adresse puis « Ajouter à l'écran d'accueil » installe
l'agenda comme une application, consultable hors connexion.

## Où sont mes données

Dans le navigateur, en `localStorage`. Rien ne part sur un serveur, et donc rien
ne suit d'un appareil à l'autre. **Réglages → Sauvegarde** exporte un fichier
JSON que l'on réimporte ailleurs. À faire de temps en temps : vider les données
du navigateur efface l'agenda.

## Adapter le contenu

Presque tout se trouve dans `src/data.js`.

| À changer | Où |
|---|---|
| Valeurs de départ de l'emploi du temps | `EDT` |
| Planning ISFEC | `ISFEC_RAW` |
| Valeurs de départ des vacances et PFMP | `PERIODES_SEED` |
| Valeurs de départ des séquences | `SEQ_CAP`, `SEQ_MRC` |
| Couleurs | `C` |

Ces valeurs ne servent qu'au tout premier démarrage. Ensuite, l'agenda vit dans
le navigateur et se modifie depuis l'interface.

Après avoir modifié les données de départ, incrémenter `version` dans `seed()`
pour que l'application reconstruise son état. **Cela remplace l'agenda enregistré :
exporter une sauvegarde avant.**

L'alternance suit la parité des semaines ISO : semaine impaire = S1, semaine
paire = S2. Le bouton « Inverser la règle » dans Réglages retourne la convention
si l'établissement compte autrement.

## Organisation du code

```
src/
├── data.js            données de départ, palette, état initial
├── dates.js           utilitaires de dates, semaine 1 / semaine 2
├── logic.js           composition d'une journée, programmation des séquences
├── storage.js         localStorage, export et import JSON
├── ui.jsx             composants partagés
├── App.jsx            navigation et persistance
└── views/             les cinq écrans
```

## Sources

Emploi du temps LP Notre-Dame des Collines, édition du 30/08/2026.
Planning ISFEC « Lauréats ETP mi-temps 2026-2027 », sous réserve de modifications.
Circulaire de rentrée de l'ensemble scolaire du 21 août 2026.

## Licence

MIT — voir `LICENSE`.
